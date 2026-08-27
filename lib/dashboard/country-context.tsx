"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Country } from "@/lib/onboarding-data";

type CountryContextValue = {
  country: Country;
  setCountry: (country: Country) => void;
};

const CountryContext = createContext<CountryContextValue | null>(null);

/**
 * The Canada/US toggle lives in the sidebar (persistent across every
 * dashboard step) but the wizard itself needs to read it too — a plain
 * context avoids threading it through the layout's opaque `children`.
 */
export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>("CA");
  return <CountryContext.Provider value={{ country, setCountry }}>{children}</CountryContext.Provider>;
}

export function useCountry(): CountryContextValue {
  const context = useContext(CountryContext);
  if (!context) throw new Error("useCountry must be used within a CountryProvider");
  return context;
}
