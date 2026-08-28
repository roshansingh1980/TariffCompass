import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";

export const metadata: Metadata = {
  title: "Terms of Service | TariffCompass",
  description: "The terms that govern your use of TariffCompass and its paid subscriptions.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20 sm:px-8 sm:py-28">
      <BackLink fallbackHref="/" />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        Last updated August 26, 2026. Plain-language terms — if anything is unclear, email{" "}
        <a
          href="mailto:support@tariffcompass.ca"
          className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          support@tariffcompass.ca
        </a>
        .
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        TariffCompass is a product of Adithana Capital Ltd. In these terms, &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; and &ldquo;our&rdquo; mean Adithana Capital Ltd.
      </p>

      <div className="mt-12 flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            License to use the software
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            We grant you a personal, non-exclusive, non-transferable right to use TariffCompass
            for your own business purposes, or on behalf of a client if you&apos;re an advisor. You
            may not resell, sublicense, or scrape the service, or use it to build a competing
            product. We may suspend or end access for accounts that misuse the service.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Paid subscriptions
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Estimated dollar exposure, the reasoning behind cost/friction and risk ratings, full
            government program detail, and AI brief generation require a paid subscription at
            C$99/month for TariffCompass Business, billed through Stripe and renewing
            automatically each month. TariffCompass Advisor is C$249/month when offered. You can
            cancel at any time through the billing portal linked from your account;
            access continues until the end of the period you&apos;ve already paid for. We don&apos;t
            offer partial-month refunds.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Estimates only, not professional advice
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            Tariff rates, market ratings, government program details, and AI-generated briefs
            shown in TariffCompass are estimates and general information. They are not legal, tax,
            customs, or financial advice, and using the service does not create an advisory
            relationship of any kind. Always verify specific figures with official sources or a
            qualified professional before acting on them.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            No guarantee of accuracy
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            We work to keep the data reasonably current and clearly label what&apos;s estimated
            versus confirmed, but tariff rules change, and we do not guarantee that any figure in
            TariffCompass is accurate, complete, or up to date at the moment you view it.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Limitation of liability
          </h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            TariffCompass is provided &quot;as is,&quot; without warranties of any kind. To the
            extent permitted by law, we are not liable for any business, financial, or legal
            decision you make based on information from the service, or for any indirect,
            incidental, or consequential losses arising from your use of it.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-medium tracking-tight text-foreground">Governing law</h2>
          <p className="text-[15.5px] leading-[1.75] text-foreground/90">
            These terms are governed by the laws of the Province of Ontario and the federal laws
            of Canada applicable in Ontario, without regard to conflict-of-law rules.
          </p>
        </section>
      </div>
    </div>
  );
}
