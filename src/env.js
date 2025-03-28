import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    ADMIN_EMAIL: z.string().email(),
    DATABASE_URL: z.string().url(),
    DATABASE_PASSWORD: z.string(),
    XML_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_SMTP_EMAIL: z.string().email(),
    NEXT_PUBLIC_SMTP_PASSWORD: z.string(),
    NEXT_PUBLIC_SMTP_HOST: z.string(),
    NEXT_PUBLIC_SMTP_PORT: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    XML_URL: process.env.XML_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SMTP_EMAIL: process.env.NEXT_PUBLIC_SMTP_EMAIL,
    NEXT_PUBLIC_SMTP_PASSWORD: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
    NEXT_PUBLIC_SMTP_HOST: process.env.NEXT_PUBLIC_SMTP_HOST,
    NEXT_PUBLIC_SMTP_PORT: process.env.NEXT_PUBLIC_SMTP_PORT,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
