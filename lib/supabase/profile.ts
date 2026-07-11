import type { User } from "@supabase/supabase-js";
import type { AuthUser } from "@/store/authStore";

export interface ProfileMetadata {
  display_name?: string;
  home_currency?: string;
  onboarding_complete?: boolean;
  avatar_url?: string;
}

export function mapSupabaseUser(user: User): AuthUser {
  const meta = (user.user_metadata ?? {}) as ProfileMetadata;
  return {
    id: user.id,
    email: user.email ?? "",
    displayName: meta.display_name ?? "",
    homeCurrency: meta.home_currency ?? "USD",
    avatarUrl: meta.avatar_url,
    onboardingComplete: meta.onboarding_complete === true,
  };
}

export function isOnboardingComplete(user: User): boolean {
  const meta = (user.user_metadata ?? {}) as ProfileMetadata;
  return meta.onboarding_complete === true;
}
