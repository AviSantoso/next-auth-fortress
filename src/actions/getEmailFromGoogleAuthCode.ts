"use server";

import { client } from "@/lib/utils/getGoogleOAuthClient";
import { google } from "googleapis";

export async function getEmailFromGoogleAuthCode(code: string) {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const userInfo = await oauth2.userinfo.get();

  return userInfo.data.email;
}
