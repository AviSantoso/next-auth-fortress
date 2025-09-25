import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
  index,
  blob,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

const baseEntity = {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(cast(strftime('%s', 'now') as integer))`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(cast(strftime('%s', 'now') as integer))`),
  isArchived: integer("is_archived", { mode: "boolean" })
    .notNull()
    .default(false),
};

export const MagicTokensTable = sqliteTable(
  "MagicTokens",
  {
    ...baseEntity,
    token: text("token").unique().notNull(),
    email: text("email").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    uniqueIndex("MagicTokens_unique_idx").on(table.token),
    index("MagicTokens_email_idx").on(table.email),
  ]
);

export const UserTable = sqliteTable(
  "User",
  {
    ...baseEntity,
    firstName: text("first_name"),
    email: text("email").unique().notNull(),
  },
  (table) => [uniqueIndex("User_email_unique_idx").on(table.email)]
);

export const UserCredentialTable = sqliteTable(
  "UserCredential",
  {
    ...baseEntity,
    userId: integer("user_id").notNull(),
    name: text("name").notNull(),
    externalId: text("external_id").notNull().unique(),
    publicKey: blob("public_key").unique().notNull(),
    signCount: integer("sign_count").default(0).notNull(),
    transports: text("transports", { mode: "json" }),
    domain: text("domain").notNull(),
  },
  (table) => [index("UserCredential_user_id_idx").on(table.userId)]
);

export const userRelations = relations(UserTable, ({ many }) => ({
  credentials: many(UserCredentialTable),
}));

export const userCredentialRelations = relations(
  UserCredentialTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserCredentialTable.userId],
      references: [UserTable.id],
    }),
  })
);

export type MagicTokenRow = typeof MagicTokensTable.$inferSelect;
export type MagicTokenInsert = typeof MagicTokensTable.$inferInsert;

export type UserRow = typeof UserTable.$inferSelect;
export type UserInsert = typeof UserTable.$inferInsert;

export type UserCredentialRow = typeof UserCredentialTable.$inferSelect;
export type UserCredentialInsert = typeof UserCredentialTable.$inferInsert;
