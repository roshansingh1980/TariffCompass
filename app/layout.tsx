import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EdgeGlow } from "@/components/edge-glow";
import { NavTracker } from "@/components/nav-tracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Logotype only — the wordmark and hero display type. All UI stays Geist.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

function resolveSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      // Falls through to the default below — an invalid/blank value here
      // (e.g. a build variable set but left empty) must never crash every
      // page on the site just to get metadataBase right.
      console.error(`NEXT_PUBLIC_SITE_URL is not a valid URL: "${configured}"`);
    }
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: "TariffCompass — Canadian trade-impact intelligence",
  description: "Understand what changed, whether it affects your business, the financial impact, and what to do next.",
  openGraph: {
    title: "TariffCompass — Canadian trade-impact intelligence",
    description: "Understand what changed, whether it affects your business, the financial impact, and what to do next.",
    images: ["/mark.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <EdgeGlow />
        <NavTracker />
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
