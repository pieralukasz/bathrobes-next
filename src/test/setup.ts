import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterAll, vi } from "vitest";

import * as schema from "../server/db/schema";
import { db } from "../server/db";

vi.mock("~/env", () => ({
  env: {
    XML_URL: "http://example.com/test.xml",
  },
}));

vi.mock("../server/db", async (importOriginal) => {
  const client = postgres("postgres://drizzle:drizzle@localhost:5433/tests", {
    max: 1,
  });

  const db = drizzle(client, { schema });

  return {
    ...(await importOriginal<typeof import("../server/db")>()),
    db,
    client,
  };
});

afterAll(async () => {
  await db.$client.end();
});
