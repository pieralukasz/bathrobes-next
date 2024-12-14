"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";
import { actionClient } from "~/lib/safe-action";
import { signInFormSchema } from "./schema";
import { env } from "~/env";

export const signInAction = actionClient
  .schema(signInFormSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();

    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000",
      },
    });

    return redirect("/login");
  });

export const signOutAction = actionClient.action(async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect("/login");
});
