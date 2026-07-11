import type { ExpenseCategory } from "@/types";
import {
  Bed,
  Car,
  MoreHorizontal,
  Ticket,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
  id: ExpenseCategory;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { id: "food", label: "Food", icon: UtensilsCrossed, color: "#F59E0B" },
  { id: "transport", label: "Transport", icon: Car, color: "#2563EB" },
  { id: "lodging", label: "Lodging", icon: Bed, color: "#7C3AED" },
  { id: "activities", label: "Activities", icon: Ticket, color: "#10B981" },
  { id: "other", label: "Other", icon: MoreHorizontal, color: "#94A3B8" },
];

export function getCategoryConfig(
  category: ExpenseCategory | null | undefined
): CategoryConfig | undefined {
  if (!category) return undefined;
  return EXPENSE_CATEGORIES.find((c) => c.id === category);
}
