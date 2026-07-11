"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
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
}

export function AmountHeroInput({
  currency,
  amountStr,
  onAmountChange,
  onCurrencyClick,
  decimalError,
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
