"use server";

import { cookies } from "next/headers";

export async function clearAuth() {
  const cookieStore = await cookies();

  cookieStore.set("auth-user", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Expire immediately
  });

  return { success: true };
}
