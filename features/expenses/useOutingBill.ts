"use client";

import { useExpenseStore, useHomeCurrency } from "@/store";

/** Bill handed off from the enter-amount keypad. Falls back to the Figma total. */
export function useOutingBill() {
  const prefill = useExpenseStore((s) => s.prefill);
  const homeCurrency = useHomeCurrency();

  const currency = (prefill?.currency || homeCurrency || "NGN").toUpperCase();
  const amount =
    prefill?.totalAmount && prefill.totalAmount > 0
      ? prefill.totalAmount
      : 20000;

  return { amount, currency };
}
