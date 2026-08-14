import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Auth is open (mock) until backend endpoints ship — no Supabase gate. */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/onboarding/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password/:path*",
    "/join/:path*",
    "/dashboard/:path*",
    "/trips/:path*",
    "/add/:path*",
    "/balances/:path*",
    "/profile/:path*",
    "/notifications/:path*",
  ],
};
