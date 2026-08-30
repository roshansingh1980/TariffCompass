import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared wide-canvas container for public marketing/content pages — replaces
 * the old ad hoc "max-w-3xl centered column" repeated across the homepage,
 * Insights, Sources, Support, Privacy and Terms, which badly underused
 * desktop width. ~1200px keeps a confident, wide SaaS-style canvas; pair
 * with `readingWidth` on pages that are long-form prose rather than
 * grids/cards, where a narrower measure genuinely helps readability.
 */
export function PublicContainer({
  children,
  className,
  readingWidth = false,
}: {
  children: ReactNode;
  className?: string;
  readingWidth?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-10",
        readingWidth ? "max-w-3xl" : "max-w-[1200px]",
        className
      )}
    >
      {children}
    </div>
  );
}
