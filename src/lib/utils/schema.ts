import {
  boolean,
  integer,
  pgTable,
  timestamp,
  text,
  customType,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const bytea = customType<{
  data: Buffer;
  default: false;
}>({
  dataType() {
    return "bytea";
  },
});

const baseEntity = {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isArchived: boolean("is_archived").notNull().default(false),
};

export const MagicTokensTable = pgTable(
  "MagicTokens",
  {
    ...baseEntity,
    token: text("token").unique().notNull(),
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [
    uniqueIndex("MagicTokens_unique_idx").on(table.token),
    index("MagicTokens_email_idx").on(table.email),
  ]
);

export const UserTable = pgTable(
  "User",
  {
    ...baseEntity,
    firstName: text("first_name"),
    email: text("email").unique().notNull(),
  },
  (table) => [uniqueIndex("User_email_unique_idx").on(table.email)]
);

export const UserCredentialTable = pgTable(
  "UserCredential",
  {
    ...baseEntity,
    userId: integer("user_id").notNull(),
    name: text("name").notNull(), // A human-readable name for the credential
    externalId: text("external_id").notNull().unique(), // credentialID from WebAuthn
    publicKey: bytea("public_key").unique().notNull(), // Public key material
    signCount: integer("sign_count").default(0).notNull(), // Security counter
    transports: text("transports").array(), // Authenticator transports (e.g., "usb", "ble", "nfc", "internal")
    domain: text("domain").notNull(),
  },
  (table) => [index("UserCredential_user_id_idx").on(table.userId)]
);

// Define foreign key relations
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
