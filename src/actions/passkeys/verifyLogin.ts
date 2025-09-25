"use server";

import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type {
  VerifiedAuthenticationResponse,
  WebAuthnCredential,
} from "@simplewebauthn/server";
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from "@simplewebauthn/types";

import { getSession } from "@/lib/utils/getSession";
import { HOST_SETTINGS } from "@/lib/utils/webauthn";
import { setAuth } from "../setAuth";
import { getUserById } from "@/lib/services/UserService";
import {
  getCredentialByExternalId,
  incrementSignCount,
} from "@/lib/services/UserCredentialService";

export async function verifyLogin(
  authResponse: AuthenticationResponseJSON
): Promise<void> {
  const session = await getSession();
  const challenge = session.challenge;

  if (!challenge) {
    throw new Error("Challenge missing from session. Please start over.");
  }

  const dbCredential = await getCredentialByExternalId({
    externalId: authResponse.rawId,
  });

  if (!dbCredential) {
    throw new Error(`Was not able to find the passkey in the database.`);
  }

  let verification: VerifiedAuthenticationResponse;
  try {
    verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: (challengeB64) => {
        const challengeBuffer = Buffer.from(challengeB64, "base64");
        const challengeHex = challengeBuffer.toString();
        return challengeHex === challenge;
      },
      expectedOrigin: HOST_SETTINGS.expectedOrigin,
      expectedRPID: HOST_SETTINGS.expectedRPID,
      credential: {
        id: Buffer.from(dbCredential.externalId).toString(),
        publicKey: dbCredential.publicKey,
        counter: dbCredential.signCount,
        transports:
          (dbCredential.transports as AuthenticatorTransportFuture[]) ||
          undefined,
      } as WebAuthnCredential,
      requireUserVerification: false,
    });
  } catch (error: unknown) {
    throw new Error(`Verification failed: ${error}`);
  }

  const { verified } = verification;

  if (!verified) {
    throw new Error("Could not verify passkey authentication.");
  }

  // CRITICAL: Update the signature counter in the database.
  // This prevents replay attacks and helps detect cloned authenticators.
  await incrementSignCount({ credentialId: dbCredential.id });

  const user = await getUserById({ userId: dbCredential.userId });

  if (!user) {
    throw new Error("User not found.");
  }

  await setAuth({ email: user.email, userId: user.id });
}
