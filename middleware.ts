import { type NextRequest } from "next/server";
import { updateSession } from "~/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Incoming request for path: ${pathname}`);

  const response = await updateSession(request);

  console.log(`[Middleware] Response for path ${pathname}:`, response);

  return response;
}

export const config = {
  /*
   * Match all request paths except:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - /api/cron (cron job endpoint)
   * - images - .svg, .png, jpg, .jpeg, .gif, .webp
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/cron$|api/cron/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
