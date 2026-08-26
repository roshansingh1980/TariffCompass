import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About TariffCompass — Helping Canadian Businesses Navigate Tariffs",
  description:
    "Learn how TariffCompass helps Canadian small and medium-sized businesses assess tariff exposure, diversify markets, and access government support.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        About TariffCompass
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        A practical tool for Canadian businesses trying to make sense of tariffs — not a
        government service, and not a substitute for professional advice.
      </p>

      <div className="mt-12 flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            What TariffCompass is
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass is an independent software tool that helps Canadian businesses
            understand their tariff exposure, compare alternative export and import markets, and
            find relevant government support programs — in minutes, not weeks of research.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">Who it&apos;s for</h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Canadian small and medium-sized businesses that export to or import from the United
            States or other markets, and the accountants, consultants, and advisors who support
            them. It&apos;s built for people who need a clear starting point, not a customs law
            textbook.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">What it does</h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            You describe your business — your trade scenario, where you&apos;re based, and what
            you sell or import — and TariffCompass shows a side-by-side comparison of markets:
            estimated tariff rates, ease of doing business, cost and friction, and an overall
            attractiveness rating. It also surfaces real Canadian government support programs that
            may be relevant, and can generate a short, personalized AI diversification brief you
            can share with a client or your own team.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            What it does not do
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass does not provide legal, tax, customs, or financial advice. It is not a
            customs broker, does not file paperwork on your behalf, and does not determine your
            actual duty liability, program eligibility, or legal obligations. It does not guarantee
            the accuracy of any tariff rate. Decisions with real financial consequences should be
            verified with official sources or a qualified professional first.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            How data is collected and updated
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Market and tariff data is maintained as a structured dataset, not scraped or invented
            on the fly. Every figure carries a confidence label — official, estimated, or unknown
            — along with the source it&apos;s based on and when it was last reviewed. An
            AI-assisted review process periodically checks tracked government and industry sources
            for signs that the data may be stale, but it only ever proposes changes; a person
            reviews and applies them by hand before anything changes in the app.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Rates can be estimated
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Tariff treatment often depends on the exact product classification, its origin, and
            rules that can change with little notice. Where TariffCompass shows a figure as
            estimated, treat it as directional — a reason to look closer, not a confirmed number to
            act on directly.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Not a government tool
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass is independently built and operated. It is not affiliated with, endorsed
            by, or acting on behalf of the Government of Canada, the Canada Border Services Agency
            (CBSA), Export Development Canada (EDC), the Business Development Bank of Canada
            (BDC), or any U.S. government agency. Where we reference their programs, we link to
            the official pages so you can confirm details directly. See our{" "}
            <Link
              href="/notices"
              className="underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Notices
            </Link>{" "}
            page for the full statement.
          </p>
        </section>
      </div>
    </div>
  );
}
