import type { Metadata } from "next";
import { UPDATES } from "@/lib/updates-data";

export const metadata: Metadata = {
  title: "Updates | TariffCompass",
  description: "A dated record of changes to TariffCompass's tariff and risk data.",
  alternates: { canonical: "/updates" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function UpdatesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Updates
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        A dated record of changes to TariffCompass&apos;s tariff and risk data.
      </p>

      <div className="mt-14 flex flex-col gap-14 divide-y divide-border/50">
        {UPDATES.map((entry, i) => (
          <div key={entry.date} className={i > 0 ? "pt-14" : ""}>
            <p className="text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
              {formatDate(entry.date)}
            </p>
            <h2 className="mt-2 text-xl font-medium tracking-tight text-foreground">
              {entry.title}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {entry.body.map((paragraph, j) => (
                <p key={j} className="text-[15px] leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
