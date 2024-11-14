import Link from "next/link";
import { Suspense } from "react";
import { HeaderAuth } from "~/features/auth/header-auth";
import { CartModal } from "~/features/cart/cart-modal";
import { Search, SearchSkeleton } from "./search";
import { getUser } from "~/lib/supabase/server";

export const Navbar = async () => {
  const user = await getUser();

  return (
    <nav className="z-10 flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full items-center justify-between gap-6 px-3 py-3 text-sm md:max-w-4xl">
        <div className="hidden font-semibold md:block">
          <Link href={"/"}>L&L Bathrobes</Link>
        </div>
        {user && (
          <div className="flex flex-grow justify-center">
            <div className="flex w-full justify-center">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>
          </div>
        )}
        <div className="flex w-[90px] items-center justify-end gap-5">
          {!user ? <HeaderAuth /> : <CartModal />}
        </div>
      </div>
    </nav>
  );
};
