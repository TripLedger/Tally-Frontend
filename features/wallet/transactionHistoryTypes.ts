import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft,
  Bed,
  Car,
  MoreHorizontal,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";

/** Expense categories + income (settlements / refunds / transfers in). */
export type TransactionCategory =
  | "food"
  | "transport"
  | "lodging"
  | "activities"
  | "income"
  | "other";

export type TransactionStatus = "completed" | "pending" | "failed";

export type CategoryFilter = "all" | TransactionCategory;
export type StatusFilter = "all" | TransactionStatus;

export interface WalletTransaction {
  id: string;
  title: string;
  tripName: string;
  /** ISO timestamp */
  occurredAt: string;
  /** Signed minor units — positive = in, negative = out */
  amountMinor: number;
  currency: string;
  category: TransactionCategory;
  status: TransactionStatus;
}

export interface TransactionCategoryOption {
  id: CategoryFilter;
  label: string;
  icon?: LucideIcon;
  color?: string;
}

export const TRANSACTION_CATEGORY_OPTIONS: TransactionCategoryOption[] = [
  { id: "all", label: "All categories" },
  { id: "food", label: "Food", icon: UtensilsCrossed, color: "#F59E0B" },
  { id: "transport", label: "Transport", icon: Car, color: "#EAB308" },
  {
    id: "activities",
    label: "Activities",
    icon: Ticket,
    color: "#06B6D4",
  },
  { id: "lodging", label: "Lodging", icon: Bed, color: "#5921B5" },
  {
    id: "income",
    label: "Income",
    icon: ArrowDownLeft,
    color: "#10B981",
  },
  { id: "other", label: "Other", icon: MoreHorizontal, color: "#94A3B8" },
];

export const TRANSACTION_STATUS_OPTIONS: {
  id: StatusFilter;
  label: string;
}[] = [
  { id: "all", label: "All statuses" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
];

export function getTransactionCategoryOption(
  category: TransactionCategory
): TransactionCategoryOption {
  return (
    TRANSACTION_CATEGORY_OPTIONS.find((c) => c.id === category) ??
    TRANSACTION_CATEGORY_OPTIONS.find((c) => c.id === "other")!
  );
}
