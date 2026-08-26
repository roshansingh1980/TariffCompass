import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notices | TariffCompass",
  description:
    "TariffCompass is an independent software tool, not affiliated with any government agency.",
  alternates: { canonical: "/notices" },
};

export default function NoticesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Notices
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        A few things worth stating plainly and up front.
      </p>

      <div className="mt-12 flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Independent software tool
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass is an independently built and operated software product. It is not a
            government service.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            No government affiliation
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass is not affiliated with, endorsed by, or acting on behalf of the
            Government of Canada, the Canada Border Services Agency (CBSA), Export Development
            Canada (EDC), the Business Development Bank of Canada (BDC), or any U.S. government
            agency. Program names and links shown in the app refer to real, independently
            administered programs — always confirm current details on the official page before
            acting.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Data may be estimated
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Tariff rates and other figures shown in TariffCompass may be estimates rather than
            confirmed official numbers. Where a figure is estimated or unavailable, the app labels
            it as such. Nothing in TariffCompass should be treated as a determination of duty
            rates, program eligibility, or legal status.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            AI-generated briefs are a starting point only
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            The AI Diversification Brief is generated from the inputs you provide and the data
            shown in your Results screen. It is meant as a starting point for discussion with your
            team, an advisor, or a customs professional — not a final determination of eligibility,
            duty rates, or legal status.
          </p>
        </section>
      </div>
    </div>
  );
}
