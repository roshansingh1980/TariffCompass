"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TcLockup } from "@/components/brand/tc-lockup";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
      <TcLockup size="default" orientation="horizontal" />

      <div className="mt-10 flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#C8102E]" />
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Error
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
        This page hit an unexpected error. Your data is safe — try again, or head back to the
        homepage.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-[15px] font-medium tracking-tight text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-border/60 px-6 text-[15px] font-medium tracking-tight text-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/[0.03]"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
