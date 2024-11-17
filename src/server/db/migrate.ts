import { migrate } from "drizzle-orm/pglite/migrator";

import { db } from ".";

async function applyMigrations() {
  await migrate(db, { migrationsFolder: "supabase/migrations" });
}

export { applyMigrations };
