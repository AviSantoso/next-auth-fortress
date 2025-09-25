import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const SESSION_KEY = process.env.SESSION_KEY!;

if (!SESSION_KEY) {
  throw new Error("SESSION_KEY is not set");
}

const cookieName = "auth-user";

export type TAuthSession = {
  userId?: number;
  email?: string;
  challenge?: string;
};

export async function getSession() {
  const session = await getIronSession<TAuthSession>(await cookies(), {
    password: SESSION_KEY,
    cookieName,
    ttl: 60 * 60 * 24 * 7, // 7 days
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  });
  return session;
}
