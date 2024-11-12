import { SignOutButton } from "~/features/auth/sign-out-button";
import { ThemeSwitcher } from "./theme-switcher";
import { getUser } from "~/lib/supabase/server";
import Link from "next/link";

export const Footer = async () => {
  const user = await getUser();

  return (
    <footer className="mx-auto mt-auto flex w-full items-center justify-center gap-2 border-t py-4 text-center text-xs">
      <p>
        Powered by <span className="font-bold">Lucas Piera</span>
      </p>
      <Link href="/orders">My Orders</Link>
      <ThemeSwitcher />
      {user?.id && <SignOutButton />}
    </footer>
  );
};
