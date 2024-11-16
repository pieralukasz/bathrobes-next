// import postgres from "postgres";
// import { drizzle } from "drizzle-orm/postgres-js";
// import { sql } from "drizzle-orm";
// import { afterAll, afterEach, beforeEach, vi } from "vitest";

// import * as schema from "../server/db/schema";
// import { db } from "../server/db";
// import { applyMigrations } from "../server/db/migrate";

// // Mock environment variables
// vi.mock("~/env", () => ({
//   env: {
//     XML_URL: "http://example.com/test.xml",
//   },
// }));

// // Replace the database with a new in-memory database
// vi.mock("database/db", async (importOriginal) => {
//   const client = postgres(
//     "postgresql://docker:docker@localhost:5432/postgres",
//     { max: 1 },
//   );
//   const db = drizzle(client, { schema });
//   return {
//     ...(await importOriginal<typeof import("../server/db")>()),
//     db,
//     client,
//   };
// });

// // Apply migrations before each test
// beforeEach(async () => {
//   await applyMigrations();
// });

// // Clean up the database after each test
// afterEach(async () => {
//   await db.execute(sql`drop schema if exists public cascade`);
//   await db.execute(sql`create schema public`);
//   await db.execute(sql`drop schema if exists drizzle cascade`);
// });

// // Free up resources after all tests are done
// afterAll(async () => {
//   const { conn } = await import("../server/db");
//   await conn.end();
// });
