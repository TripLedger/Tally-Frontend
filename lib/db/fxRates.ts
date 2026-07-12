import type { SupabaseClient } from "@supabase/supabase-js";
import { toDecimalString } from "@/lib/fx-math";

/**
 * FX rate cache helpers — one row per (base, target) currency pair in the
 * `fx_rates` table, overwritten on every successful live fetch. Only the most
 * recent rate per pair is kept (no historical rates for MVP).
 *
 * Server-side only: called from the FX API route, never from the browser.
 */

export interface CachedFxRate {
  rate: string;
  fetchedAt: string;
}

interface FxRateRow {
  rate: number | string;
  fetched_at: string;
}

export async function readCachedRate(
  supabase: SupabaseClient,
  baseCurrency: string,
  targetCurrency: string
): Promise<CachedFxRate | null> {
  const { data, error } = await supabase
    .from("fx_rates")
    .select("rate, fetched_at")
    .eq("base_currency", baseCurrency)
    .eq("target_currency", targetCurrency)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as FxRateRow;
  try {
    return { rate: toDecimalString(row.rate), fetchedAt: row.fetched_at };
  } catch {
    return null;
  }
}

export async function writeCachedRate(
  supabase: SupabaseClient,
  baseCurrency: string,
  targetCurrency: string,
  rate: string,
  fetchedAt: string
): Promise<void> {
  const { error } = await supabase.from("fx_rates").upsert(
    {
      base_currency: baseCurrency,
      target_currency: targetCurrency,
      rate,
      fetched_at: fetchedAt,
    },
    { onConflict: "base_currency,target_currency" }
  );

  if (error) {
    // Cache write failures must never block expense creation.
    console.error("Failed to cache FX rate:", error.message);
  }
}
