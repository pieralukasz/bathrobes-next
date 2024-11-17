import { exec } from "child_process";
import { promisify } from "util";
import postgres from "postgres";

const execAsync = promisify(exec);

async function setupTestDb() {
  console.log("🔄 Starting database setup...");

  try {
    console.log("📥 Stopping existing containers...");
    await execAsync("npm run db:down");
    await execAsync("docker volume rm ll-bathrobe_postgres_data || true");

    console.log("🚀 Starting new PostgreSQL container...");
    await execAsync("npm run db:up");

    console.log("⏳ Waiting for PostgreSQL to be ready...");
    const sql = postgres({
      host: "localhost",
      port: 5433,
      database: "tests",
      username: "drizzle",
      password: "drizzle",
    });

    let retries = 30;
    while (retries > 0) {
      try {
        await sql`SELECT 1`;
        break;
      } catch (error) {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    await sql.end();

    if (retries === 0) {
      throw new Error("Database failed to start");
    }

    console.log("📊 Pushing database schema...");
    await execAsync("npm run db:push");

    console.log("🌱 Seeding database...");
    await execAsync("npm run db:seed");

    console.log("✅ Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Error during database setup:", error);
    process.exit(1);
  }
}

setupDb();
