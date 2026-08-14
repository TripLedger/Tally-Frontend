"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  clearMockUser,
  mockSignOut,
  readMockUser,
} from "@/lib/auth/mock-session";
import { useAuthStore } from "@/store/authStore";
import { useBalanceStore } from "@/store/balanceStore";
import { useExpenseStore } from "@/store/expenseStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useSettlementStore } from "@/store/settlementStore";
import { useTripStore } from "@/store/tripStore";

function clearAllAppStores() {
  useAuthStore.getState().clearUser();
  useTripStore.getState().clearTripState();
  useTripStore.getState().clearPendingInvite();
  useExpenseStore.getState().clearExpenses();
  useBalanceStore.getState().clearBalanceState();
  useSettlementStore.getState().clearSettlementState();
  useNotificationStore.getState().clearNotificationState();
}

export function useAuthSession() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const storeStatus = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setStatus("loading");
    const mockUser = readMockUser();
    setUser(mockUser);
  }, [setUser, setStatus]);

  const signOut = async () => {
    mockSignOut();
    clearMockUser();
    clearAllAppStores();
    router.refresh();
    router.push("/onboarding");
  };

  return {
    user,
    status: storeStatus,
    isAuthenticated: storeStatus === "authenticated",
    isLoading: storeStatus === "loading" || storeStatus === "idle",
    signOut,
  };
}

export function AuthSessionHydrator() {
  useAuthSession();
  return null;
}
