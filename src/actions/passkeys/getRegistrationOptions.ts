"use server";

import { generateRegistrationOptions } from "@simplewebauthn/server";
import type { GenerateRegistrationOptionsOpts } from "@simplewebauthn/server";
import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";

import { getSession } from "@/lib/utils/getSession";
import {
  generateChallenge,
  HOST_SETTINGS,
  stringToUint8Array,
} from "@/lib/utils/webauthn";
import { getUserByEmail } from "@/lib/services/UserService";

export async function getRegistrationOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const session = await getSession();
  const email = session.email;

  if (!email) {
    console.error("User not authenticated. Cannot generate passkey options.");
    throw new Error("User not authenticated. Cannot generate passkey options.");
  }

  const user = await getUserByEmail({ email });

  if (!user) {
    console.error("User not found in database for the given ID.");
    throw new Error("User not found in database for the given ID.");
  }

  console.log({ email, user });

  const challenge = await generateChallenge();

  session.challenge = challenge;

  await session.save();

  const idBytes = stringToUint8Array(user.id.toString());

  console.log({ idBytes });

  const userName = user.email;

  const options: GenerateRegistrationOptionsOpts = {
    challenge,
    rpName: "Next-Auth Fortress", // The name of your application, displayed to the user
    rpID: HOST_SETTINGS.expectedRPID,
    userID: idBytes, // The user's unique ID
    userName: userName, // The user's email, used as canonical name
    userDisplayName: user.email, // Human-friendly name displayed by authenticator
    timeout: 60000, // How long the user has to complete registration (in ms)
    attestationType: "none", // 'none' is generally recommended for privacy
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
    supportedAlgorithmIDs: [-7, -257], // Common elliptic curve P-256 and RSA PSS
  };

  return await generateRegistrationOptions(options);
}
