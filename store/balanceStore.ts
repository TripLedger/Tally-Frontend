import { create } from "zustand";
import type { Balance, Settlement, SimplifiedPayment } from "@/types";

interface BalanceState {
  balances: Balance[];
  simplifiedPayments: SimplifiedPayment[];
  settlements: Settlement[];
  isLoading: boolean;
  setBalances: (balances: Balance[]) => void;
  setSimplifiedPayments: (payments: SimplifiedPayment[]) => void;
  setSettlements: (settlements: Settlement[]) => void;
  addSettlement: (settlement: Settlement) => void;
  setLoading: (loading: boolean) => void;
  recomputeBalances: (tripId: string) => void;
  clearBalanceState: () => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balances: [],
  simplifiedPayments: [],
  settlements: [],
  isLoading: false,
  setBalances: (balances) => set({ balances }),
  setSimplifiedPayments: (simplifiedPayments) =>
    set({ simplifiedPayments }),
  setSettlements: (settlements) => set({ settlements }),
  addSettlement: (settlement) =>
    set((state) => ({
      settlements: [...state.settlements, settlement],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  recomputeBalances: (tripId: string) => {
    // Stub — balance engine lands in a later feature; call site is wired.
    void tripId;
  },
  clearBalanceState: () =>
    set({
      balances: [],
      simplifiedPayments: [],
      settlements: [],
      isLoading: false,
    }),
}));

export const useBalances = () => useBalanceStore((s) => s.balances);
export const useSimplifiedPayments = () =>
  useBalanceStore((s) => s.simplifiedPayments);
export const useSettlements = () => useBalanceStore((s) => s.settlements);
export const useBalancesLoading = () => useBalanceStore((s) => s.isLoading);
