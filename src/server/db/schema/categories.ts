import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./timestamp";

export const categories = table("categories", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: t.varchar("name", { length: 256 }).notNull(),
  slug: t.varchar("slug", { length: 256 }).notNull(),
  ...timestamps,
});

export type InferCategory = typeof categories.$inferSelect;
