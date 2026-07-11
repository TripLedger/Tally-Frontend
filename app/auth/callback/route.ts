import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isOnboardingComplete } from "@/lib/supabase/profile";

const PENDING_INVITE_KEY = "tally_pending_invite";

function readPendingInviteCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split("; ")
    .find((row) => row.startsWith(`${PENDING_INVITE_KEY}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

/**
 * OAuth (Google) + PKCE magic-link callback.
 * Handles the `?code=` code-exchange flow, and also falls back to the
 * `?token_hash=` verification flow so any Supabase email template works.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");
  const errorDescription = searchParams.get("error_description");

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/?error=oauth&reason=${encodeURIComponent(errorDescription)}`
    );
  }

  const supabase = createClient();
  let exchanged = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    exchanged = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    exchanged = !error;
  }

  if (!exchanged) {
    return NextResponse.redirect(`${origin}/?error=magic_link`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pendingInvite = readPendingInviteCookie(request);

  let destination =
    next ??
    (user && isOnboardingComplete(user) ? "/dashboard" : "/onboarding");

  if (pendingInvite && user && isOnboardingComplete(user)) {
    destination = `/join/${pendingInvite}`;
  }

  return NextResponse.redirect(`${origin}${destination}`);
}
