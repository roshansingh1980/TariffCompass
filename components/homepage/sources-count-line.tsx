import Link from "next/link";
import { getUsedSourceRegistry } from "@/lib/data/source-registry";

export function SourcesCountLine() {
  const count = getUsedSourceRegistry().length;

  return (
    <div className="w-full px-6 pb-20 text-center">
      <Link
        href="/sources"
        className="text-sm font-medium tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Built on {count} named sources
      </Link>
    </div>
  );
}
