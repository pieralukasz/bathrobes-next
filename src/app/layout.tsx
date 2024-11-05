import HeaderAuth from "~/features/auth/components/header-auth";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Suspense } from "react";

import "../styles/globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bathobe LL App",
  description: "The fastest way to make a shopping",
};

export default function RootLayout({
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
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center gap-4">
              <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
                <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                  <div className="flex items-center gap-5 font-semibold">
                    <Link href={"/"}>L&L Bathrobes</Link>
                  </div>
                  <Suspense fallback={null}>
                    <HeaderAuth />
                  </Suspense>
                </div>
              </nav>
              <div className="flex max-w-5xl flex-col p-5">{children}</div>
              <footer className="mx-auto mt-auto flex w-full items-center justify-center gap-2 border-t py-4 text-center text-xs">
                <p>
                  Powered by <span className="font-bold">Lucas Piera</span>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
