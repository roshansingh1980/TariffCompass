/**
 * Bridges wizard state across the one real page navigation an anonymous
 * visitor hits: clicking through to /signup from Results (to generate a
 * brief or save a profile) and back to /dashboard on success. sessionStorage
 * only — nothing here ever touches Postgres. This replaces the ghost-user
 * cookie's old job of surviving that gap, without minting a database row
 * for every anonymous visitor.
 */

import type { Country } from "@/lib/onboarding-data";
import type { Currency } from "@/components/onboarding/exposure-step";

export type PendingWizardState = {
  scenario: string | null;
  country: Country;
  province: string | null;
  usState: string | null;
  category: string | null;
  productName: string;
  annualValue: string;
  currency: Currency;
  hsCode: string;
};

const STORAGE_KEY = "tc-pending-wizard";

export function savePendingWizardState(state: PendingWizardState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage can be unavailable (private mode, disabled storage) —
    // losing the handoff is a worse UX than crashing the click.
  }
}

export function loadPendingWizardState(): PendingWizardState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingWizardState) : null;
  } catch {
    return null;
  }
}

export function clearPendingWizardState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage isn't available in the first place.
  }
}
