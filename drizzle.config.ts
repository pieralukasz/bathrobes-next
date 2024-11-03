import { type Config } from "drizzle-kit";
import { env } from "~/utils/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["ll-bathrobes_*"],
} satisfies Config;
