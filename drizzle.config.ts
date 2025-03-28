import { type Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  schema: "./src/server/db/schema/index.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // @ts-ignore
    prepare: false,
  },
  tablesFilter: ["ll-bathrobes_*"],
} satisfies Config;
