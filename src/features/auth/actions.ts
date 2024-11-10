"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";
import { actionClient } from "~/lib/safe-action";
import { signInFormSchema } from "./schema";

export const signInAction = actionClient
  .schema(signInFormSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      return redirect("/login");
    }

    return redirect("/");
  });

export const signOutAction = actionClient.action(async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect("/login");
});
