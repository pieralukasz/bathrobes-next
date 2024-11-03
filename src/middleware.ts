import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  try {
    // Create an initial response that we may modify
    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Refresh session if expired, per Supabase documentation
    const { data: user, error } = await supabase.auth.getUser();

    // Redirect to sign-in if the user is not authenticated on protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Redirect authenticated users from the root to a protected page
    if (request.nextUrl.pathname === "/" && !error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    // Return the potentially modified response
    return response;
  } catch (e) {
    console.error("Supabase client creation failed:", e);
    // Return unmodified response in case of an error
    return NextResponse.next();
  }
};
