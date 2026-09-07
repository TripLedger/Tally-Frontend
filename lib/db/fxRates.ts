import { toDecimalString } from "@/lib/fx-math";

/**
 * In-memory FX rate cache — one entry per (base, target) pair.
 * Server-side only: called from the FX API route.
 */

export interface CachedFxRate {
  rate: string;
  fetchedAt: string;
}

const memoryRates = new Map<string, CachedFxRate>();

function pairKey(base: string, target: string) {
  return `${base.toUpperCase()}→${target.toUpperCase()}`;
}

export async function readCachedRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<CachedFxRate | null> {
  return memoryRates.get(pairKey(baseCurrency, targetCurrency)) ?? null;
}

export async function writeCachedRate(
  baseCurrency: string,
  targetCurrency: string,
  rate: string,
  fetchedAt: string
): Promise<void> {
  try {
    memoryRates.set(pairKey(baseCurrency, targetCurrency), {
      rate: toDecimalString(rate),
      fetchedAt,
    });
  } catch (error) {
    // Cache write failures must never block expense creation.
    console.error("Failed to cache FX rate:", error);
  }
}
