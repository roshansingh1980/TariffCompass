import { headers } from "next/headers";

/**
 * The signal-red vignette is a marketing/public-page brand touch. It's
 * `position: fixed`, so on a scrollable authenticated page it reappears at
 * the viewport edge no matter how far the user has scrolled — bleeding
 * across whatever content happens to be at the top, which looks like a
 * rendering glitch on the otherwise plain/minimal dashboard shell. Suppress
 * it there the same way SiteHeader/SiteFooter suppress themselves.
 */
export async function EdgeGlow() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAppView = headersList.get("x-app-view") === "1";
  if (pathname.startsWith("/dashboard") || isAppView) return null;

  return <div className="edge-glow" aria-hidden="true" />;
}
