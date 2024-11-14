import { redirect } from "next/navigation";
import { SignInForm } from "~/features/auth/sign-in-form";
import { getUser } from "~/lib/supabase/server";

export default async function Login() {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-[334px] flex-col items-center justify-center gap-3">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Type your email to get started.
        </p>
        <SignInForm />
      </div>
    </div>
  );
}
