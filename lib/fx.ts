import type { SupabaseClient } from "@supabase/supabase-js";
import { readCachedRate, writeCachedRate } from "@/lib/db/fxRates";
import { toDecimalString } from "@/lib/fx-math";

/**
 * FX rate service — SERVER-SIDE ONLY.
 *
 * The client never talks to the FX provider directly: keys stay server-side
 * and the rate is applied atomically with expense creation. Called from
 * `app/api/fx/rate/route.ts`.
 */

const FX_TIMEOUT_MS = 5000;

export type RateSource = "live" | "cached";

export interface ExchangeRateResult {
  /** Decimal string, e.g. "1543.20" — never a raw float. */
  rate: string;
  source: RateSource;
  /** When the rate was fetched (live) or originally cached. */
  timestamp: string;
}

export class FxUnavailableError extends Error {
  constructor(fromCurrency: string, toCurrency: string) {
    super(
      `No exchange rate available for ${fromCurrency}→${toCurrency}: live API failed and no cached rate exists`
    );
    this.name = "FxUnavailableError";
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FX_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

/** exchangerate.host `/live` — used when FX_API_KEY is configured. */
async function fetchExchangerateHost(
  from: string,
  to: string,
  apiKey: string
): Promise<number> {
  const url =
    `https://api.exchangerate.host/live?access_key=${encodeURIComponent(apiKey)}` +
    `&source=${from}&currencies=${to}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`exchangerate.host HTTP ${res.status}`);

  const json = await res.json();
  const rate = json?.quotes?.[`${from}${to}`];
  if (json?.success !== true || typeof rate !== "number" || rate <= 0) {
    throw new Error(`exchangerate.host returned no rate for ${from}${to}`);
  }
  return rate;
}

/** open.er-api.com — free, keyless fallback provider (daily rates). */
async function fetchOpenErApi(from: string, to: string): Promise<number> {
  const res = await fetchWithTimeout(
    `https://open.er-api.com/v6/latest/${from}`
  );
  if (!res.ok) throw new Error(`open.er-api.com HTTP ${res.status}`);

  const json = await res.json();
  const rate = json?.rates?.[to];
  if (json?.result !== "success" || typeof rate !== "number" || rate <= 0) {
    throw new Error(`open.er-api.com returned no rate for ${from}→${to}`);
  }
  return rate;
}

async function fetchLiveRate(from: string, to: string): Promise<string> {
  const apiKey = process.env.FX_API_KEY;
  const raw = apiKey
    ? await fetchExchangerateHost(from, to, apiKey)
    : await fetchOpenErApi(from, to);
  return toDecimalString(raw);
}

/**
 * Get the exchange rate for a currency pair.
 *
 * 1. Same currency → trivially "1", no API call.
 * 2. Live FX API (5s timeout). On success the cache row for this pair is
 *    overwritten so it always holds the most recent rate.
 * 3. On any live failure → most recent cached rate for this exact pair.
 * 4. No cache either → FxUnavailableError. A rate is NEVER fabricated.
 */
export async function getExchangeRate(
  supabase: SupabaseClient,
  fromCurrency: string,
  toCurrency: string
): Promise<ExchangeRateResult> {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) {
    return { rate: "1", source: "live", timestamp: new Date().toISOString() };
  }

  try {
    const rate = await fetchLiveRate(from, to);
    const timestamp = new Date().toISOString();
    await writeCachedRate(supabase, from, to, rate, timestamp);
    return { rate, source: "live", timestamp };
  } catch (error) {
    console.error(`Live FX fetch failed for ${from}→${to}:`, error);
  }

  const cached = await readCachedRate(supabase, from, to);
  if (cached) {
    return { rate: cached.rate, source: "cached", timestamp: cached.fetchedAt };
  }

  throw new FxUnavailableError(from, to);
}
