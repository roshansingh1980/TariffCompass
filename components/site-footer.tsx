import { TcLockup } from "@/components/brand/tc-lockup";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 sm:px-8">
        <TcLockup size="small" orientation="horizontal" />
        <div className="flex flex-col items-center gap-3 text-center text-xs text-muted-foreground/70 sm:flex-row sm:justify-between sm:text-left">
          <p className="tracking-wide">
            &copy; {new Date().getFullYear()} TariffCompass. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="cursor-default tracking-wide transition-colors duration-200 hover:text-foreground">
              Privacy
            </span>
            <span className="cursor-default tracking-wide transition-colors duration-200 hover:text-foreground">
              Terms
            </span>
          </div>
        </div>
        <p className="max-w-2xl text-center text-[11px] leading-relaxed text-muted-foreground/60">
          TariffCompass is an independent software tool. It is not affiliated with the Government
          of Canada, CBSA, EDC, BDC, or any U.S. government agency. Information is provided for
          general guidance only.
        </p>
      </div>
    </footer>
  );
}
