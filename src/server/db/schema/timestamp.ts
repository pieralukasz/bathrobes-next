import { timestamp, PgTimestampConfig } from "drizzle-orm/pg-core";

export const commonTimestampConfig: PgTimestampConfig = { withTimezone: true };

const createdAt = timestamp("created_at", commonTimestampConfig)
  .notNull()
  .defaultNow();

const updatedAt = timestamp("updated_at", commonTimestampConfig)
  .notNull()
  .defaultNow();

const deletedAt = timestamp("deleted_at", commonTimestampConfig);

export const timestampColumns = {
  createdAt,
  updatedAt,
  deletedAt,
} as const;
