"use server";

import { eq, and } from "drizzle-orm";
import { db } from "../utils/db";
import {
  UserCredentialRow,
  UserCredentialTable,
  UserCredentialInsert,
  UserTable,
} from "../utils/schema";

const domain = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function getCredentialByExternalId({
  externalId,
}: {
  externalId: string;
}): Promise<UserCredentialRow | null> {
  return db
    .select()
    .from(UserCredentialTable)
    .where(
      and(
        eq(UserCredentialTable.externalId, externalId),
        eq(UserCredentialTable.domain, domain)
      )
    )
    .limit(1)
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      return result[0];
    });
}

export async function getCredentialById({
  credentialId,
}: {
  credentialId: number;
}): Promise<UserCredentialRow | null> {
  return db
    .select()
    .from(UserCredentialTable)
    .where(
      and(
        eq(UserCredentialTable.id, credentialId),
        eq(UserCredentialTable.domain, domain)
      )
    )
    .limit(1)
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      return result[0];
    });
}

export async function getCredentialIdsByEmail({
  email,
}: {
  email: string;
}): Promise<{ id: number }[]> {
  return db.query.UserTable.findMany({
    where: eq(UserTable.email, email),
    with: {
      credentials: {
        where: eq(UserCredentialTable.domain, domain),
        columns: {
          id: true,
        },
      },
    },
  }).then((result) => {
    return result.map((user) => user.credentials).flat();
  });
}

export async function incrementSignCount({
  credentialId,
}: {
  credentialId: number;
}) {
  const dbCredential = await getCredentialById({ credentialId });

  if (!dbCredential) {
    throw new Error(`User credential not found for id: ${credentialId}`);
  }

  const newSignCount = dbCredential.signCount + 1;

  await db
    .update(UserCredentialTable)
    .set({ signCount: newSignCount, updatedAt: new Date() })
    .where(
      and(
        eq(UserCredentialTable.id, credentialId),
        eq(UserCredentialTable.domain, domain)
      )
    );
}

export async function createCredential(
  insert: UserCredentialInsert
): Promise<UserCredentialRow> {
  return db
    .insert(UserCredentialTable)
    .values(insert)
    .returning()
    .then(([credential]) => credential);
}
