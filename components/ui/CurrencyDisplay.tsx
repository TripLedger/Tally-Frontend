import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amountMinorUnits: number;
  currency: string;
  originalAmountMinorUnits?: number;
  originalCurrency?: string;
  size?: "sm" | "md" | "lg";
  showSign?: boolean;
  className?: string;
}

export function CurrencyDisplay({
  amountMinorUnits,
  currency,
  originalAmountMinorUnits,
  originalCurrency,
  size = "md",
  showSign = false,
  className,
}: CurrencyDisplayProps) {
  const formatted = formatCurrency(Math.abs(amountMinorUnits), currency);
  const sign =
    showSign && amountMinorUnits !== 0
      ? amountMinorUnits > 0
        ? "+"
        : "−"
      : "";

  const showOriginal =
    originalCurrency &&
    originalAmountMinorUnits !== undefined &&
    originalCurrency !== currency;

  return (
    <span
      className={cn(
        "tabular-nums font-feature-settings-tnum",
        size === "sm" && "text-sm",
        size === "md" && "text-base font-semibold",
        size === "lg" && "text-2xl font-bold tracking-tight",
        amountMinorUnits > 0 && showSign && "text-semantic-green",
        amountMinorUnits < 0 && showSign && "text-semantic-rose",
        className
      )}
      style={{ fontFeatureSettings: '"tnum"' }}
    >
      {sign}
      {formatted}
      {showOriginal && (
        <span className="ml-1.5 text-sm font-normal text-text-secondary">
          (
          {formatCurrency(
            originalAmountMinorUnits,
            originalCurrency
          )}
          )
        </span>
      )}
    </span>
  );
}
