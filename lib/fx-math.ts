import { getCurrencyDecimals } from "@/lib/currency";

/**
 * Decimal-string FX math, isomorphic (client + server).
 *
 * Invariants for the whole conversion path:
 * - Amounts are ALWAYS integer minor units (kobo, cents, ...).
 * - Exchange rates are ALWAYS decimal strings (e.g. "1543.20") and are only
 *   ever manipulated with BigInt arithmetic — no raw floats anywhere.
 */

const DECIMAL_RE = /^\d+(\.\d+)?$/;

/** "1543.20" → { mantissa: 154320n, scale: 2 } */
export function parseDecimalString(decimal: string): {
  mantissa: bigint;
  scale: number;
} {
  const trimmed = decimal.trim();
  if (!DECIMAL_RE.test(trimmed)) {
    throw new Error(`Invalid decimal rate string: "${decimal}"`);
  }
  const [whole, frac = ""] = trimmed.split(".");
  return { mantissa: BigInt(whole + frac), scale: frac.length };
}

/**
 * Normalize a JS number (as returned by FX APIs / Postgres numeric) into a
 * plain decimal string, expanding exponent notation. Rates below use at most
 * 12 significant fraction digits, which is beyond any real FX precision.
 */
export function toDecimalString(value: number | string): string {
  if (typeof value === "string") {
    if (DECIMAL_RE.test(value.trim())) return value.trim();
    value = Number(value);
  }
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid rate value: ${value}`);
  }
  const plain = String(value);
  if (!/e/i.test(plain)) return plain;
  return value
    .toFixed(12)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

/**
 * Convert integer minor units between currencies using a decimal-string rate.
 *
 *   converted = originalMinor × rate × 10^(toDecimals − fromDecimals)
 *
 * computed entirely in BigInt with half-up rounding, so the result is always
 * a whole number of minor units in the target currency's correct precision —
 * never fractional minor units, never float drift.
 */
export function convertMinorUnits(
  originalMinorUnits: number,
  rate: string,
  fromCurrency: string,
  toCurrency: string
): number {
  const { mantissa, scale } = parseDecimalString(rate);
  const decimalShift =
    getCurrencyDecimals(toCurrency) - getCurrencyDecimals(fromCurrency);

  let numerator = BigInt(Math.round(originalMinorUnits)) * mantissa;
  let denominatorPower = scale;
  if (decimalShift >= 0) {
    numerator *= 10n ** BigInt(decimalShift);
  } else {
    denominatorPower += -decimalShift;
  }
  const denominator = 10n ** BigInt(denominatorPower);

  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  const rounded = remainder * 2n >= denominator ? quotient + 1n : quotient;
  return Number(rounded);
}

/**
 * IMPORTANT — single source of truth for balance math (section 4.6).
 *
 * All balance / debt / settlement calculations must operate on the expense's
 * CONVERTED amount in the trip's base currency, never the original amount.
 * Sum this helper's return value — nothing else — when building 4.6.
 */
export function getExpenseAmountForBalances(expense: {
  baseCurrencyAmount: number;
}): number {
  return expense.baseCurrencyAmount;
}

/**
 * Scale an expense's split map (stored in the ORIGINAL currency) into trip
 * base-currency minor units for balance math. Largest-remainder allocation in
 * BigInt guarantees the scaled shares sum to exactly baseCurrencyAmount, so
 * 4.6's ledger always nets to zero with no lost/gained minor units.
 */
export function scaleSplitsToBaseCurrency(expense: {
  amountMinorUnits: number;
  baseCurrencyAmount: number;
  splitMap: { userId: string; amountMinorUnits: number }[];
}): { userId: string; amountMinorUnits: number }[] {
  const { amountMinorUnits, baseCurrencyAmount, splitMap } = expense;
  if (splitMap.length === 0) return [];
  if (amountMinorUnits === baseCurrencyAmount) return splitMap;
  if (amountMinorUnits <= 0) {
    return splitMap.map((s) => ({ ...s, amountMinorUnits: 0 }));
  }

  const total = BigInt(amountMinorUnits);
  const converted = BigInt(baseCurrencyAmount);

  const shares = splitMap.map((split) => {
    const numerator = BigInt(split.amountMinorUnits) * converted;
    return {
      userId: split.userId,
      floor: numerator / total,
      remainder: numerator % total,
    };
  });

  let leftover =
    converted - shares.reduce((sum, s) => sum + s.floor, 0n);

  // Hand the leftover minor units to the largest fractional remainders first.
  const order = shares
    .map((s, i) => ({ i, remainder: s.remainder }))
    .sort((a, b) => (b.remainder > a.remainder ? 1 : b.remainder < a.remainder ? -1 : 0));

  const bonus = new Array<bigint>(shares.length).fill(0n);
  for (const { i } of order) {
    if (leftover <= 0n) break;
    bonus[i] = 1n;
    leftover -= 1n;
  }

  return shares.map((s, i) => ({
    userId: s.userId,
    amountMinorUnits: Number(s.floor + bonus[i]),
  }));
}
