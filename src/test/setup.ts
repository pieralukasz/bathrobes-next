import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterAll, beforeAll, vi } from "vitest";

import * as schema from "../server/db/schema";
import { db } from "../server/db";
import { seedDatabase } from "~/server/db/seed";

vi.mock("~/env", () => ({
  env: {
    XML_URL: "http://example.com/test.xml",
    DATABASE_URL: "postgres://drizzle:drizzle@localhost:5433/local_db",
  },
}));

vi.mock("../server/db", async (importOriginal) => {
  const client = postgres(
    "postgres://drizzle:drizzle@localhost:5433/local_db",
    {
      max: 1,
    },
  );

  const db = drizzle(client, { schema });

  return {
    db,
    client,
  };
});

beforeAll(async () => {
  await seedDatabase();
});

afterAll(async () => {
  await db.$client.end();
});
