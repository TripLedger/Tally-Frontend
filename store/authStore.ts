import { create } from "zustand";
import { writeMockUser } from "@/lib/auth/mock-session";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  homeCurrency: string;
  avatarUrl?: string;
  onboardingComplete: boolean;
}

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  isUpdatingProfile: boolean;
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  clearUser: () => void;
  completeOnboarding: (displayName: string, homeCurrency: string) => void;
  updateDisplayName: (displayName: string) => Promise<boolean>;
  updateHomeCurrency: (homeCurrency: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  isUpdatingProfile: false,

  setUser: (user) =>
    set({
      user,
      status: user ? "authenticated" : "unauthenticated",
    }),

  setStatus: (status) => set({ status }),

  clearUser: () => set({ user: null, status: "unauthenticated" }),

  completeOnboarding: (displayName, homeCurrency) => {
    const current = get().user;
    const next: AuthUser = current
      ? { ...current, displayName, homeCurrency, onboardingComplete: true }
      : {
          id: `mock-${Date.now()}`,
          email: "demo@tabr.app",
          displayName,
          homeCurrency,
          onboardingComplete: true,
        };

    writeMockUser(next);
    set({ user: next, status: "authenticated" });
  },

  updateDisplayName: async (displayName) => {
    const trimmed = displayName.trim();
    const current = get().user;
    if (!current || trimmed.length < 2) return false;

    set({ isUpdatingProfile: true });
    try {
      const next = { ...current, displayName: trimmed };
      writeMockUser(next);
      set({ user: next });
      return true;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateHomeCurrency: async (homeCurrency) => {
    const code = homeCurrency.trim().toUpperCase();
    const current = get().user;
    if (!current || !code) return false;

    set({ isUpdatingProfile: true });
    try {
      const next = { ...current, homeCurrency: code };
      writeMockUser(next);
      set({ user: next });
      return true;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

export const useUser = () => useAuthStore((s) => s.user);
export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useIsAuthenticated = () =>
  useAuthStore((s) => s.status === "authenticated");
export const useAuthLoading = () =>
  useAuthStore((s) => s.status === "loading" || s.status === "idle");
export const useHomeCurrency = () =>
  useAuthStore((s) => s.user?.homeCurrency ?? "NGN");
export const useIsUpdatingProfile = () =>
  useAuthStore((s) => s.isUpdatingProfile);
