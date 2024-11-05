"use server";

import { createClient } from "~/lib/utils/supabase/server";
import { redirect } from "next/navigation";
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
