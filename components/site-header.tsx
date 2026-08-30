import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { createBillingPortalSession } from "@/lib/stripe/actions";
import { TcMark } from "@/components/brand/tc-mark";
import { PublicContainer } from "@/components/public/public-container";

export async function SiteHeader() {
  // /dashboard has its own sidebar chrome (see app/dashboard/layout.tsx),
  // which owns account/billing/logout instead — skip the marketing header
  // there entirely rather than showing both. Same for /updates and /sources
  // when reached via a dashboard sidebar link (?view=app) rather than
  // directly or from search.
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAppView = headersList.get("x-app-view") === "1";
  if (pathname.startsWith("/dashboard") || isAppView) return null;

  // Renders on every other page via the root layout — a Supabase hiccup
  // here must degrade to the logged-out header, never take the whole site
  // down.
  let user: { id: string; email?: string } | null = null;
  let isSubscribed = false;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", user.id)
        .maybeSingle();
      isSubscribed = profile?.subscription_status === "active";
    }
  } catch (error) {
    console.error("SiteHeader failed to load auth state:", error);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/75 backdrop-blur-md">
      <PublicContainer className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-8">
        <Link
          href="/"
          aria-label="TariffCompass home"
          className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80 sm:gap-2.5"
        >
          <TcMark className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" />
          <span className="font-serif text-lg leading-none font-medium text-foreground sm:text-[21px]">
            TariffCompass
          </span>
        </Link>

        <nav aria-label="Public navigation" className="flex items-center gap-3 sm:gap-5">
          <Link href="/#pricing" className="hidden text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground md:inline">Pricing</Link>
          <Link href="/hs-lookup" className="hidden text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground sm:inline">HS Lookup</Link>
          <Link
            href="/insights"
            className="text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Insights
          </Link>
          <Link href="/sources" className="hidden text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground lg:inline">Sources</Link>
          <Link href="/support" className="hidden text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground lg:inline">Help</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground">Dashboard</Link>
              {isSubscribed && (
                <form action={createBillingPortalSession}>
                  <button
                    type="submit"
                    className="text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    <span className="sm:hidden">Billing</span>
                    <span className="hidden sm:inline">Manage billing</span>
                  </button>
                </form>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-foreground px-3.5 py-2 text-[13px] font-medium tracking-wide text-background transition-colors duration-200 hover:bg-foreground/90 sm:px-4"
              >
                Start free
              </Link>
            </>
          )}
        </nav>
      </PublicContainer>
    </header>
  );
}
