import { timestamp } from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at", { withTimezone: true })
  .$onUpdate(() => new Date())
  .notNull();

const updatedAt = timestamp("updated_at", { withTimezone: true }).$onUpdate(
  () => new Date(),
);

const deletedAt = timestamp("deleted_at", { withTimezone: true });

export const timestamps = {
  updatedAt,
  createdAt,
  deletedAt,
};
