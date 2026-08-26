import { Button } from "@/components/ui/button";
import { CANADIAN_PROVINCES } from "@/lib/locations";
import { getCategoryTariffData, MARKETS, type Attractiveness, type CostFriction } from "@/lib/market-data";
import { SCENARIOS } from "@/lib/onboarding-data";
import { cn } from "@/lib/utils";

const SUPPORT_PROGRAMS = [
  {
    name: "Canadian Trade Commissioner Service",
    description: "Free export advice and on-the-ground market intelligence in over 160 cities worldwide.",
  },
  {
    name: "Export Development Canada (EDC)",
    description: "Financing, insurance, and credit tools to help Canadian companies sell internationally.",
  },
  {
    name: "CanExport SMEs",
    description: "Cost-sharing funding to offset new export marketing and market-entry activities.",
  },
];

export function ResultsStep({
  scenario,
  province,
  category,
  productName,
  onBack,
}: {
  scenario: string | null;
  province: string | null;
  category: string | null;
  productName: string;
  onBack: () => void;
}) {
  const scenarioLabel = SCENARIOS.find((s) => s.id === scenario)?.title;
  const provinceLabel = CANADIAN_PROVINCES.find((p) => p.value === province)?.label;
  const categoryData = getCategoryTariffData(category);

  const summaryChips = [scenarioLabel, provinceLabel, category, productName || null].filter(
    (value): value is string => Boolean(value)
  );

  return (
    <div className="w-full max-w-5xl">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your market comparison
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Based on your selections below.
        </p>

        {summaryChips.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {summaryChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border/70 bg-foreground/[0.02] px-3.5 py-1.5 text-sm text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="mt-16 hidden overflow-hidden rounded-2xl border border-border/70 sm:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/70 bg-foreground/[0.015]">
              <th className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Market
              </th>
              <th className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Tariff Rate
              </th>
              <th className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Ease of Business
              </th>
              <th className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Cost / Friction
              </th>
              <th className="px-6 py-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Overall Attractiveness
              </th>
            </tr>
          </thead>
          <tbody>
            {MARKETS.map((market) => {
              const profile = categoryData[market.key];
              return (
                <tr
                  key={market.key}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-foreground/[0.015]"
                >
                  <td className="px-6 py-5 font-medium text-foreground">{market.name}</td>
                  <td className="px-6 py-5 text-foreground">{profile.tariffRate}</td>
                  <td className="px-6 py-5">
                    <span className="font-semibold text-foreground">
                      {market.easeOfBusiness.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground"> / 10</span>
                  </td>
                  <td className="px-6 py-5">
                    <FrictionMeter level={profile.costFriction} />
                  </td>
                  <td className="px-6 py-5">
                    <AttractivenessBadge level={profile.attractiveness} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-16 flex flex-col gap-4 sm:hidden">
        {MARKETS.map((market) => {
          const profile = categoryData[market.key];
          return (
            <div key={market.key} className="rounded-2xl border border-border/70 p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-medium tracking-tight text-foreground">
                  {market.name}
                </span>
                <AttractivenessBadge level={profile.attractiveness} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Tariff Rate</dt>
                <dd className="text-right font-medium text-foreground">{profile.tariffRate}</dd>
                <dt className="text-muted-foreground">Ease of Business</dt>
                <dd className="text-right font-medium text-foreground">
                  {market.easeOfBusiness.toFixed(1)} / 10
                </dd>
                <dt className="flex items-center text-muted-foreground">Cost / Friction</dt>
                <dd className="flex justify-end">
                  <FrictionMeter level={profile.costFriction} />
                </dd>
              </dl>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/70">
        Figures shown are illustrative estimates for demonstration purposes only and do not
        constitute tariff, legal, or financial advice.
      </p>

      {/* Government Support Options */}
      <div className="mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Government Support Options
        </h2>
        <p className="mt-2 text-muted-foreground">
          Programs that may help offset the cost of entering a new market.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {SUPPORT_PROGRAMS.map((program) => (
            <div
              key={program.name}
              className="flex flex-col gap-2 rounded-2xl border border-border/70 p-6"
            >
              <span className="font-medium tracking-tight text-foreground">
                {program.name}
              </span>
              <span className="text-sm text-muted-foreground">{program.description}</span>
              <a
                href="#"
                className="mt-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Learn more
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
      </div>
    </div>
  );
}

function FrictionMeter({ level }: { level: CostFriction }) {
  const filled = level === "Low" ? 1 : level === "Medium" ? 2 : 3;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1.5 w-5 rounded-full",
              segment <= filled ? "bg-foreground/70" : "bg-border"
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{level}</span>
    </div>
  );
}

function AttractivenessBadge({ level }: { level: Attractiveness }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        level === "Excellent" && "border-transparent bg-foreground text-background",
        level === "Good" && "border-foreground/30 text-foreground",
        level === "Fair" && "border-border text-muted-foreground",
        level === "Challenging" && "border-dashed border-border text-muted-foreground/70"
      )}
    >
      {level}
    </span>
  );
}
