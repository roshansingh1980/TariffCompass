import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("authenticated application shell", () => {
  it("keeps the public header in the root website layout and uses the sidebar for dashboard routes", () => {
    expect(read("app/layout.tsx")).toContain("<SiteHeader />");
    expect(read("app/dashboard/layout.tsx")).toContain("<DashboardShell");
  });

  it("marks dashboard navigation active using the current pathname", () => {
    const shell = read("components/dashboard/dashboard-shell.tsx");
    expect(shell).toContain('aria-current={active ? "page" : undefined}');
    expect(shell).toContain('label: "Dashboard", href: "/dashboard"');
    expect(shell).toContain("item.exact ? pathname === item.href");
  });

  it("supports a locally persisted collapsible desktop sidebar", () => {
    const shell = read("components/dashboard/dashboard-shell.tsx");
    expect(shell).toContain("tariffcompass-sidebar-collapsed");
    expect(shell).toContain("localStorage.setItem");
    expect(shell).toContain('aria-label="Collapse sidebar"');
    expect(shell).toContain('aria-label="Expand sidebar"');
  });

  it("uses an accessible mobile dialog that opens, closes, and closes after navigation", () => {
    const shell = read("components/dashboard/dashboard-shell.tsx");
    expect(shell).toContain("<Dialog open={mobileOpen} onOpenChange={setMobileOpen}>");
    expect(shell).toContain('aria-label="Open application menu"');
    expect(shell).toContain('aria-label="Close application menu"');
    expect(shell).toContain("onNavigate={() => setMobileOpen(false)}");
  });

  it("links to the existing public lookup and uses the existing logout action", () => {
    const shell = read("components/dashboard/dashboard-shell.tsx");
    expect(shell).toContain('label: "HS Code Lookup", href: "/hs-lookup"');
    expect(shell).toContain("<form action={signOut}>");
  });

  it("reuses saved-profile and alert data logic in dedicated views", () => {
    expect(read("app/dashboard/exposures/page.tsx")).toContain("listSavedProfiles()");
    expect(read("app/dashboard/alerts/page.tsx")).toContain("evaluateAndListExposureAlerts()");
    expect(read("app/dashboard/alerts/page.tsx")).toContain("<ExposureAlerts");
  });

  it("does not add a placeholder analysis-history route", () => {
    expect(read("components/dashboard/dashboard-shell.tsx")).not.toContain('href: "/dashboard/history"');
  });
});
