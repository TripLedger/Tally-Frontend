import type { AuthUser } from "@/store/authStore";

const STORAGE_KEY = "tabr_mock_user";

export function readMockUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function writeMockUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearMockUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Open auth — any email works until real endpoints ship. */
export function mockSignIn(email = "demo@tabr.app"): AuthUser {
  const existing = readMockUser();
  const user: AuthUser = existing ?? {
    id: `mock-${Date.now()}`,
    email,
    displayName: "",
    homeCurrency: "NGN",
    onboardingComplete: false,
  };

  writeMockUser(user);
  return user;
}

export function mockSignOut(): void {
  clearMockUser();
}
