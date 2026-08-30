"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bell, ChevronLeft, ChevronRight, CircleHelp, CreditCard, LayoutDashboard, Library, LogOut, Menu, PackageSearch, Search, Tag, UserRound, X, type LucideIcon } from "lucide-react";
import { TcMark } from "@/components/brand/tc-mark";
import { signOut } from "@/lib/supabase/actions";
import { createBillingPortalSession } from "@/lib/stripe/actions";
import { cn } from "@/lib/utils";
import { Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipPopup, TooltipPortal, TooltipPositioner, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_STORAGE_KEY = "tariffcompass-sidebar-collapsed";
type NavItem = { label: string; href: string; icon: LucideIcon; exact?: boolean };

// ?view=app renders these public-URL pages inside this shell instead of the
// marketing chrome when reached from here (see middleware.ts x-app-view and
// each page's own searchParams branch) — same pattern as /updates, /sources.
export const APP_NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Monitored Exposures", href: "/dashboard/exposures", icon: PackageSearch },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "HS Code Lookup", href: "/hs-lookup?view=app", icon: Search },
  { label: "Insights", href: "/insights?view=app", icon: BookOpen },
  { label: "Sources", href: "/sources?view=app", icon: Library },
  { label: "Help Center", href: "/support?view=app", icon: CircleHelp },
];

function isItemActive(pathname: string, item: NavItem): boolean {
  const href = item.href.split("?")[0];
  return item.exact ? pathname === href : pathname.startsWith(href);
}

function IconLabel({ icon: Icon, label, collapsed }: { icon: LucideIcon; label: string; collapsed: boolean }) {
  return <><Icon aria-hidden="true" className="size-[18px] shrink-0" />{!collapsed && <span className="truncate">{label}</span>}</>;
}

function SidebarLink({ item, pathname, collapsed, onNavigate }: { item: NavItem; pathname: string; collapsed: boolean; onNavigate?: () => void }) {
  const active = isItemActive(pathname, item);
  const link = (
    <Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} title={collapsed ? item.label : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium tracking-tight outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", collapsed && "justify-center px-0", active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground")}>
      <IconLabel icon={item.icon} label={item.label} collapsed={collapsed} />
    </Link>
  );
  if (!collapsed) return link;
  return <Tooltip><TooltipTrigger render={link} /><TooltipPortal><TooltipPositioner side="right"><TooltipPopup>{item.label}</TooltipPopup></TooltipPositioner></TooltipPortal></Tooltip>;
}

function UtilityLink({ href, label, icon, collapsed, onNavigate }: { href: string; label: string; icon: LucideIcon; collapsed: boolean; onNavigate?: () => void }) {
  return <SidebarLink item={{ href, label, icon }} pathname="" collapsed={collapsed} onNavigate={onNavigate} />;
}

function AccountFooter({ isLoggedIn, isSubscribed, userEmail, collapsed, onNavigate }: { isLoggedIn: boolean; isSubscribed: boolean; userEmail: string | null; collapsed: boolean; onNavigate?: () => void }) {
  if (!isLoggedIn) return (
    <div className="flex flex-col gap-2 border-t border-border/60 pt-4">
      <UtilityLink href="/login" label="Log in" icon={UserRound} collapsed={collapsed} onNavigate={onNavigate} />
      {!collapsed && <Link href="/signup" onClick={onNavigate} className="rounded-full bg-foreground px-3.5 py-2.5 text-center text-sm font-medium text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Sign up</Link>}
    </div>
  );

  return (
    <div id="account" className="flex flex-col gap-1 border-t border-border/60 pt-4">
      {!collapsed && <div className="mb-2 px-3"><p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Account</p>{userEmail && <p className="mt-1 truncate text-xs text-muted-foreground">{userEmail}</p>}</div>}
      <UtilityLink href="/#pricing" label="Pricing" icon={Tag} collapsed={collapsed} onNavigate={onNavigate} />
      <UtilityLink href="/dashboard#account" label="Account & Billing" icon={UserRound} collapsed={collapsed} onNavigate={onNavigate} />
      {isSubscribed && <form action={createBillingPortalSession}><button type="submit" title={collapsed ? "Manage billing" : undefined} className={cn("flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", collapsed && "justify-center px-0")}><IconLabel icon={CreditCard} label="Manage billing" collapsed={collapsed} /></button></form>}
      <form action={signOut}><button type="submit" title={collapsed ? "Log out" : undefined} className={cn("flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", collapsed && "justify-center px-0")}><IconLabel icon={LogOut} label="Log out" collapsed={collapsed} /></button></form>
    </div>
  );
}

function SidebarContent({ isLoggedIn, isSubscribed, userEmail, collapsed, onNavigate, onToggleCollapse }: { isLoggedIn: boolean; isSubscribed: boolean; userEmail: string | null; collapsed: boolean; onNavigate?: () => void; onToggleCollapse?: () => void }) {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <div className="flex h-full min-h-0 flex-col p-3">
        <div className={cn("flex h-12 items-center", collapsed ? "justify-center" : "justify-between px-2")}>
          <Link href="/dashboard" onClick={onNavigate} aria-label="TariffCompass dashboard" className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><TcMark className="h-[22px] w-[22px] shrink-0" />{!collapsed && <span className="font-serif text-lg leading-none font-medium">TariffCompass</span>}</Link>
          {!collapsed && onToggleCollapse && <button type="button" onClick={onToggleCollapse} aria-label="Collapse sidebar" title="Collapse sidebar" className="rounded-md p-2 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronLeft className="size-4" /></button>}
        </div>
        {collapsed && onToggleCollapse && <button type="button" onClick={onToggleCollapse} aria-label="Expand sidebar" title="Expand sidebar" className="mx-auto mt-1 rounded-md p-2 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ChevronRight className="size-4" /></button>}
        <nav aria-label="Application navigation" className="mt-5 flex flex-1 flex-col gap-1 overflow-y-auto">{APP_NAV_ITEMS.map((item) => <SidebarLink key={item.label} item={item} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />)}</nav>
        <AccountFooter isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail} collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </TooltipProvider>
  );
}

function initialsFor(email: string | null): string {
  if (!email) return "?";
  return email.trim().slice(0, 2).toUpperCase();
}

export function DashboardShell({
  isLoggedIn,
  isSubscribed,
  userEmail,
  alertCount = 0,
  children,
}: {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  userEmail: string | null;
  alertCount?: number;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"); } catch { /* Expanded is the safe fallback. */ }
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      try { localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next)); } catch { /* Storage can be unavailable. */ }
      return next;
    });
  }

  return (
    <div className="flex min-h-screen flex-1 bg-background">
      <aside aria-label="TariffCompass workspace" className={cn("hidden shrink-0 border-r border-border/60 bg-sidebar transition-[width] duration-150 lg:block", collapsed ? "w-[72px]" : "w-64")}><div className="sticky top-0 h-screen"><SidebarContent isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail} collapsed={collapsed} onToggleCollapse={toggleCollapsed} /></div></aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-background/95 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open application menu" className="-ml-2 rounded-md p-2 hover:bg-foreground/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"><Menu className="size-5" /></button>
          <div className="flex flex-1 items-center justify-center gap-2 lg:justify-center">
            <TcMark className="h-5 w-5" />
            <span className="font-serif text-base leading-none font-medium">TariffCompass</span>
          </div>
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            {/* Cosmetic only — no i18n is implemented yet. Not a functional switcher. */}
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline" title="French is not yet available">EN</span>
            {/* Static context label, not a selector — home country is intentionally
                fixed to Canada (see CLAUDE.md). Deliberately has no chevron/affordance
                so it can't be mistaken for a reintroduced country toggle. */}
            <span className="hidden items-center gap-1 text-xs font-medium text-muted-foreground sm:flex" title="TariffCompass covers Canadian trade exposure">
              🇨🇦 Canada
            </span>
            {isLoggedIn && (
              <Link href="/dashboard/alerts" aria-label="Alerts" className="relative rounded-md p-1.5 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground">
                <Bell className="size-[18px]" />
                {alertCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#C8102E] text-[10px] font-semibold text-white">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/dashboard#account" aria-label="Account" className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-foreground/[0.03] text-[11px] font-semibold text-foreground hover:bg-foreground/[0.06]">
                {initialsFor(userEmail)}
              </Link>
            )}
          </div>
        </div>
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogPortal><DialogBackdrop className="lg:hidden" /><DialogPopup className="inset-y-0 left-0 top-0 h-dvh w-72 max-w-[88vw] translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0 shadow-xl lg:hidden"><DialogTitle className="sr-only">Application navigation</DialogTitle><button type="button" onClick={() => setMobileOpen(false)} aria-label="Close application menu" className="absolute right-3 top-3 z-10 rounded-md p-2 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="size-5" /></button><SidebarContent isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail} collapsed={false} onNavigate={() => setMobileOpen(false)} /></DialogPopup></DialogPortal>
        </Dialog>
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
