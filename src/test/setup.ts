import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import * as schema from "../server/db/schema";
import { db } from "../server/db";
import { applyMigrations } from "../server/db/migrate";

vi.mock("~/env", () => ({
  env: {
    XML_URL: "http://example.com/test.xml",
  },
}));

vi.mock("../server/db", async (importOriginal) => {
  const client = postgres(
    "postgresql://docker:docker@localhost:5432/postgres",
    { max: 1 },
  );

  const db = drizzle(client, { schema });

  return {
    ...(await importOriginal<typeof import("../server/db")>()),
    db,
    client,
  };
});

// Clear all tables after each test
afterEach(async () => {
  await db.execute(sql`
    TRUNCATE TABLE products, product_colors, product_sizes, categories CASCADE;
  `);
});

beforeAll(async () => {
  await applyMigrations();
});

afterAll(async () => {
  await db.$client.end();
});
