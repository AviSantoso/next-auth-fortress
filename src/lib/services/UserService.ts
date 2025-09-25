"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/utils/db";
import { UserRow, UserTable } from "@/lib/utils/schema";

export async function getUserById({
  userId,
}: {
  userId: number;
}): Promise<UserRow | null> {
  return db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, userId))
    .limit(1)
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      return result[0];
    });
}

export async function getOrCreateUser({
  email,
}: {
  email: string;
}): Promise<UserRow> {
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email))
    .limit(1);

  let user: UserRow | null = null;

  if (users.length > 0) {
    user = users[0];
  }

  if (!user) {
    user = await db
      .insert(UserTable)
      .values({ email })
      .returning()
      .then(([user]) => user);
  }

  if (!user) {
    throw new Error(`Failed to create user`);
  }

  return user;
}

export async function getUserByEmail({
  email,
}: {
  email: string;
}): Promise<UserRow | null> {
  return db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email))
    .limit(1)
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      return result[0];
    });
}
