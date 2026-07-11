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
 * Magic-link / OTP verification via token_hash.
 * This flow works even when the link is opened in a new tab or a different
 * browser, because it doesn't depend on a PKCE code verifier being present.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (tokenHash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
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
  }

  return NextResponse.redirect(`${origin}/?error=magic_link`);
}
