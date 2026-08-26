"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const STORAGE_KEY = "tc-nav-count";

/**
 * window.history.length is not a reliable "does back have somewhere useful
 * to go" signal — Chromium counts the pre-navigation entry (a real page,
 * not just the browser's blank new-tab state) even on a first-ever visit,
 * so history.length is 2 before the user has navigated anywhere in the app.
 * This tracks our own per-tab count of route mounts instead, so BackLink
 * can tell a real in-app back-target from a direct/first load.
 */
export function NavTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const count = Number(sessionStorage.getItem(STORAGE_KEY) ?? "0");
      sessionStorage.setItem(STORAGE_KEY, String(count + 1));
    } catch {
      // sessionStorage unavailable (privacy mode, etc.) — BackLink falls back safely.
    }
  }, [pathname]);

  return null;
}
