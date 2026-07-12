import { convertMinorUnits } from "@/lib/fx-math";
import type { FxRateSource } from "@/types";

/**
 * Client-side bridge to the server FX route. The browser never talks to the
 * FX provider itself — it asks /api/fx/rate, which owns keys, timeouts and
 * the cached-rate fallback policy.
 */

export interface ResolvedFx {
  convertedAmountMinorUnits: number;
  rate: string;
  rateTimestamp: string;
  rateSource: FxRateSource;
}

export class FxRateUnavailableError extends Error {
  constructor() {
    super("Couldn't get an exchange rate right now — try again in a moment.");
    this.name = "FxRateUnavailableError";
  }
}

/**
 * Resolve the FX data an expense needs before it can be saved.
 * Same-currency expenses short-circuit with rate "1" — no network call.
 * Throws FxRateUnavailableError when the API is down AND no cached rate
 * exists for the pair; a rate is never fabricated.
 */
export async function resolveExpenseFx(
  amountMinorUnits: number,
  fromCurrency: string,
  toCurrency: string
): Promise<ResolvedFx> {
  if (fromCurrency === toCurrency) {
    return {
      convertedAmountMinorUnits: amountMinorUnits,
      rate: "1",
      rateTimestamp: new Date().toISOString(),
      rateSource: "live",
    };
  }

  let response: Response;
  try {
    response = await fetch("/api/fx/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromCurrency, to: toCurrency }),
    });
  } catch {
    throw new FxRateUnavailableError();
  }

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.ok || typeof json.rate !== "string") {
    throw new FxRateUnavailableError();
  }

  return {
    convertedAmountMinorUnits: convertMinorUnits(
      amountMinorUnits,
      json.rate,
      fromCurrency,
      toCurrency
    ),
    rate: json.rate,
    rateTimestamp:
      typeof json.timestamp === "string"
        ? json.timestamp
        : new Date().toISOString(),
    rateSource: json.source === "cached" ? "cached" : "live",
  };
}
