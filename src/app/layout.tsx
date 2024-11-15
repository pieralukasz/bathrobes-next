import { HeaderAuth } from "~/features/auth/header-auth";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Suspense } from "react";

import "../styles/globals.css";
import { Basket } from "~/features/cart/basket";
import { cookies } from "next/headers";
import { getCart } from "~/server/db/queries/carts";
import { CartProvider } from "~/features/cart/cart-context";
import { createClient, getUser } from "~/lib/supabase/server";
import { SignOutButton } from "~/features/auth/sign-out-button";
import { CartModal } from "~/features/cart/cart-modal";
import { Footer } from "~/components/footer";
import { Navbar } from "~/components/navbar/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bathobe LL App",
  description: "The fastest way to make a shopping",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const cartPromise = user ? getCart(user.id) : Promise.resolve(undefined);

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider cartPromise={cartPromise}>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex flex-grow">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
