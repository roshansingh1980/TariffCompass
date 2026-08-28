"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatHsCode, isValidHsCode } from "@/lib/hs-code";
import { requestHsSuggestions, type HsSuggestion } from "@/lib/hs-search";
import { CATEGORIES } from "@/lib/onboarding-data";
import { cn } from "@/lib/utils";

export function ProductStep({
  category,
  productName,
  hsCode,
  onCategoryChange,
  onProductNameChange,
  onHsCodeChange,
  onBack,
  onContinue,
}: {
  category: string | null;
  productName: string;
  hsCode: string;
  onCategoryChange: (value: string) => void;
  onProductNameChange: (value: string) => void;
  onHsCodeChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [suggestions, setSuggestions] = useState<HsSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const hsCodeInvalid = hsCode.length > 0 && !isValidHsCode(hsCode);

  useEffect(() => {
    if (productName.trim().length < 3) {
      setSuggestions([]);
      setSearchAttempted(false);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    const timer = setTimeout(() => {
      requestHsSuggestions(productName).then((matches) => {
        if (cancelled) return;
        setSuggestions(matches);
        setSearchAttempted(true);
        setIsSearching(false);
      });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [productName]);

  return (
    <>
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          What do you sell or import?
        </h1>
        <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
          Describe the product and add its HS code if you know it. The category remains a fallback.
        </p>
      </div>

      <div className="mt-20 flex w-full max-w-2xl flex-wrap justify-center gap-3.5">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-6 py-3 text-sm font-medium tracking-tight transition-all duration-200 active:scale-[0.97]",
                isSelected
                  ? "border-foreground bg-foreground text-background shadow-[0_4px_16px_-6px_rgba(0,0,0,0.2)]"
                  : "border-border/50 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-foreground/[0.02]"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-14 grid w-full max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="text-left">
        <label
          htmlFor="product-name"
          className="text-[13px] font-medium tracking-wide text-foreground"
        >
          Product description (optional)
        </label>
        <Input
          id="product-name"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="e.g. Brake pads"
          className="mt-2.5 h-11 rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        />
          {isSearching && <p className="mt-2 text-xs text-muted-foreground">Searching official HTS descriptions…</p>}
          {!isSearching && suggestions.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border/60">
              {suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.hsCode}-${suggestion.displayCode}`}
                  type="button"
                  onClick={() => onHsCodeChange(suggestion.hsCode)}
                  className="block w-full border-b border-border/50 px-3.5 py-3 text-left last:border-0 hover:bg-foreground/[0.03]"
                >
                  <span className="block text-xs font-semibold text-foreground">{suggestion.displayCode}</span>
                  <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-muted-foreground">{suggestion.description}</span>
                </button>
              ))}
            </div>
          )}
          {!isSearching && searchAttempted && suggestions.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">No official matches are available right now. You can continue without one.</p>
          )}
        </div>

        <div className="text-left">
          <label htmlFor="hs-code" className="text-[13px] font-medium tracking-wide text-foreground">
            HS code (optional)
          </label>
          <Input
            id="hs-code"
            value={hsCode}
            onChange={(event) => onHsCodeChange(event.target.value.replace(/[^\d.\s-]/g, ""))}
            placeholder="e.g. 870830"
            inputMode="numeric"
            aria-invalid={hsCodeInvalid}
            className={cn(
              "mt-2.5 h-11 rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
              hsCodeInvalid && "border-destructive"
            )}
          />
          <p className={cn("mt-2 text-xs leading-relaxed", hsCodeInvalid ? "text-destructive" : "text-muted-foreground")}>
            {hsCodeInvalid
              ? "Enter a 6-digit HS code, or leave it blank."
              : hsCode
                ? `Using HS ${formatHsCode(hsCode)} for matching.`
                : "If you know your HS code, enter it. If not, TariffCompass can help find likely matches, but classification should be confirmed with a customs professional."}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Suggestions come from the official U.S. International Trade Commission HTS and are possible matches, not tariff-classification determinations.
          </p>
        </div>
      </div>

      <div className="mt-20 flex items-center gap-5">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground transition-transform duration-200 hover:text-foreground active:scale-[0.98]"
        >
          Back
        </Button>
        <Button
          size="lg"
          disabled={!category || hsCodeInvalid}
          onClick={onContinue}
          className="h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] active:scale-[0.98]"
        >
          Continue
        </Button>
      </div>
    </>
  );
}
