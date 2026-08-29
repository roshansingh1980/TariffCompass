import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("public website shell", () => {
  it("uses one shared public header and footer", () => {
    const layout = read("app/layout.tsx");
    expect(layout).toContain("<SiteHeader />");
    expect(layout).toContain("<SiteFooter />");
  });

  it("keeps core discovery and account destinations visible", () => {
    const header = read("components/site-header.tsx");
    const footer = read("components/site-footer.tsx");
    for (const href of ["/hs-lookup", "/insights", "/sources", "/login"]) {
      expect(`${header}\n${footer}`).toContain(`href=\"${href}\"`);
    }
    expect(header).toContain('href="/dashboard"');
    expect(header).toContain('href="/signup"');
  });

  it("keeps Insights canonical and discoverable in the sitemap", () => {
    expect(read("app/insights/page.tsx")).toContain('alternates: { canonical: "/insights" }');
    expect(read("app/sitemap.ts")).toContain('`${SITE_URL}/insights`');
  });

  it("provides a real pricing anchor instead of a dead navigation target", () => {
    expect(read("components/homepage/cta-section.tsx")).toContain('id="pricing"');
    expect(read("components/site-header.tsx")).toContain('href="/#pricing"');
  });
});
