import Link from "next/link";
import { getUsedSourceRegistry, type SourceRegistryEntry } from "@/lib/data/source-registry";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function SourcesCountLine() {
  let registry: SourceRegistryEntry[];
  try {
    registry = await getUsedSourceRegistry();
  } catch (error) {
    console.error("Failed to load source registry for homepage:", error);
    return null;
  }
  const lastReviewed = registry.reduce(
    (latest, entry) => (entry.lastChecked > latest ? entry.lastChecked : latest),
    registry[0]?.lastChecked ?? ""
  );

  return (
    <div className="w-full px-6 pb-20 text-center">
      <Link
        href="/sources"
        className="text-sm font-medium tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Built on {registry.length} named sources
      </Link>
      {lastReviewed && (
        <span className="text-sm text-muted-foreground"> · Last reviewed {formatDate(lastReviewed)}</span>
      )}
    </div>
  );
}
