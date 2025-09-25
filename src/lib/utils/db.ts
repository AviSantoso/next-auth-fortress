import * as schema from "./schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

const DB_FILE_NAME = process.env.DB_FILE_NAME as string;

if (!DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME is not set");
}

export const db = drizzle({
  connection: DB_FILE_NAME,
  casing: "snake_case",
  schema,
});
