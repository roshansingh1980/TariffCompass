"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { TcMark } from "@/components/brand/tc-mark";
import { CountryToggle } from "@/components/onboarding/country-toggle";
import { CountryProvider, useCountry } from "@/lib/dashboard/country-context";
import { signOut } from "@/lib/supabase/actions";
import { createBillingPortalSession } from "@/lib/stripe/actions";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Comparison", href: "/dashboard" },
  { label: "Updates", href: "/updates" },
  { label: "Sources", href: "/sources" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-[14px] font-medium tracking-tight text-foreground transition-colors duration-200 hover:bg-foreground/[0.05]"
        >
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function AccountFooter({
  isLoggedIn,
  isSubscribed,
  userEmail,
}: {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  userEmail: string | null;
}) {
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-2 border-t border-border/50 pt-4">
        <Link
          href="/login"
          className="rounded-xl px-3.5 py-2.5 text-center text-[14px] font-medium text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-foreground px-3.5 py-2.5 text-center text-[14px] font-medium tracking-tight text-background hover:bg-foreground/90"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border/50 pt-4">
      {userEmail && (
        <p className="truncate px-3.5 text-xs text-muted-foreground">{userEmail}</p>
      )}
      {isSubscribed && (
        <form action={createBillingPortalSession}>
          <button
            type="submit"
            className="w-full rounded-xl px-3.5 py-2 text-left text-[14px] font-medium text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
          >
            Manage billing
          </button>
        </form>
      )}
      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-xl px-3.5 py-2 text-left text-[14px] font-medium text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"
        >
          Log out
        </button>
      </form>
    </div>
  );
}

function SidebarContent({
  isLoggedIn,
  isSubscribed,
  userEmail,
  onNavigate,
}: {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  userEmail: string | null;
  onNavigate?: () => void;
}) {
  const { country, setCountry } = useCountry();

  return (
    <div className="flex min-h-full flex-col gap-8 p-5">
      <Link href="/" aria-label="TariffCompass home" className="flex items-center gap-2 px-1">
        <TcMark className="h-[22px] w-[22px]" />
        <span className="font-serif text-lg leading-none font-medium text-foreground">
          TariffCompass
        </span>
      </Link>

      <CountryToggle value={country} onChange={setCountry} />

      <div className="flex-1">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <AccountFooter isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail} />
    </div>
  );
}

export function DashboardShell({
  isLoggedIn,
  isSubscribed,
  userEmail,
  children,
}: {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  userEmail: string | null;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CountryProvider>
      <div className="flex min-h-screen flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border/50 lg:block">
          <div className="sticky top-0 h-screen">
            <SidebarContent isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail} />
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background px-4 lg:hidden">
          <Link href="/" aria-label="TariffCompass home" className="flex items-center gap-2">
            <TcMark className="h-[20px] w-[20px]" />
            <span className="font-serif text-base leading-none font-medium text-foreground">
              TariffCompass
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-foreground hover:bg-foreground/[0.05]"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-background shadow-xl">
              <div className="flex justify-end p-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-foreground hover:bg-foreground/[0.05]"
                >
                  <X className="size-5" />
                </button>
              </div>
              <SidebarContent
                isLoggedIn={isLoggedIn}
                isSubscribed={isSubscribed}
                userEmail={userEmail}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col pt-14 lg:pt-0">{children}</main>
      </div>
    </CountryProvider>
  );
}
