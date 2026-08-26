import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs on every request, so a Supabase misconfiguration here (missing/blank
 * env vars, a transient outage) must never take the whole site down. On any
 * failure this fails OPEN — pass the request through unredirected — rather
 * than 500ing. Auth-gated pages (e.g. app/dashboard/page.tsx) do their own
 * server-side getUser()+redirect check regardless, so this is a UX
 * convenience layer, not the only line of defense.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase env vars are not configured for middleware.");
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isAuthPage = path === "/login" || path === "/signup";
    const isProtected = path.startsWith("/dashboard");

    if (!user && isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware auth check failed, passing request through:", error);
    return NextResponse.next({ request });
  }
}
