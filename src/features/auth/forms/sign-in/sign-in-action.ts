"use server";

import { encodedRedirect } from "~/lib/utils/utils";
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
      return encodedRedirect("error", "/login", error.message);
    }

    return redirect("/");
  });
