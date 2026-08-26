import Link from "next/link";

const NAV_ITEMS = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "About", href: "#" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-foreground"
        >
          TariffCompass
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium tracking-wide text-muted-foreground/80 transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
