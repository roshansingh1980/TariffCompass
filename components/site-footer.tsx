export function SiteFooter() {
  return (
    <footer className="border-t border-border/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-14 text-center text-xs text-muted-foreground/70 sm:flex-row sm:justify-between sm:px-8 sm:text-left">
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
    </footer>
  );
}
