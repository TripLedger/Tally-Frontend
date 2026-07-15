import { NextResponse } from "next/server";
import { toMinorUnits } from "@/lib/currency";

const API_TIMEOUT_MS = 8000;
const VALID_CATEGORIES = [
  "food",
  "transport",
  "lodging",
  "activities",
  "other",
] as const;

const SYSTEM_PROMPT = `You are a receipt parser. Extract all line items from the receipt image provided.
Return ONLY valid JSON with no preamble, no markdown, no explanation:
{
  "merchantName": string | null,
  "total": number | null,
  "currency": string | null,
  "confidence": "high" | "low",
  "suggestedCategory": "food" | "transport" | "lodging" | "activities" | "other" | null,
  "lineItems": [{ "name": string, "quantity": number, "unitPrice": number, "lineTotal": number }]
}
Rules:
- lineItems must always be an array, never null. If no items found, return [].
- All monetary values are raw decimals (e.g. 4500 not "₦4,500").
- total is the grand total actually paid (after tax/tip), as a decimal. Null if unreadable.
- currency is the ISO 4217 code inferred from symbols or text (e.g. "$" → "USD", "₦" → "NGN", "€" → "EUR"). Null if you cannot tell.
- merchantName is the business name printed on the receipt, cleaned up. Null if unreadable.
- suggestedCategory: restaurants/cafés/groceries → "food"; taxis/fuel/parking/transit → "transport"; hotels → "lodging"; tours/tickets/events → "activities"; anything else → "other". Null if unclear.
- If the image is blurry, rotated, or unreadable, return confidence: "low" and empty lineItems.
- Never invent line items not visible on the receipt.
- confidence: "high" only if you clearly read a total or line items from an actual receipt.`;

export interface ScanLineItemExtraction {
  name: string;
  quantity: number;
  /** Minor units of currency. */
  unitPrice: number;
  /** Minor units of currency. */
  lineTotal: number;
}

export interface ScanExtractionResponse {
  merchantName: string | null;
  /** Grand total in minor units, or null. */
  total: number | null;
  currency: string | null;
  confidence: "high" | "low";
  suggestedCategory: string | null;
  lineItems: ScanLineItemExtraction[];
  /** True when Claude returned a total but no line items — skip item assignment. */
  singleAmountOnly: boolean;
}

function emptyExtraction(): ScanExtractionResponse {
  return {
    merchantName: null,
    total: null,
    currency: null,
    confidence: "low",
    suggestedCategory: null,
    lineItems: [],
    singleAmountOnly: false,
  };
}

function parseLineItems(
  raw: unknown,
  currency: string
): ScanLineItemExtraction[] {
  if (!Array.isArray(raw)) return [];

  const items: ScanLineItemExtraction[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const obj = entry as Record<string, unknown>;
    const name =
      typeof obj.name === "string" && obj.name.trim()
        ? obj.name.trim().slice(0, 120)
        : null;
    if (!name) continue;

    const quantity =
      typeof obj.quantity === "number" &&
      Number.isFinite(obj.quantity) &&
      obj.quantity > 0
        ? Math.max(1, Math.round(obj.quantity))
        : 1;

    const lineTotalRaw =
      typeof obj.lineTotal === "number" && Number.isFinite(obj.lineTotal)
        ? obj.lineTotal
        : typeof obj.unitPrice === "number" && Number.isFinite(obj.unitPrice)
          ? obj.unitPrice * quantity
          : null;
    if (lineTotalRaw === null || lineTotalRaw <= 0) continue;

    const unitPriceRaw =
      typeof obj.unitPrice === "number" &&
      Number.isFinite(obj.unitPrice) &&
      obj.unitPrice > 0
        ? obj.unitPrice
        : lineTotalRaw / quantity;

    items.push({
      name,
      quantity,
      unitPrice: toMinorUnits(unitPriceRaw, currency),
      lineTotal: toMinorUnits(lineTotalRaw, currency),
    });
  }
  return items;
}

function parseExtraction(text: string): ScanExtractionResponse {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return emptyExtraction();

  let raw: unknown;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    return emptyExtraction();
  }
  if (!raw || typeof raw !== "object") return emptyExtraction();

  const obj = raw as Record<string, unknown>;

  const currency =
    typeof obj.currency === "string" && /^[A-Za-z]{3}$/.test(obj.currency.trim())
      ? obj.currency.trim().toUpperCase()
      : "USD";

  const totalMajor =
    typeof obj.total === "number" &&
    Number.isFinite(obj.total) &&
    obj.total > 0
      ? obj.total
      : typeof obj.totalAmount === "number" &&
          Number.isFinite(obj.totalAmount) &&
          obj.totalAmount > 0
        ? obj.totalAmount
        : null;

  const merchantName =
    typeof obj.merchantName === "string" && obj.merchantName.trim()
      ? obj.merchantName.trim().slice(0, 80)
      : null;

  const suggestedCategory = (VALID_CATEGORIES as readonly string[]).includes(
    String(obj.suggestedCategory)
  )
    ? String(obj.suggestedCategory)
    : null;

  const lineItems = parseLineItems(obj.lineItems, currency);

  const total =
    totalMajor !== null
      ? toMinorUnits(totalMajor, currency)
      : lineItems.length > 0
        ? lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
        : null;

  const hasReadableData = total !== null || lineItems.length > 0;
  const confidence: "high" | "low" =
    obj.confidence === "high" && hasReadableData ? "high" : "low";

  const singleAmountOnly = lineItems.length === 0 && total !== null;

  return {
    merchantName,
    total,
    currency: typeof obj.currency === "string" ? currency : null,
    confidence,
    suggestedCategory,
    lineItems,
    singleAmountOnly,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }

  let image: string | null = null;
  let mediaType = "image/jpeg";
  try {
    const body = await request.json();
    if (typeof body?.image === "string" && body.image.length > 0) {
      image = body.image;
    }
    if (typeof body?.mediaType === "string") {
      mediaType = body.mediaType;
    }
  } catch {
    return NextResponse.json({
      ok: true,
      extraction: emptyExtraction(),
    });
  }
  if (!image) {
    return NextResponse.json({
      ok: true,
      extraction: emptyExtraction(),
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: image },
              },
              {
                type: "text",
                text: "Extract all line items from this receipt. Respond with only the JSON object.",
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      return NextResponse.json({
        ok: true,
        extraction: emptyExtraction(),
      });
    }

    const data = await response.json();
    const textBlock = Array.isArray(data?.content)
      ? data.content.find((b: { type: string }) => b.type === "text")
      : null;
    const extraction = parseExtraction(textBlock?.text ?? "");

    return NextResponse.json({ ok: true, extraction });
  } catch (err) {
    console.error("Receipt scan failed:", err);
    return NextResponse.json({
      ok: true,
      extraction: emptyExtraction(),
    });
  } finally {
    clearTimeout(timeout);
  }
}
