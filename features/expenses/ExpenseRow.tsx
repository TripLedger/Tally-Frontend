import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  EXPENSE_CATEGORIES,
  getCategoryConfig,
} from "@/features/expenses/categoryConfig";
import type { Expense } from "@/types";

interface ExpenseRowProps {
  expense: Expense;
  tripId: string;
  payerName: string;
  baseCurrency: string;
  isEntering?: boolean;
  showDivider?: boolean;
}

function CategorySwatch({ category }: { category: Expense["category"] }) {
  const config =
    getCategoryConfig(category) ??
    EXPENSE_CATEGORIES.find((c) => c.id === "other")!;
  const Icon = config.icon;

  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
      style={{ backgroundColor: `${config.color}26` }}
    >
      <Icon
        className="h-[18px] w-[18px]"
        style={{ color: config.color }}
        strokeWidth={2}
      />
    </div>
  );
}

export function ExpenseRow({
  expense,
  tripId,
  payerName,
  baseCurrency,
  isEntering = false,
  showDivider = true,
}: ExpenseRowProps) {
  const description =
    expense.note?.trim() || `${payerName.split(" ")[0]} paid`;
  const showBaseConversion = expense.currency !== baseCurrency;

  return (
    <div
      className={cn(
        isEntering && "animate-expense-row-enter",
        showDivider && "border-b border-[#ffffff0f]"
      )}
    >
      <Link
        href={`/trips/${tripId}/expenses/${expense.id}`}
        className={cn(
          "flex h-[72px] items-center gap-3",
          "transition-colors duration-fast ease-tally active:bg-[#ffffff05]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
        )}
      >
        <CategorySwatch category={expense.category} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-[#F8F8FF]">
            {description}
          </p>
          <p
            className="mt-0.5 text-[13px] font-normal text-[#94A3B8] tabular-nums"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {formatRelativeTime(expense.createdAt)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className="text-[16px] font-semibold text-[#F8F8FF] tabular-nums"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {formatCurrency(expense.amountMinorUnits, expense.currency)}
          </p>
          {showBaseConversion && (
            <p
              className="mt-0.5 text-[12px] font-normal text-[#94A3B8] tabular-nums"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              ({formatCurrency(expense.baseCurrencyAmount, baseCurrency)})
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
