export interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

/** Pinned at top of currency picker */
export const COMMON_CURRENCY_CODES = ["NGN", "USD", "EUR", "GBP"] as const;

/**
 * Map ISO 4217 currency → ISO 3166-1 region used for flag emoji.
 * Multi-country / special currencies get a representative region (or null → 💱).
 */
const CURRENCY_REGION: Record<string, string | null> = {
  AED: "AE",
  AFN: "AF",
  ALL: "AL",
  AMD: "AM",
  ANG: "CW",
  AOA: "AO",
  ARS: "AR",
  AUD: "AU",
  AWG: "AW",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  BTN: "BT",
  BWP: "BW",
  BYN: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  EGP: "EG",
  ERN: "ER",
  ETB: "ET",
  EUR: "EU",
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRU: "MR",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  NGN: "NG",
  NIO: "NI",
  NOK: "NO",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SHP: "SH",
  SLE: "SL",
  SOS: "SO",
  SRD: "SR",
  SSP: "SS",
  STN: "ST",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VES: "VE",
  VND: "VN",
  VUV: "VU",
  WST: "WS",
  XAF: "CM",
  XCD: "AG",
  XOF: "SN",
  XPF: "PF",
  YER: "YE",
  ZAR: "ZA",
  ZMW: "ZM",
  ZWG: "ZW",
};

function regionToFlag(region: string | null | undefined): string {
  if (!region) return "💱";
  if (region === "EU") return "🇪🇺";
  const upper = region.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "💱";
  return String.fromCodePoint(
    127397 + upper.charCodeAt(0),
    127397 + upper.charCodeAt(1)
  );
}

function buildAllCurrencies(): CurrencyOption[] {
  const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
  // Full ISO 4217 set available in modern runtimes (Node 20+, Chromium, Safari).
  const codes =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("currency")
      : Object.keys(CURRENCY_REGION);

  return codes
    .filter((code) => /^[A-Z]{3}$/.test(code))
    .map((code) => ({
      code,
      name: displayNames.of(code) ?? code,
      flag: regionToFlag(CURRENCY_REGION[code] ?? null),
    }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

/** Full ISO 4217 currency list (150+). Do not slice or truncate. */
export const ALL_CURRENCIES: CurrencyOption[] = buildAllCurrencies();

export const COMMON_CURRENCIES = COMMON_CURRENCY_CODES.map(
  (code) =>
    ALL_CURRENCIES.find((c) => c.code === code) ?? {
      code,
      name: code,
      flag: regionToFlag(CURRENCY_REGION[code] ?? null),
    }
);

export function getCurrencyByCode(code: string): CurrencyOption | undefined {
  return ALL_CURRENCIES.find((c) => c.code === code.toUpperCase());
}

export function isValidCurrencyCode(code: string): boolean {
  return ALL_CURRENCIES.some((c) => c.code === code.toUpperCase());
}

export function filterCurrencies(query: string): {
  common: CurrencyOption[];
  all: CurrencyOption[];
} {
  const q = query.trim().toLowerCase();
  const matches = (c: CurrencyOption) =>
    !q ||
    c.code.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q);

  // Keep the full list — only apply search filtering, never a hard size cap.
  return {
    common: COMMON_CURRENCIES.filter(matches),
    all: ALL_CURRENCIES.filter(matches),
  };
}

const CURRENCY_DECIMALS: Record<string, number> = {
  BHD: 3,
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  IQD: 3,
  ISK: 0,
  JOD: 3,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  KWD: 3,
  LYD: 3,
  OMR: 3,
  PYG: 0,
  RWF: 0,
  TND: 3,
  UGX: 0,
  UYI: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  AED: "د.إ",
  JPY: "¥",
  INR: "₹",
  CAD: "C$",
  AUD: "A$",
  CHF: "Fr",
  CNY: "¥",
  ZAR: "R",
  GHS: "GH₵",
  KES: "KSh",
};

export function getCurrencyDecimals(currency: string): number {
  return CURRENCY_DECIMALS[currency.toUpperCase()] ?? 2;
}

/** Alias matching product spec naming. */
export function getCurrencyPrecision(currency: string): number {
  return getCurrencyDecimals(currency);
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] ?? currency.toUpperCase();
}

export function hasValidDecimalPlaces(
  amountStr: string,
  currency: string
): boolean {
  const precision = getCurrencyPrecision(currency);
  if (!amountStr || amountStr === "0") return true;
  const parts = amountStr.replace(/,/g, "").split(".");
  if (parts.length === 1) return true;
  return parts[1].length <= precision;
}

export function getDecimalPlacesError(currency: string): string {
  const precision = getCurrencyPrecision(currency);
  if (precision === 0) {
    return `${currency.toUpperCase()} doesn't use decimal places`;
  }
  return `Enter up to ${precision} decimal place${precision === 1 ? "" : "s"}`;
}

export function parseAmountToMinorUnits(
  amountStr: string,
  currency: string
): number {
  const cleaned = amountStr.replace(/,/g, "").trim();
  if (!cleaned || cleaned === ".") return 0;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return 0;
  return toMinorUnits(value, currency);
}

export function formatAmountInputDisplay(
  amountStr: string,
  currency: string
): string {
  const precision = getCurrencyPrecision(currency);
  const cleaned = amountStr.replace(/,/g, "");
  if (!cleaned || cleaned === ".") return "0";
  const [whole, frac] = cleaned.split(".");
  const formattedWhole = Number(whole || 0).toLocaleString("en-US");
  if (frac !== undefined) {
    return `${formattedWhole}.${frac}`;
  }
  return formattedWhole;
}

export function toMinorUnits(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return Math.round(amount * Math.pow(10, decimals));
}

export function fromMinorUnits(minorUnits: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return minorUnits / Math.pow(10, decimals);
}

export function formatCurrency(
  minorUnits: number,
  currency: string,
  options?: { showSymbol?: boolean; compact?: boolean }
): string {
  const { showSymbol = true, compact = false } = options ?? {};
  const amount = fromMinorUnits(minorUnits, currency);
  const decimals = getCurrencyDecimals(currency);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact && Math.abs(amount) >= 10000 ? "compact" : "standard",
  }).format(amount);

  if (!showSymbol) return formatted;

  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()];
  if (symbol) return `${symbol}${formatted}`;

  return `${currency.toUpperCase()} ${formatted}`;
}

/** @deprecated use ALL_CURRENCIES */
export const SUPPORTED_CURRENCIES = ALL_CURRENCIES;
