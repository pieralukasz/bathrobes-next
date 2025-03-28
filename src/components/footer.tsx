import { SignOutButton } from "~/features/auth/sign-out-button";
import { ThemeSwitcher } from "./theme-switcher";
import { getUser } from "~/lib/supabase/server";

export const Footer = async () => {
  const user = await getUser();

  return (
    <footer className="mx-auto mt-auto flex w-full items-center justify-center gap-2 border-t py-4 text-center text-xs">
      <p className="hidden sm:block">
        Powered by <span className="font-bold">Lucas Piera</span>
      </p>
      <ThemeSwitcher />
      {user?.id && <SignOutButton />}
    </footer>
  );
};
