# TariffCompass — Product Feature Roadmap

Six-week build to take the product from a category-level comparison tool to an HS-code-level exposure and monitoring platform. Replaces the previous "ship fast, meet people, iterate" sequencing — the things below are obviously needed by a Canadian exporter, so there is no hypothesis to validate before building them.

**The bar:** an exporter asks "I make aluminium extrusions, I ship $2M to Ohio, what do I actually pay and what changed?" Today the answer is "Steel & Metals, 10–50%, Challenging." The target answer is "HS 7604.29, Canadian origin, 50% under Section 232 as amended by Proclamation 11047 effective 22 August. On $2M that's $1M. It was 25% until 22 August. Here's the proclamation."

Everything else — the brief, the comparison, the exposure math — is already good and improves automatically once the number underneath is specific.

---

## Week 1–2 — HS-code-level rates

The foundation. Every other improvement multiplies off this.

- [ ] USITC HTS ingestion via `hts.usitc.gov/reststop/search` (verified 200 from the Worker runtime). Note: undocumented/internal endpoint — monitor for silent breakage
- [ ] `tariff_rates` extended to key on HS code, not category
- [ ] HS code lookup on intake, with **search by product description** — most SMEs don't know their code. This is the difference between usable and not
- [ ] Category chips demoted to fallback when no code is entered
- [ ] Confidence model becomes three-tier: *official* (HTS base rates), *official source, human-read* (232/338, counter-tariffs), *estimated* (everything else)
- [ ] Every rate row carries its source, retrieval date, and HTS revision
- [ ] Restore the CUSMA annotation lost in the Postgres migration — needs its own column this time, not free text

**Explicitly not building:** AI HS classification. Highest liability, lowest margin, brokers own it, and one wrong code costs credibility permanently. Take the code as an input; help the user find it by description.

---

## Week 3 — Section 232 / 338 layer

The piece nobody does for SMEs. This is the moat, and it's manual.

- [ ] Federal Register API connector — finds proclamations and amendments, gives structured effective dates (fills the `effective_from` column that alerts depend on)
- [ ] Canada Gazette Part II RSS — counter-tariff and remission orders
- [ ] Hand-extraction of rates from proclamation prose into structured rows. **No API returns "steel derivatives, 50%, effective this date."** A person reads the annex
- [ ] Stacking logic — one market row carries MFN + 232 + counter-tariff simultaneously, summed rather than replaced
- [ ] Lifecycle tracking — proclamations get amended, delayed, exclusion-processed, terminated. Link related documents into one evolving current-rate fact
- [ ] Exclusion and de minimis handling (e.g. the sub-15% metal content carve-out)

**Scope discipline:** this is where six weeks becomes ten. Cover only the categories you'll sell into — steel, machinery, furniture, apparel, electronics. Leave the rest at category level and label them as such.

---

## Week 4 — CUSMA / CKFTA qualification

The single highest-value question for a Canadian exporter, currently unanswered.

- [ ] Rules of origin by HS chapter
- [ ] Qualification questionnaire — where inputs are sourced, degree of transformation, regional value content
- [ ] Documentation requirements: certification of origin, what records to keep, how long
- [ ] Clear output: qualifies / doesn't / needs a broker's opinion — never a false certainty
- [ ] Same treatment for CKFTA (Korea), CETA (EU), CPTPP

This is where an SME is most underserved and where a broker charges the most.

---

## Week 5 — Alerts

Only possible once `effective_from` exists and rates are per-code. This is the subscription.

- [ ] Scheduled diff job against each saved profile's HS codes
- [ ] `rate_changes` table with before/after and the triggering document
- [ ] Weekly digest email: "Your HS 7604.29 rate moved from 25% to 50% on 22 August. At your volume that's $500,000. Here's the proclamation."
- [ ] Program deadline warnings — CanExport and RTRI intake windows. Schema exists, all NULL, needs research
- [ ] In-app change history per saved profile
- [ ] Public/private boundary holds: public data, private monitoring. If change history ever becomes public, the alert product dies

---

## Week 6 — Professional tier

- [ ] White-label PDF export — firm logo and name on the brief. Unlocks the tier; an accountant will not send a client something branded TariffCompass
- [ ] Multi-client workspace — client list, per-client profiles and history, which moved this week
- [ ] Seat billing (Stripe quantity-based)
- [ ] Brief rewritten to use specific figures instead of ranges
- [ ] Defensible paper trail on every export: sources as of, HTS revision, retrieval dates
- [ ] `/for-advisors` page

---

## Deferred to V2

Cut deliberately, not forgotten.

- Homepage heatmap as a category × column grid with market dropdowns
- Direction × market summary pages (~16, sitemap-derived)
- Asymmetric landing layout (heatmap 2/3, timeline 1/3)
- Wizard collapse to a single page
- `companies` / `products` table cleanup
- `measure_type` backfill on the 12 NULL rows
- Stripe checkout error UI (`useActionState` rebuild)
- `key_dates` cutover from static file to Postgres
- Rebuilding the AI freshness-review pipeline against Postgres
- SEO-Blueprint execution

---

## Run in parallel — costs nothing, blocks nothing

- [ ] Book the lawyer. All blocking decisions are made
- [ ] Three exporter and three retail conversations during weeks 1–3. Not to validate the plan — to watch someone use it. Surfaces things building never does
- [ ] NRC IRAP advisor call, PacifiCan call
- [ ] Manual end-to-end credit card test once Access lifts
- [ ] Set C$29 as Stripe default price, archive C$99

Hold the three accountants, two bankers and two consultants until week 6 is done. Those are the conversations that need the wow version.

---

## What "wow" means here, concretely

Not polish. Specificity. The current product tells you a range for your category. The target tells you a number for your product, cites the legal instrument behind it, and emails you when it moves. That gap is entirely data, not design — which is why six weeks of ingestion work beats six weeks of interface work.
