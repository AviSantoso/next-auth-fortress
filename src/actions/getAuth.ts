"use server";

import { getSession } from "@/lib/utils/getSession";

type TGetAuthResult = {
  email: string | null;
};

export async function getAuth(): Promise<TGetAuthResult> {
  const session = await getSession();
  const email = session.email;

  if (email) {
    return {
      email,
    };
  }

  return {
    email: null,
  };
}
