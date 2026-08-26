import { cn } from "@/lib/utils";
import { TcMark } from "@/components/brand/tc-mark";

type Size = "hero" | "default" | "small";
type Orientation = "horizontal" | "stacked";

type Props = {
  className?: string;
  size?: Size;
  orientation?: Orientation;
  /** Only ever renders at size="hero" — every smaller lockup carries the mark and wordmark alone. */
  showDescriptor?: boolean;
};

const MARK_CLASS: Record<Size, string> = {
  hero: "h-11 w-11 sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]",
  default: "h-8 w-8",
  small: "h-5 w-5",
};

const WORDMARK_CLASS: Record<Size, string> = {
  hero: "text-3xl sm:text-5xl md:text-6xl lg:text-7xl",
  default: "text-2xl sm:text-3xl",
  small: "text-lg",
};

const GAP_CLASS: Record<Orientation, Record<Size, string>> = {
  horizontal: {
    hero: "gap-3 sm:gap-5 md:gap-6",
    default: "gap-3",
    small: "gap-2",
  },
  stacked: {
    hero: "gap-5",
    default: "gap-3",
    small: "gap-2",
  },
};

export function TcLockup({
  className,
  size = "default",
  orientation = "horizontal",
  showDescriptor = false,
}: Props) {
  const isHero = size === "hero";
  const descriptor = isHero && showDescriptor;

  const wordmark = (
    <span
      className={cn(
        "font-serif leading-none font-medium tracking-normal text-foreground",
        WORDMARK_CLASS[size]
      )}
    >
      TariffCompass
    </span>
  );

  const descriptorRow = descriptor && (
    <div className="flex items-center gap-2 self-stretch sm:gap-3">
      <span className="h-px flex-grow bg-border" aria-hidden="true" />
      <span className="text-[8px] font-medium tracking-[0.3em] whitespace-nowrap text-muted-foreground uppercase sm:text-[11px]">
        Trade Intelligence
      </span>
      <span className="h-px flex-grow bg-border" aria-hidden="true" />
    </div>
  );

  if (orientation === "stacked") {
    return (
      <div
        className={cn(
          "inline-flex flex-col items-center",
          GAP_CLASS.stacked[size],
          className
        )}
      >
        <TcMark variant={isHero ? "full" : "icon"} className={MARK_CLASS[size]} />
        <div className="flex flex-col items-center gap-4">
          {wordmark}
          {descriptorRow}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center",
        GAP_CLASS.horizontal[size],
        className
      )}
    >
      <TcMark variant={isHero ? "full" : "icon"} className={MARK_CLASS[size]} />
      <div className="flex flex-col items-start gap-3">
        {wordmark}
        {descriptorRow}
      </div>
    </div>
  );
}
