/**
 * TEMPORARY — verifies primary-source fetchability from the actual
 * production Workers runtime (different egress IPs/TLS fingerprint than a
 * local sandbox). Delete this route once the check is done; it exists only
 * to answer that one question, not as a permanent feature.
 */

const USER_AGENT = "TariffCompass/1.0 (+https://tariffcompass.ca; research@tariffcompass.ca)";

const URLS = [
  "https://hts.usitc.gov/reststop/search?keyword=steel",
  "https://www.federalregister.gov/api/v1/documents.json?conditions%5Bterm%5D=section+232+steel",
  "https://open.canada.ca/data/api/3/action/package_search?q=surtax",
  "https://gazette.gc.ca/rss/p2-eng.xml",
  "https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html",
];

export async function GET() {
  const results = [];

  for (const url of URLS) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      const text = await response.text();
      results.push({
        url,
        status: response.status,
        statusText: response.statusText,
        preview: text.slice(0, 200),
      });
    } catch (error) {
      results.push({
        url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return Response.json({ results });
}
