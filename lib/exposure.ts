/**
 * Turns an existing tariffRate string (e.g. "10–50%", "50%", "0% (CUSMA)")
 * into a low/mid/high number range, and — given an annual value shipped —
 * into a dollar exposure estimate. Never invents a rate: if the string
 * carries no number at all (an "unknown"-confidence row's "Unknown"), both
 * functions return null and callers should render nothing rather than guess.
 */

export type RateRange = { low: number; mid: number; high: number };

export function parseRateRange(tariffRate: string): RateRange | null {
  const matches = tariffRate.match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return null;

  const numbers = matches.map(Number);
  const low = Math.min(...numbers);
  const high = Math.max(...numbers);
  return { low, mid: (low + high) / 2, high };
}

export type ExposureEstimate = {
  lowRate: number;
  midRate: number;
  highRate: number;
  lowAmount: number;
  midAmount: number;
  highAmount: number;
};

export function computeExposure(annualValue: number, tariffRate: string): ExposureEstimate | null {
  if (!Number.isFinite(annualValue) || annualValue <= 0) return null;

  const range = parseRateRange(tariffRate);
  if (!range) return null;

  return {
    lowRate: range.low,
    midRate: range.mid,
    highRate: range.high,
    lowAmount: annualValue * (range.low / 100),
    midAmount: annualValue * (range.mid / 100),
    highAmount: annualValue * (range.high / 100),
  };
}
