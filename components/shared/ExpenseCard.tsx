import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Badge } from "@/components/ui/Badge";
import type { Expense } from "@/types";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  expense: Expense;
  payerName: string;
  baseCurrency: string;
  className?: string;
}

const categoryLabels: Record<NonNullable<Expense["category"]>, string> = {
  food: "Food",
  transport: "Transport",
  lodging: "Lodging",
  activities: "Activities",
  other: "Other",
};

export function ExpenseCard({
  expense,
  payerName,
  baseCurrency,
  className,
}: ExpenseCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-glass bg-background-card p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-text-primary">
            {expense.merchant ?? expense.note ?? "Expense"}
          </p>
          <p className="mt-0.5 text-sm text-text-secondary">
            Paid by {payerName}
          </p>
        </div>
        <CurrencyDisplay
          amountMinorUnits={expense.baseCurrencyAmount}
          currency={baseCurrency}
          originalAmountMinorUnits={
            expense.currency !== baseCurrency
              ? expense.amountMinorUnits
              : undefined
          }
          originalCurrency={
            expense.currency !== baseCurrency ? expense.currency : undefined
          }
          size="md"
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        {expense.category && (
          <Badge>{categoryLabels[expense.category]}</Badge>
        )}
        {expense.ocrSource && (
          <Badge variant="violet">Scanned</Badge>
        )}
        {expense.fxCached && (
          <Badge variant="default">Cached rate</Badge>
        )}
      </div>
    </div>
  );
}
