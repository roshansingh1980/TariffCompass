import Link from "next/link";
import { headers } from "next/headers";
import { TcLockup } from "@/components/brand/tc-lockup";

export async function SiteFooter() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAppView = headersList.get("x-app-view") === "1";
  if (pathname.startsWith("/dashboard") || isAppView) return null;

  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:px-8">
        <TcLockup size="small" orientation="horizontal" />
        <p className="font-serif text-sm text-muted-foreground italic">
          Navigate tariffs. Find your path.
        </p>
        <div className="flex flex-col items-center gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p className="tracking-wide">
            &copy; {new Date().getFullYear()} Adithana Capital Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <Link href="/#pricing" className="tracking-wide transition-colors duration-200 hover:text-foreground">Pricing</Link>
            <Link href="/hs-lookup" className="tracking-wide transition-colors duration-200 hover:text-foreground">HS Code Lookup</Link>
            <Link href="/insights" className="tracking-wide transition-colors duration-200 hover:text-foreground">Insights</Link>
            <Link href="/sources" className="tracking-wide transition-colors duration-200 hover:text-foreground">Sources / Methodology</Link>
            <Link
              href="/about"
              className="tracking-wide transition-colors duration-200 hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/support"
              className="tracking-wide transition-colors duration-200 hover:text-foreground"
            >
              Support
            </Link>
            <Link
              href="/privacy"
              className="tracking-wide transition-colors duration-200 hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="tracking-wide transition-colors duration-200 hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/notices"
              className="tracking-wide transition-colors duration-200 hover:text-foreground"
            >
              Notices
            </Link>
            <Link
              href="/updates"
              className="tracking-wide transition-colors duration-200 hover:text-foreground"
            >
              Updates
            </Link>
            <Link href="/login" className="tracking-wide transition-colors duration-200 hover:text-foreground">Log in</Link>
          </div>
        </div>
        <p className="max-w-2xl text-center text-[11px] leading-relaxed text-muted-foreground">
          TariffCompass is an independent software tool. It is not affiliated with the Government
          of Canada, CBSA, EDC, BDC, or any U.S. government agency. Information is provided for
          general guidance only.
        </p>
        <p className="text-[11px] tracking-wide text-muted-foreground">
          A Canadian tool for a Canadian problem.
        </p>
      </div>
    </footer>
  );
}
