import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center sm:py-40">
      <h1 className="text-6xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-7xl">
        TariffCompass
      </h1>
      <p className="mt-6 max-w-md text-lg font-normal text-muted-foreground sm:text-xl">
        Navigate tariffs. Find your path.
      </p>
      <Button
        size="lg"
        className="mt-14 h-12 rounded-full px-9 text-[15px] font-medium tracking-tight shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
      >
        Get Started
      </Button>
    </div>
  );
}
