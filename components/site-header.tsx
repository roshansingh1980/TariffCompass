import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-foreground">
          TariffCompass
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <span className="hidden text-[13px] text-muted-foreground/80 sm:inline">
                {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-[13px] font-medium tracking-wide text-muted-foreground/80 transition-colors duration-200 hover:text-foreground"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium tracking-wide text-muted-foreground/80 transition-colors duration-200 hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium tracking-wide text-background transition-colors duration-200 hover:bg-foreground/90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
