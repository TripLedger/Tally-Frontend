import { getCurrencySymbol } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface BillAmountCardProps {
  currency: string;
  /** Major-unit total. Ignored when `display` is set. */
  amount?: number;
  /** Preformatted amount, e.g. keypad output. */
  display?: string;
  className?: string;
}

/**
 * “Your bill” card shared by enter-amount, split choices, and split complete.
 */
export function BillAmountCard({
  currency,
  amount = 0,
  display,
  className,
}: BillAmountCardProps) {
  const symbol = getCurrencySymbol(currency);
  const displayAmount =
    display ?? Math.round(amount).toLocaleString("en-US");

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[20px]",
        "bg-gradient-to-b from-[#EFE8FF] via-[#F7F3FF] to-white",
        "px-5 py-7",
        "shadow-[0_2px_16px_rgba(21,19,26,0.05)]",
        className
      )}
    >

      <p className="relative text-center text-tabr-ink-paragraph-small">
        Your bill
      </p>

      <p
        className="relative mt-3 flex items-baseline justify-center gap-1.5 text-[#15131A]"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-[28px] font-semibold leading-none tracking-[-0.02em]">
          {symbol}
        </span>
        <span className="text-[40px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
          {displayAmount}
        </span>
      </p>

      <p className="relative mt-3 text-center text-tabr-ink-paragraph-small">
        Amount in total
      </p>
    </div>
  );
}
