import crypto from "crypto";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const RPID = process.env.RPID;

if (!RPID) {
  throw new Error("Environment variable RPID is not set");
}

export const HOST_SETTINGS = {
  expectedOrigin: APP_URL,
  expectedRPID: RPID,
};

export async function generateChallenge(): Promise<string> {
  return crypto.randomBytes(32).toString("hex");
}
