"use server";

import { redirect } from "next/navigation";
import { createClient } from "~/lib/utils/supabase/server";
import { actionClient } from "~/lib/safe-action";

export const signOutAction = actionClient.action(async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return redirect("/login");
});
