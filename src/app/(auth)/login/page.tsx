import { SignInForm } from "~/features/auth/forms/sign-in/sign-in-form";

export default async function Login() {
  return (
    <div className="flex w-[334px] flex-col gap-3">
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">Type your email to get started.</p>
      <SignInForm />
    </div>
  );
}
