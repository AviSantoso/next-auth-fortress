"use server";

import { eq, gte, and, ne } from "drizzle-orm";
import { db } from "../utils/db";
import { MagicTokenRow, MagicTokensTable } from "../utils/schema";

export async function createMagicToken({
  token,
  email,
  expiresAt,
}: {
  token: string;
  email: string;
  expiresAt: Date;
}): Promise<MagicTokenRow> {
  const magicToken = await db
    .insert(MagicTokensTable)
    .values({
      token,
      email,
      expiresAt,
    })
    .returning()
    .then(([magicToken]) => magicToken);

  return magicToken;
}

export async function getValidTokenByEmail({
  email,
}: {
  email: string;
}): Promise<MagicTokenRow | null> {
  const magicTokens = await db
    .select()
    .from(MagicTokensTable)
    .where(
      and(
        eq(MagicTokensTable.email, email),
        gte(MagicTokensTable.expiresAt, new Date()),
        ne(MagicTokensTable.isArchived, true)
      )
    )
    .limit(1);

  return magicTokens.length > 0 ? magicTokens[0] : null;
}

export async function getValidTokenByToken({
  token,
}: {
  token: string;
}): Promise<MagicTokenRow | null> {
  const magicTokens = await db
    .select()
    .from(MagicTokensTable)
    .where(
      and(
        eq(MagicTokensTable.token, token),
        gte(MagicTokensTable.expiresAt, new Date()),
        ne(MagicTokensTable.isArchived, true)
      )
    );

  return magicTokens.length > 0 ? magicTokens[0] : null;
}

export async function expireToken({ tokenId }: { tokenId: number }) {
  await db
    .update(MagicTokensTable)
    .set({ isArchived: true })
    .where(eq(MagicTokensTable.id, tokenId));
}
