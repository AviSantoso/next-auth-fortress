"use server";

import { setAuth } from "./setAuth";
import { getOrCreateUser } from "@/lib/services/UserService";
import {
  expireToken,
  getValidTokenByToken,
} from "@/lib/services/MagicTokenService";

export async function tryLoginWithToken({ token }: { token: string }) {
  const dbToken = await getValidTokenByToken({ token });

  if (!dbToken) {
    throw new Error("Invalid token");
  }

  await expireToken({ tokenId: dbToken.id });

  const user = await getOrCreateUser({ email: dbToken.email });

  await setAuth({ email: dbToken.email, userId: user.id });
}
