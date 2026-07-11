import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { cn } from "@/lib/utils";

interface BalancePillProps {
  label: string;
  amountMinorUnits: number;
  currency: string;
  variant?: "credit" | "debt" | "neutral";
  className?: string;
}

export function BalancePill({
  label,
  amountMinorUnits,
  currency,
  variant = "neutral",
  className,
}: BalancePillProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-card border px-4 py-3",
        variant === "credit" &&
          "border-semantic-green/20 bg-semantic-green/5",
        variant === "debt" &&
          "border-semantic-rose/20 bg-semantic-rose/5",
        variant === "neutral" &&
          "border-border-glass bg-background-card",
        className
      )}
    >
      <span className="text-sm text-text-secondary">{label}</span>
      <CurrencyDisplay
        amountMinorUnits={amountMinorUnits}
        currency={currency}
        showSign
        size="sm"
      />
    </div>
  );
}
