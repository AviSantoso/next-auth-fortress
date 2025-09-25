"use server";

import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { GenerateAuthenticationOptionsOpts } from "@simplewebauthn/server";
import type { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/types";

import { getSession } from "@/lib/utils/getSession";
import { generateChallenge, HOST_SETTINGS } from "@/lib/utils/webauthn";

export async function getLoginOptions(): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const challenge = await generateChallenge();
  const session = await getSession();

  session.challenge = challenge;
  await session.save();

  const authOptions: GenerateAuthenticationOptionsOpts = {
    challenge,
    rpID: HOST_SETTINGS.expectedRPID,
    userVerification: "preferred",
    timeout: 60000,
  };

  const authenticationOptions: PublicKeyCredentialRequestOptionsJSON =
    await generateAuthenticationOptions(authOptions);

  return authenticationOptions;
}
