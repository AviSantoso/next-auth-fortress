"use server";

import { getSession } from "@/lib/utils/getSession";

type TSetAuthResult = {
  success: boolean;
  email: string;
  userId: number;
};

export async function setAuth({
  email,
  userId,
}: {
  email: string;
  userId: number;
}): Promise<TSetAuthResult> {
  const session = await getSession();
  session.email = email;
  session.userId = userId;
  await session.save();

  return { success: true, email, userId };
}
