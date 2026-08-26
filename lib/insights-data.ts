/**
 * Evergreen editorial content for /insights. Deliberately not a news feed —
 * no publish dates, no ticker. Content is a first draft: practical and
 * useful, but review before treating any figure as current or authoritative.
 * The only external links are to programs already verified elsewhere in
 * this codebase (see lib/support-programs.ts) — no new URLs are guessed here.
 */

export type InsightSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
  link?: { label: string; href: string };
};

export type InsightArticle = {
  slug: string;
  title: string;
  metaDescription: string;
  dek: string;
  intro: string;
  sections: InsightSection[];
};

export const INSIGHTS: InsightArticle[] = [
  {
    slug: "how-us-tariffs-are-affecting-canadian-small-businesses",
    title: "How U.S. Tariffs Are Affecting Canadian Small Businesses in 2026",
    metaDescription:
      "A clear breakdown of how current U.S. tariffs are impacting Canadian exporters by sector, and what small businesses can do to respond.",
    dek: "A sector-by-sector look at where U.S. tariffs are landing hardest, and how to respond.",
    intro:
      "Tariffs on Canadian exports to the United States aren't evenly distributed — some sectors are absorbing steep, targeted increases, while others see little change at all. For a small or medium-sized business, knowing where you actually sit matters more than the headlines.",
    sections: [
      {
        heading: "Which Sectors Are Most Exposed",
        paragraphs: [
          "Exposure varies widely by product category. Steel, aluminum, and automotive parts have faced some of the steepest and most persistent tariff increases, while machinery, electronics, and most consumer goods have generally seen lower, more moderate rates.",
          "Agri-food sits in its own category: export tariffs into the U.S. are often manageable, but the picture flips if you're importing — Canada's own supply-managed goods (dairy, poultry, eggs) carry very high over-quota tariffs regardless of trading partner.",
        ],
      },
      {
        heading: "Steel, Aluminum, and Auto Parts Under Pressure",
        paragraphs: [
          "Section 232-style measures have kept tariffs on Canadian steel and aluminum exports elevated — in some cases as high as 25% — making the U.S. a genuinely difficult market for these categories even with the deep integration of North American supply chains.",
          "Auto parts exporters face a more moderate but still meaningful tariff environment, and the bigger risk is often indirect: a slowdown anywhere in the integrated Canada-U.S.-Mexico auto supply chain can ripple through smaller suppliers quickly.",
        ],
      },
      {
        heading: "What This Means for Small and Medium-Sized Exporters",
        paragraphs: [
          "Large multinationals can often absorb tariff costs, shift production, or renegotiate supplier contracts. Smaller exporters typically can't — a 15-25% cost increase on your largest market can compress margins to the point where a single client's payment terms become a cash flow problem.",
          "This is exactly why diversification and government support programs matter more for SMEs than for large enterprises: the tools exist, but smaller teams often don't have the bandwidth to research them without a nudge.",
        ],
      },
      {
        heading: "Practical Steps to Reduce Your Exposure",
        paragraphs: [
          "You don't need a trade lawyer to get started. A few concrete steps go a long way:",
        ],
        list: [
          "Confirm the exact tariff rate for your specific HS code — broad category estimates can be misleading.",
          "Model your landed cost and margin under the current tariff, not last year's.",
          "Identify one or two alternative markets and estimate their comparative tariff exposure.",
          "Check whether your business qualifies for federal tariff-response funding before assuming it doesn't apply to you.",
        ],
        link: {
          label: "Regional Tariff Response Initiative (RTRI)",
          href: "https://ised-isde.canada.ca/site/ised/en/regional-tariff-response-initiative",
        },
      },
    ],
  },
  {
    slug: "alternative-export-markets-beyond-the-us",
    title: "5 Alternative Export Markets for Canadian Businesses Beyond the U.S.",
    metaDescription:
      "Explore five promising export markets — from the EU to Japan — for Canadian businesses looking to reduce reliance on the U.S. market.",
    dek: "Where to look first if you're ready to diversify beyond the U.S.",
    intro:
      "Canada has trade agreements with far more of the world than most exporters actively use. If the U.S. has become a less predictable market, these five destinations are worth a serious look — each backed by an existing Canadian trade agreement, not a market you'd be entering cold.",
    sections: [
      {
        heading: "Why Market Diversification Matters Now",
        paragraphs: [
          "Concentration risk is the quiet danger in relying on a single export market: it works fine until that market's policy shifts, and then it's the only thing that matters. Diversifying doesn't mean abandoning the U.S. — for most businesses it still makes sense as a primary market — it means having a genuine second option ready before you need one.",
        ],
      },
      {
        heading: "European Union: Tariff-Free Access Under CETA",
        paragraphs: [
          "The Canada-EU Comprehensive Economic and Trade Agreement (CETA) eliminates tariffs on the vast majority of goods traded between Canada and the EU. For many manufactured goods, machinery, and processed food products, this means EU market entry costs are primarily about logistics and compliance, not tariffs.",
        ],
      },
      {
        heading: "United Kingdom: A Familiar Regulatory Environment",
        paragraphs: [
          "The UK offers English-language business culture, established shipping routes, and generally favourable tariff treatment for Canadian goods. For businesses new to export diversification, it's often one of the lowest-friction places to start.",
        ],
      },
      {
        heading: "Japan and CPTPP: Low Tariffs, High Standards",
        paragraphs: [
          "Through the Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP), many Canadian exports to Japan already enter duty-free or at sharply reduced rates. Japan's certification and quality standards are demanding, but Canadian exporters who meet them often find a stable, high-value customer base.",
        ],
      },
      {
        heading: "Australia: An Underrated Opportunity",
        paragraphs: [
          "Also a CPTPP member, Australia is frequently overlooked simply because of distance — but for agri-food, machinery, and several other categories, tariff exposure is low and the market rewards quality over price competition, which favours Canadian exporters who aren't trying to be the cheapest option.",
        ],
        link: {
          label: "CanExport SMEs (funding to help offset new market-entry costs)",
          href: "https://www.tradecommissioner.gc.ca/en/our-solutions/funding-financing-international-business/canexport-smes.html",
        },
      },
    ],
  },
  {
    slug: "canadian-government-tariff-relief-programs-guide",
    title: "A Complete Guide to Canadian Government Tariff Relief Programs",
    metaDescription:
      "Everything Canadian businesses need to know about RTRI, CanExport, BDC Pivot to Grow, and the EDC Trade Impact Program.",
    dek: "A plain-language walkthrough of the four major federal programs responding to tariffs.",
    intro:
      "The federal government has put real money behind helping Canadian businesses manage tariff disruption — but the programs are spread across different agencies with different eligibility rules, which makes them easy to miss. Here's what each one actually does.",
    sections: [
      {
        heading: "Regional Tariff Response Initiative (RTRI)",
        paragraphs: [
          "Delivered through Canada's regional development agencies, RTRI provides funding to help tariff-impacted small and medium-sized businesses adapt, diversify into new markets, and strengthen their supply chains. It's the broadest of the four programs and the best starting point if you're not sure which one applies to you.",
        ],
        link: {
          label: "Regional Tariff Response Initiative",
          href: "https://ised-isde.canada.ca/site/ised/en/regional-tariff-response-initiative",
        },
      },
      {
        heading: "CanExport SMEs: Funding for Market Expansion",
        paragraphs: [
          "CanExport SMEs cost-shares eligible export marketing and market-entry expenses — things like trade show attendance, certification costs, and market research — for Canadian SMEs with a genuine plan to export to a new international market, up to $50,000 per project.",
        ],
        link: {
          label: "CanExport SMEs",
          href: "https://www.tradecommissioner.gc.ca/en/our-solutions/funding-financing-international-business/canexport-smes.html",
        },
      },
      {
        heading: "BDC Pivot to Grow Loan",
        paragraphs: [
          "The Business Development Bank of Canada's Pivot to Grow Loan offers financing from $250,000 up to $5 million to help established exporters manage cash flow and adapt operations in response to U.S. tariffs. It's aimed specifically at companies with an existing operating history and meaningful U.S. export revenue — not early-stage businesses.",
        ],
        link: {
          label: "BDC Pivot to Grow Loan",
          href: "https://www.bdc.ca/en/financing/pivot-grow-loan",
        },
      },
      {
        heading: "EDC Trade Impact Program",
        paragraphs: [
          "Export Development Canada's Trade Impact Program provides financing, working capital support, trade credit insurance, and foreign exchange solutions to help exporters — and the companies that supply them — manage tariff-related pressure, with particular focus on sectors like steel, aluminum, and agri-food.",
        ],
        link: {
          label: "EDC Trade Impact Program",
          href: "https://www.edc.ca/en/campaign/trade-support-canadian-companies.html",
        },
      },
      {
        heading: "How to Know Which Program Fits Your Business",
        paragraphs: [
          "As a rough guide: RTRI is the most accessible starting point for most SMEs. CanExport suits businesses actively entering a new market. BDC's loan fits established exporters needing working capital. EDC fits businesses that need financing, insurance, or FX tools tied to existing export activity. Many businesses end up using more than one — they aren't mutually exclusive, and each has its own eligibility review, so the details on official pages should always be your final source of truth.",
        ],
      },
    ],
  },
  {
    slug: "how-to-calculate-your-business-tariff-exposure",
    title: "How to Calculate Your Business's Tariff Exposure",
    metaDescription:
      "Learn how to assess your tariff exposure by product category, market, and trade direction — and why it matters for your bottom line.",
    dek: "A step-by-step framework for understanding what tariffs actually cost your business.",
    intro:
      "\"Tariff exposure\" sounds like a single number, but it's really a combination of four things: what you sell, where it's classified, which market it's headed to (or from), and which direction the trade flows. Get these right and the rest is arithmetic.",
    sections: [
      {
        heading: "Start With Your HS Code and Product Category",
        paragraphs: [
          "Every traded good is classified under a Harmonized System (HS) code, and tariff rates are set at that level of detail — not at the level of \"electronics\" or \"furniture.\" Two products in the same general category can face very different tariff treatment depending on their exact classification, so confirming your specific HS code is the first real step, not an afterthought.",
        ],
      },
      {
        heading: "Understand Export vs. Import Tariff Exposure",
        paragraphs: [
          "If you're exporting, your exposure is the tariff the destination market charges on goods arriving from Canada. If you're importing, it's the duty Canada charges on goods coming in from your supplier's country. These are genuinely different numbers, often set under different trade agreements, and confusing the two is one of the most common exposure-estimation mistakes.",
          "Under agreements like CUSMA, CETA, and CPTPP, many imports from Canada's major trading partners already enter at or near 0% — but exceptions exist, particularly for supply-managed agricultural goods, where over-quota tariffs can be very high regardless of the exporting country.",
        ],
      },
      {
        heading: "Factor in Ease of Doing Business and Friction Costs",
        paragraphs: [
          "The tariff rate is only part of the real cost of entering a market. Shipping distance, customs complexity, certification requirements, and language or regulatory familiarity all add friction that doesn't show up on a tariff schedule but absolutely shows up in your landed cost and time-to-revenue.",
        ],
      },
      {
        heading: "Using Data to Make a Diversification Decision",
        paragraphs: [
          "Once you have tariff rate, ease of doing business, and friction cost for a handful of candidate markets side by side, the decision usually becomes clearer than it felt at the start. The market with the technically lowest tariff isn't always the best choice if friction costs are high — and a slightly higher-tariff market with strong logistics and familiar regulations can outperform it in practice.",
        ],
        link: {
          label: "Regional Tariff Response Initiative",
          href: "https://ised-isde.canada.ca/site/ised/en/regional-tariff-response-initiative",
        },
      },
    ],
  },
  {
    slug: "export-vs-import-tariff-risk-profile",
    title: "Export vs. Import: Understanding Your Tariff Risk Profile",
    metaDescription:
      "Whether you export to the U.S. or import from abroad, tariffs affect your business differently. Here's how to think about your risk profile.",
    dek: "Two different risk profiles, two different playbooks.",
    intro:
      "\"Tariffs are a problem\" isn't specific enough to act on. Exporters and importers face genuinely different risks, and the right response depends on which side of the transaction you're on.",
    sections: [
      {
        heading: "Why Direction of Trade Changes Your Risk",
        paragraphs: [
          "An exporter's risk is that a foreign government raises the cost of your goods entering their market — something entirely outside your control, driven by policy decisions made elsewhere. An importer's risk is closer to home: it's your own government's tariff schedule, plus your supplier relationships and the exchange rate. Both are real risks, but they call for different mitigation strategies.",
        ],
      },
      {
        heading: "Export Risk: Losing Access to Your Biggest Market",
        paragraphs: [
          "If a large share of your revenue comes from exporting to a single market, a tariff increase there is effectively a policy decision made by someone else that directly hits your margin. The mitigation is market diversification — building a credible second or third market so no single country's policy shift can threaten the business.",
        ],
        link: {
          label: "EDC Trade Impact Program",
          href: "https://www.edc.ca/en/campaign/trade-support-canadian-companies.html",
        },
      },
      {
        heading: "Import Risk: Rising Costs on Sourced Goods",
        paragraphs: [
          "If you import inputs or finished goods, your risk is Canada's own tariff schedule and how it applies to your specific suppliers. This is often more manageable than export risk because Canada has FTAs eliminating tariffs with most major trading partners — but rules-of-origin requirements can be complex, and goods that don't technically qualify for preferential treatment can face the full non-preferential rate even under a nominal free trade agreement.",
        ],
      },
      {
        heading: "Building a Resilient Trade Strategy for Either Direction",
        paragraphs: [
          "Whichever side of the transaction you're on, the underlying discipline is the same: know your actual tariff exposure by HS code and market, avoid relying on a single country in either direction, and treat government support programs as a normal part of your planning rather than a last resort.",
        ],
      },
    ],
  },
];

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return INSIGHTS.find((article) => article.slug === slug);
}
