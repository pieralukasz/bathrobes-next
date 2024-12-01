import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/cron") {
    console.log("[Middleware] Skipping /api/cron.");
    return new Response(null);
  }

  await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/cron$|api/cron/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
