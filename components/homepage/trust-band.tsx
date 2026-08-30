import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";

// Only source families genuinely cited by the app's own data — see
// lib/data/source-registry.ts (computed from what's actually referenced)
// and lib/data/canada-counter-tariffs-2026.ts. No logo assets used.
const SOURCE_FAMILIES = [
  "Department of Finance Canada",
  "CBSA Customs Tariff",
  "U.S. Harmonized Tariff Schedule (USITC)",
  "Government of Canada — Trade Agreements",
];

export function TrustBand() {
  return (
    <section className="w-full bg-foreground/[0.02] py-10">
      <PublicContainer className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex items-start gap-3 sm:max-w-xs">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">Built on official sources you can trust</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Source-aware analysis with status, confidence and review dates.{" "}
              <Link href="/sources" className="underline underline-offset-2 hover:text-foreground">
                See every source
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
          {SOURCE_FAMILIES.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </PublicContainer>
    </section>
  );
}
