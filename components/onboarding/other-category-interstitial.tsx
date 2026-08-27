"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitCategoryRequest } from "@/lib/supabase/category-requests";

export function OtherCategoryInterstitial({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await submitCategoryRequest(email, description);
    setIsSubmitting(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Thanks — we&apos;ve got it
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          We&apos;ll email you when we have real rate data for this product. No spam — just the
          one update.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="mt-10 h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          We don&apos;t have this data yet
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Tariff and market data for custom or uncategorized products isn&apos;t available in
          TariffCompass yet. Tell us what you sell or import and we&apos;ll prioritize adding it —
          leave your email and we&apos;ll let you know when it&apos;s ready.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-left">
          <label htmlFor="request-email" className="text-[13px] font-medium tracking-wide text-foreground">
            Email
          </label>
          <Input
            id="request-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-11 rounded-lg border-border/50 px-3.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="request-description"
            className="text-[13px] font-medium tracking-wide text-foreground"
          >
            What do you sell or import?
          </label>
          <Textarea
            id="request-description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Custom-fabricated aluminum enclosures for industrial sensors"
            className="rounded-lg border-border/50 px-3.5 py-3 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="mt-4 flex items-center gap-5">
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
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] active:scale-[0.98]"
          >
            {isSubmitting ? "Submitting…" : "Submit request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
