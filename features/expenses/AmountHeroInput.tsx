"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, X } from "lucide-react";
import {
  formatAmountInputDisplay,
  getCurrencySymbol,
  hasValidDecimalPlaces,
} from "@/lib/currency";
import { cn } from "@/lib/utils";

interface AmountHeroInputProps {
  currency: string;
  amountStr: string;
  onAmountChange: (value: string) => void;
  onCurrencyClick: () => void;
  decimalError?: string | null;
  /** OCR returned an unrecognized currency — show the review notice. */
  showCurrencyReview?: boolean;
  onDismissCurrencyReview?: () => void;
}

/**
 * Inline notice pinned under the currency pill when the scanned receipt's
 * currency couldn't be matched to a supported code (4.4 edge case). Reuses
 * the tinted-rose treatment from the scan-failure banner, scoped to a small
 * auto-width pill. Dismisses with a 200ms fade.
 */
function CurrencyReviewNotice({ onDismiss }: { onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      role="status"
      className={cn(
        "mt-2 flex items-center rounded-[8px] bg-[#F43F5E1a] py-1.5 pl-[10px] pr-2",
        "transition-opacity duration-[200ms] ease-tally",
        leaving ? "opacity-0" : "opacity-100"
      )}
    >
      <AlertTriangle
        className="h-3 w-3 shrink-0 text-[#F43F5E]"
        strokeWidth={2}
        aria-hidden
      />
      <span className="ml-1.5 text-[12px] font-medium leading-none text-[#F43F5E]">
        Currency unclear — please confirm
      </span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss currency notice"
        className={cn(
          "ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        )}
      >
        <X className="h-2.5 w-2.5 text-[#F43F5E]" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function AmountHeroInput({
  currency,
  amountStr,
  onAmountChange,
  onCurrencyClick,
  decimalError,
  showCurrencyReview = false,
  onDismissCurrencyReview,
}: AmountHeroInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const display =
    amountStr && amountStr !== "0"
      ? formatAmountInputDisplay(amountStr, currency)
      : "0";
  const symbol = getCurrencySymbol(currency);
  const showPlaceholder = !amountStr || amountStr === "0";

  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/,/g, "").replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;

    if (!hasValidDecimalPlaces(normalized, currency)) return;
    onAmountChange(normalized);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onCurrencyClick}
        className={cn(
          "flex items-center gap-1 rounded-pill bg-[#1C1C27] px-[14px] py-1.5",
          "text-[14px] font-semibold text-[#94A3B8]",
          "transition-colors hover:bg-[#252532]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
        )}
      >
        {currency}
        <ChevronDown className="h-3 w-3" />
      </button>

      {showCurrencyReview && onDismissCurrencyReview && (
        <CurrencyReviewNotice onDismiss={onDismissCurrencyReview} />
      )}

      <div
        role="presentation"
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "relative mt-5 flex w-full min-h-[56px] items-baseline justify-center",
          "cursor-text touch-manipulation"
        )}
      >
        <span
          className="pointer-events-none select-none tabular-nums text-[48px] font-bold leading-none text-[#94A3B8]"
          style={{ fontFeatureSettings: '"tnum"' }}
          aria-hidden
        >
          {symbol}
        </span>
        <span
          className={cn(
            "pointer-events-none select-none tabular-nums text-[48px] font-bold leading-none",
            showPlaceholder ? "text-[#475569]" : "text-[#F8F8FF]",
            "min-w-[1ch] text-center"
          )}
          style={{ fontFeatureSettings: '"tnum"' }}
          aria-hidden
        >
          {display}
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={amountStr}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            "absolute inset-0 z-10 w-full cursor-text",
            "bg-transparent text-transparent caret-[#F8F8FF]",
            "border-none outline-none focus:outline-none focus-visible:outline-none",
            "text-[48px] font-bold leading-none"
          )}
          aria-label="Expense amount"
        />
      </div>

      {decimalError && (
        <p className="mt-2 text-[13px] text-[#F43F5E]">{decimalError}</p>
      )}
    </div>
  );
}
