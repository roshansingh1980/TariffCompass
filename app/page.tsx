import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-36 text-center sm:py-48">
      <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-6xl sm:leading-[1.03] md:text-7xl">
        TariffCompass
      </h1>
      <p className="mt-7 max-w-md text-xl font-normal text-muted-foreground sm:text-2xl">
        Navigate tariffs. Find your path.
      </p>
      <Button
        size="lg"
        className="mt-16 h-12 rounded-full px-10 text-[15px] font-medium tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]"
      >
        Get Started
      </Button>
    </div>
  );
}
