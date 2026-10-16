import { fromMinorUnits, getCurrencySymbol } from "@/lib/currency";

/** Figma history amounts — whole units when exact (₦2,667 not ₦2,667.00). */
export function formatHistoryMoney(
  minorUnits: number,
  currency: string
): string {
  const symbol = getCurrencySymbol(currency);
  const amount = fromMinorUnits(Math.abs(minorUnits), currency);
  const whole = Number.isInteger(amount);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: whole ? 0 : undefined,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

export function formatHistorySignedAmount(
  minorUnits: number,
  currency: string
): string {
  const body = formatHistoryMoney(minorUnits, currency);
  if (minorUnits > 0) return `+${body}`;
  if (minorUnits < 0) return `-${body}`;
  return body;
}

export function formatHistoryWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const monthDay = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${monthDay}, ${time}`;
}

export function formatHistoryMonthKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}
