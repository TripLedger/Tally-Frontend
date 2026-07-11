import { create } from "zustand";

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
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  clearUser: () => void;
  completeOnboarding: (displayName: string, homeCurrency: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) =>
    set({
      user,
      status: user ? "authenticated" : "unauthenticated",
    }),
  setStatus: (status) => set({ status }),
  clearUser: () => set({ user: null, status: "unauthenticated" }),
  completeOnboarding: (displayName, homeCurrency) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, displayName, homeCurrency, onboardingComplete: true }
        : null,
    })),
}));

export const useUser = () => useAuthStore((s) => s.user);
export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useIsAuthenticated = () =>
  useAuthStore((s) => s.status === "authenticated");
export const useAuthLoading = () =>
  useAuthStore((s) => s.status === "loading" || s.status === "idle");
export const useHomeCurrency = () =>
  useAuthStore((s) => s.user?.homeCurrency ?? "USD");
