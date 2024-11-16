import { migrate } from "drizzle-orm/pglite/migrator";

import { db } from ".";

async function applyMigrations() {
  await migrate(db, { migrationsFolder: "src/server/db/generated" });
}

export { applyMigrations };
