import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  heading,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-border/60">
      <div className="flex max-w-xs flex-col items-center gap-3 px-6 py-10 text-center">
        <Icon aria-hidden="true" className="size-7 text-muted-foreground" />
        <h2 className="text-sm font-semibold">{heading}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Link
          href={ctaHref}
          className="mt-2 inline-flex items-center rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
