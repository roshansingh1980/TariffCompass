import Link from "next/link";
import { headers } from "next/headers";
import { TcLockup } from "@/components/brand/tc-lockup";
import { createClient } from "@/lib/supabase/server";
import { PublicContainer } from "@/components/public/public-container";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "HS Lookup", href: "/hs-lookup" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/support" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Sources", href: "/sources" },
      { label: "Updates", href: "/updates" },
      { label: "Help", href: "/support" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Notices", href: "/notices" },
    ],
  },
];

export async function SiteFooter() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAppView = headersList.get("x-app-view") === "1";
  if (pathname.startsWith("/dashboard") || isAppView) return null;

  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  } catch (error) {
    console.error("SiteFooter failed to load auth state:", error);
  }

  return (
    <footer className="border-t border-border/30">
      <PublicContainer className="py-12 sm:py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <TcLockup size="small" orientation="horizontal" />
            <p className="mt-3 max-w-[16rem] text-sm text-muted-foreground">Monitor. Quantify. Respond.</p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                {column.heading}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">Account</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {isLoggedIn ? "Dashboard" : "Log in"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <p className="tracking-wide">
            &copy; {new Date().getFullYear()} Adithana Capital Ltd. All rights reserved.
          </p>
          <p className="max-w-xl leading-relaxed">
            TariffCompass is an independent software tool. It is not affiliated with the Government
            of Canada, CBSA, EDC, BDC, or any U.S. government agency. Information is provided for
            general guidance only.
          </p>
        </div>
      </PublicContainer>
    </footer>
  );
}
