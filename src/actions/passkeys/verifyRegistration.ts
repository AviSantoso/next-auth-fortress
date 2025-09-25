"use server";

import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { VerifiedRegistrationResponse } from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticatorTransportFuture,
} from "@simplewebauthn/types";

import { getSession } from "@/lib/utils/getSession";
import { HOST_SETTINGS } from "@/lib/utils/webauthn";
import { getUserByEmail } from "@/lib/services/UserService";
import {
  createCredential,
  getCredentialByExternalId,
} from "@/lib/services/UserCredentialService";

export async function verifyRegistration(
  registrationResponse: RegistrationResponseJSON
): Promise<{ credentialId: string }> {
  const session = await getSession();
  const email = session.email;
  const challenge = session.challenge;

  if (!email) {
    throw new Error("User not authenticated.");
  }

  if (!challenge) {
    throw new Error(
      "Session challenge missing. Please try generating registration options again."
    );
  }

  if (registrationResponse == null) {
    throw new Error("Invalid registration response received from client.");
  }

  let verificationResult: VerifiedRegistrationResponse;

  try {
    verificationResult = await verifyRegistrationResponse({
      response: registrationResponse, // The client's response
      expectedChallenge: (challengeB64) => {
        const challengeBuffer = Buffer.from(challengeB64, "base64");
        const challengeHex = challengeBuffer.toString();
        return challengeHex === challenge;
      }, // Use our custom function to verify the challenge
      expectedOrigin: HOST_SETTINGS.expectedOrigin, // Your application's origin (e.g., 'https://yourdomain.com')
      expectedRPID: HOST_SETTINGS.expectedRPID, // Your Relying Party ID (domain/subdomain)
      requireUserVerification: false, // Enforce user verification (PIN/biometrics), matching the options generated
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      `[WebAuthn] Passkey registration verification failed: ${error}`
    );
  }

  const { verified, registrationInfo } = verificationResult;

  // If `verified` is false, or `registrationInfo` (containing credential data) is missing,
  // something went wrong during verification.
  if (!verified || !registrationInfo) {
    throw new Error("Passkey registration response could not be verified.");
  }

  const credential = registrationInfo.credential;

  if (
    credential.id == null ||
    credential.publicKey == null ||
    credential.counter == null
  ) {
    throw new Error(
      "[WebAuthn] Missing critical credential information after successful verification."
    );
  }

  // Clear the used challenge from the session.
  // This is crucial to prevent replay attacks where a malicious actor tries to reuse
  // a valid challenge to register another credential.
  delete session.challenge;

  await session.save();

  // Save the new credential data to your database.
  try {
    const user = await getUserByEmail({ email });

    if (!user) {
      throw new Error(
        `[WebAuthn] User with email ${email} not found when saving credential.`
      );
    }

    // Before inserting, check if a passkey with this externalID (credentialID) already exists.
    // This prevents creating duplicate entries if a user tries to add the same physical passkey twice.
    const existingCredential = await getCredentialByExternalId({
      externalId: credential.id,
    });

    if (existingCredential) {
      throw new Error(
        `[WebAuthn] Attempted to register duplicate passkey for user ${email}, ID: ${credential.id}`
      );
    }

    await createCredential({
      userId: user.id,
      name: user.email,
      externalId: credential.id,
      publicKey: credential.publicKey as Buffer,
      signCount: 0, // Always set to 0 for new passkeys
      transports: registrationResponse.response
        .transports as AuthenticatorTransportFuture[],
      domain: HOST_SETTINGS.expectedOrigin,
    });

    console.log(
      `[WebAuthn] Successfully saved new passkey for user ${email}, credential ID: ${credential.id}`
    );

    return { credentialId: credential.id };
  } catch (dbError) {
    console.error(dbError);
    throw new Error(
      `[WebAuthn] Database error while saving new credential: ${dbError}`
    );
  }
}
