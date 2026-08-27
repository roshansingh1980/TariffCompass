"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Prefers real browser back (preserves scroll position, feels native) and
 * only falls back to a fixed destination when there's no in-tab history to
 * go back to — e.g. someone opened this page directly from a bookmark or a
 * new tab.
 */
export function BackLink({
  fallbackHref,
  label = "Back",
  className,
}: {
  fallbackHref: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        let navCount = 0;
        try {
          navCount = Number(sessionStorage.getItem("tc-nav-count") ?? "0");
        } catch {
          // sessionStorage unavailable — treat as no tracked history.
        }
        if (navCount > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground",
        className
      )}
    >
      <ArrowLeft className="size-3.5" />
      {label}
    </button>
  );
}
