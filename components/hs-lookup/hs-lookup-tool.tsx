"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatHsCode, isValidHsCode, normalizeHsCode } from "@/lib/hs-code";
import { requestHsSuggestionResult, type HsSuggestion, type HsSuggestionResult } from "@/lib/hs-search";
import { buildHsAnalysisHref, HS6_NATIONAL_CODE_CAVEAT, HS_CLASSIFICATION_CAVEAT } from "@/lib/hs-lookup";

function ResultCard({ suggestion, productDescription }: { suggestion: HsSuggestion; productDescription: string }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-background p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <p className="text-2xl font-semibold tracking-tight">HS {formatHsCode(suggestion.hsCode)}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{suggestion.description}</p>
      {suggestion.displayCode !== suggestion.hsCode && <p className="mt-2 text-xs text-muted-foreground">U.S. display code: {suggestion.displayCode}</p>}
      <p className="mt-3 text-xs font-medium">Source: {suggestion.sourceName}</p>
      <p className="mt-1 text-xs text-muted-foreground">{HS_CLASSIFICATION_CAVEAT}</p>
      <Button render={<Link href={buildHsAnalysisHref(suggestion.hsCode, productDescription || suggestion.description)} />} className="mt-4 rounded-full px-5">
        Analyze this HS code
      </Button>
    </article>
  );
}

export function HsLookupTool() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<HsSuggestionResult>({ status: "success", suggestions: [] });
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [manualHs, setManualHs] = useState("");
  const [manualDescription, setManualDescription] = useState<string | null>(null);
  const manualValid = isValidHsCode(manualHs);
  const manualInvalid = manualHs.length > 0 && !manualValid;

  useEffect(() => {
    if (query.trim().length < 3) {
      setResult({ status: "success", suggestions: [] });
      setSearching(false);
      setSearched(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    setResult({ status: "success", suggestions: [] });
    const timer = setTimeout(async () => {
      const next = await requestHsSuggestionResult(query);
      if (cancelled) return;
      setResult(next);
      setSearching(false);
      setSearched(true);
    }, 350);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  useEffect(() => {
    if (!manualValid) { setManualDescription(null); return; }
    let cancelled = false;
    setManualDescription(null);
    requestHsSuggestionResult(normalizeHsCode(manualHs)).then((lookup) => {
      if (cancelled) return;
      setManualDescription(lookup.suggestions.find((item) => item.hsCode === normalizeHsCode(manualHs))?.description ?? null);
    });
    return () => { cancelled = true; };
  }, [manualHs, manualValid]);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Free lookup tool</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">HS Code Lookup</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Search official tariff descriptions to find likely HS headings and six-digit codes.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Suggestions are possible matches, not final customs-classification determinations. Confirm classification with a customs professional where required.</p>
      </div>

      <section className="mt-12 rounded-3xl border border-border/60 bg-foreground/[0.015] p-5 sm:p-7">
        <label htmlFor="hs-product-search" className="text-sm font-medium">Describe your product</label>
        <Input id="hs-product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. brake pads, smartphones, hydraulic jacks" className="mt-3 h-12 rounded-xl px-4" />
        {searching && <p className="mt-3 text-sm text-muted-foreground">Searching official USITC HTS descriptions…</p>}
        {!searching && searched && result.status === "unavailable" && <p className="mt-3 text-sm text-destructive">Official description search is temporarily unavailable. If you know a valid HS6 code, you can still use it below.</p>}
        {!searching && searched && result.status === "success" && result.suggestions.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No likely official-description matches were found. Try a more specific product description.</p>}
      </section>

      {result.suggestions.length > 0 && <div className="mt-6 grid gap-4 sm:grid-cols-2">{result.suggestions.map((suggestion) => <ResultCard key={`${suggestion.hsCode}-${suggestion.displayCode}`} suggestion={suggestion} productDescription={query} />)}</div>}

      <section className="mt-12 border-t border-border/60 pt-10">
        <h2 className="text-xl font-semibold tracking-tight">Already know the HS6?</h2>
        <div className="mt-4 max-w-md">
          <Input value={manualHs} onChange={(event) => setManualHs(event.target.value)} placeholder="e.g. 851713" inputMode="numeric" aria-invalid={manualInvalid} className="h-12 rounded-xl px-4" />
          {manualInvalid && <p className="mt-2 text-xs text-destructive">Enter a valid six-digit HS code.</p>}
          {manualValid && <div className="mt-4 rounded-2xl border border-border/60 p-5"><p className="text-xl font-semibold">HS {formatHsCode(manualHs)}</p><p className="mt-2 text-sm text-muted-foreground">{manualDescription ?? "Official description unavailable. You can still continue with this valid HS6 code."}</p><p className="mt-2 text-xs text-muted-foreground">{HS_CLASSIFICATION_CAVEAT}</p><Button render={<Link href={buildHsAnalysisHref(manualHs, manualDescription ?? `HS ${normalizeHsCode(manualHs)}`)} />} className="mt-4 rounded-full px-5">Analyze this HS code</Button></div>}
        </div>
      </section>

      <aside className="mt-12 rounded-2xl border border-border/60 p-5 text-sm leading-relaxed text-muted-foreground"><p>{HS6_NATIONAL_CODE_CAVEAT}</p></aside>
      <section className="mt-12 text-center"><p className="text-sm text-muted-foreground">Found a likely HS code? TariffCompass can show which trade-policy changes may affect it and estimate the financial impact.</p><Button render={<Link href="/dashboard" />} variant="outline" className="mt-4 rounded-full px-6">Analyze tariff exposure</Button></section>
    </div>
  );
}
