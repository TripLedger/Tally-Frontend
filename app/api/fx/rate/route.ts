import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FxUnavailableError, getExchangeRate } from "@/lib/fx";
import { isValidCurrencyCode } from "@/lib/currency";

/**
 * POST /api/fx/rate — { from: "AED", to: "NGN" }
 *
 * Server-side FX resolution for expense creation. Keeps provider keys off the
 * client and funnels every conversion through the live-fetch → cache-fallback
 * policy in lib/fx.ts. Requires an authenticated Supabase session (the same
 * session RLS uses for the fx_rates cache table).
 */
export async function POST(request: Request) {
  let from: string | undefined;
  let to: string | undefined;
  try {
    const body = await request.json();
    if (typeof body?.from === "string") from = body.from.toUpperCase();
    if (typeof body?.to === "string") to = body.to.toUpperCase();
  } catch {
    // fall through to validation below
  }

  if (!from || !to || !isValidCurrencyCode(from) || !isValidCurrencyCode(to)) {
    return NextResponse.json(
      { ok: false, reason: "invalid_pair" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, reason: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await getExchangeRate(supabase, from, to);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof FxUnavailableError) {
      return NextResponse.json(
        { ok: false, reason: "rate_unavailable" },
        { status: 503 }
      );
    }
    console.error("FX rate route failed:", error);
    return NextResponse.json(
      { ok: false, reason: "unknown" },
      { status: 500 }
    );
  }
}
