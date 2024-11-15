import { pgTable } from "drizzle-orm/pg-core";
import { integer, varchar } from "drizzle-orm/pg-core";
import { timestampColumns } from "./timestamp";

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  ...timestampColumns,
});

export type InferCategory = typeof categories.$inferSelect;
