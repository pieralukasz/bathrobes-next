import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "~/lib/utils/supabase/server";
import { SignOutForm } from "~/features/auth/forms/sign-out/sign-out-form";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!{/* <SignOutForm /> */}
    </div>
  ) : (
    <Button asChild size="sm" variant={"outline"}>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}
