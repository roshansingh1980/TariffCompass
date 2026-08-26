export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} TariffCompass. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="transition-colors hover:text-foreground">Privacy</span>
          <span className="transition-colors hover:text-foreground">Terms</span>
        </div>
      </div>
    </footer>
  );
}
