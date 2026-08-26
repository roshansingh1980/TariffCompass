import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/onboarding-data";
import { cn } from "@/lib/utils";

export function ProductStep({
  category,
  productName,
  onCategoryChange,
  onProductNameChange,
  onBack,
  onContinue,
}: {
  category: string | null;
  productName: string;
  onCategoryChange: (value: string) => void;
  onProductNameChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          What do you sell or import?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Pick the category that best fits, then tell us the specific product.
        </p>
      </div>

      <div className="mt-16 flex w-full max-w-2xl flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-medium tracking-tight transition-all duration-200",
                isSelected
                  ? "border-foreground bg-foreground text-background shadow-sm"
                  : "border-border/70 text-foreground hover:border-foreground/40 hover:bg-foreground/[0.02]"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-12 w-full max-w-sm text-left">
        <label
          htmlFor="product-name"
          className="text-sm font-medium text-foreground"
        >
          Specific product name (optional)
        </label>
        <Input
          id="product-name"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="e.g. Brake pads"
          className="mt-2.5 h-12 rounded-xl border-border/70 px-4 text-base"
        />
      </div>

      <div className="mt-16 flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="h-12 rounded-full px-8 text-[15px] font-medium tracking-tight text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
        <Button
          size="lg"
          disabled={!category}
          onClick={onContinue}
          className="h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
        >
          Continue
        </Button>
      </div>
    </>
  );
}
