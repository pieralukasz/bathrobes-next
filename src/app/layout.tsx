import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";
import { basketQueries } from "~/server/db/queries";
import { CartProvider } from "~/features/cart/cart-context";
import { getUser } from "~/lib/supabase/server";
import { Footer } from "~/components/footer";
import { Navbar } from "~/components/navbar/navbar";
import { Toaster } from "~/components/ui/sonner";
import { Suspense } from "react";
import { User } from "@supabase/supabase-js";

import { Loader } from "../components/ui/loader";

import { defaultUrl } from "~/lib/url";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bathobe LL App",
  description: "The fastest way to make a shopping",
};

const CartWrapper = async ({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  const cartPromise = user
    ? basketQueries.getByUserId(user.id)
    : Promise.resolve(undefined);

  return <CartProvider cartPromise={cartPromise}>{children}</CartProvider>;
};

const UserProvider = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();
  return <CartWrapper user={user}>{children}</CartWrapper>;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center">
                <Loader />
              </div>
            }
          >
            <UserProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </UserProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
