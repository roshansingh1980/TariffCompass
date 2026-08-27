import type { Metadata } from "next";
import { getUsedSourceRegistry, type SourceRegistryEntry } from "@/lib/data/source-registry";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardShellAuth } from "@/lib/dashboard/shell-auth";

export const metadata: Metadata = {
  title: "Sources | TariffCompass",
  description: "Every named source behind TariffCompass's tariff rates and program data.",
  // Always the bare path, regardless of ?view=app — see app/updates/page.tsx.
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

async function SourcesContent() {
  let registry: SourceRegistryEntry[];
  let loadError = false;
  try {
    registry = await getUsedSourceRegistry();
  } catch (error) {
    console.error("Failed to load source registry:", error);
    loadError = true;
    registry = [];
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Sources</h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        Every named source behind TariffCompass&apos;s tariff rates, key dates, and program data —
        computed directly from what the app actually cites, not a separately maintained list.
      </p>

      {loadError ? (
        <div className="mt-14 rounded-3xl border border-destructive/30 bg-destructive/[0.03] p-8 text-center">
          <p className="text-[15px] font-medium text-destructive">
            Couldn&apos;t load the source list right now — try refreshing the page.
          </p>
        </div>
      ) : (
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
                <span className="text-muted-foreground">
                  Last checked {formatDate(source.lastChecked)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function SourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  if (view !== "app") return <SourcesContent />;

  const { isLoggedIn, isSubscribed, userEmail } = await getDashboardShellAuth();
  return (
    <DashboardShell isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} userEmail={userEmail}>
      <SourcesContent />
    </DashboardShell>
  );
}
