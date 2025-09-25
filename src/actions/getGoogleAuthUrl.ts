"use server";

import { client, scopes } from "@/lib/utils/getGoogleOAuthClient";

export async function getGoogleAuthUrl() {
  return client.generateAuthUrl({
    scope: scopes,
    prompt: "consent",
  });
}
