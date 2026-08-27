import type { Metadata } from "next";
import { getUsedSourceRegistry } from "@/lib/data/source-registry";

export const metadata: Metadata = {
  title: "Sources | TariffCompass",
  description: "Every named source behind TariffCompass's tariff rates and program data.",
  alternates: { canonical: "/sources" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function SourcesPage() {
  const registry = await getUsedSourceRegistry();

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sources</h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        Every named source behind TariffCompass&apos;s tariff rates, key dates, and program data —
        computed directly from what the app actually cites, not a separately maintained list.
      </p>

      <div className="mt-14 flex flex-col divide-y divide-border/50 border-t border-border/50">
        {registry.map((source) => (
          <div key={source.url} className="flex flex-col gap-1.5 py-7">
            <p className="text-lg font-medium tracking-tight text-foreground">{source.name}</p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{source.covers}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Visit source
              </a>
              <span className="text-muted-foreground/70">
                Last checked {formatDate(source.lastChecked)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
