"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Delete } from "lucide-react";
import {
  AuthBackButton,
  AuthStackHeader,
  authStackCtaClass,
} from "@/features/auth";
import {
  formatAmountInputDisplay,
  getCurrencySymbol,
  parseAmountToMinorUnits,
} from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useExpenseStore, useHomeCurrency } from "@/store";

const geistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

const MAX_DIGITS = 9;

const KEYPAD_ROWS: Array<
  Array<{ digit: string; letters?: string } | "empty" | "backspace">
> = [
  [
    { digit: "1" },
    { digit: "2", letters: "ABC" },
    { digit: "3", letters: "DEF" },
  ],
  [
    { digit: "4", letters: "GHI" },
    { digit: "5", letters: "JKL" },
    { digit: "6", letters: "MNO" },
  ],
  [
    { digit: "7", letters: "PQRS" },
    { digit: "8", letters: "TUV" },
    { digit: "9", letters: "WXYZ" },
  ],
  ["empty", { digit: "0" }, "backspace"],
];

interface EnterAmountScreenProps {
  groupId: string;
  outingId: string;
}

/**
 * Outing flow — Enter amount (Figma).
 * Custom keypad → Continue stores major amount for the next split step.
 */
export function EnterAmountScreen({
  groupId,
  outingId,
}: EnterAmountScreenProps) {
  const router = useRouter();
  const homeCurrency = useHomeCurrency();
  const setPrefillData = useExpenseStore((s) => s.setPrefillData);

  const currency = (homeCurrency || "NGN").toUpperCase();
  const symbol = getCurrencySymbol(currency);

  const [digits, setDigits] = useState("");

  const backHref = `/trips/${groupId}/outings/${outingId}/expenses`;
  const amountMinor = parseAmountToMinorUnits(digits || "0", currency);
  const canContinue = amountMinor > 0;

  const displayAmount = formatAmountInputDisplay(digits || "0", currency);

  const appendDigit = useCallback((digit: string) => {
    setDigits((prev) => {
      if (prev === "0") return digit === "0" ? prev : digit;
      if (prev.length >= MAX_DIGITS) return prev;
      return `${prev}${digit}`;
    });
  }, []);

  const backspace = useCallback(() => {
    setDigits((prev) => prev.slice(0, -1));
  }, []);

  const onContinue = () => {
    if (!canContinue) return;

    const major = Number(digits.replace(/,/g, ""));
    setPrefillData({
      totalAmount: Number.isFinite(major) ? major : null,
      currency,
      category: null,
      merchantName: null,
      receiptImageUrl: null,
      failed: false,
    });

    router.push(
      `/trips/${groupId}/expenses/new?outingId=${encodeURIComponent(outingId)}`
    );
  };

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(1.25rem,var(--safe-bottom))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href={backHref} label="Back to add expense" />
      </div>

      <AuthStackHeader
        title="Enter amount"
        subtitle="Enter total amount"
      />

      <div
        className={cn(
          "relative mt-8 w-full overflow-hidden rounded-[20px] bg-white",
          "px-5 py-7",
          "shadow-[0_2px_16px_rgba(21,19,26,0.06)]"
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.14)_0%,transparent_70%)]"
          aria-hidden
        />

        <p className="relative text-center text-[13px] font-normal leading-4 text-[#8E8E93]">
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

        <p className="relative mt-3 text-center text-[13px] font-normal leading-4 text-[#8E8E93]">
          Amount in total
        </p>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col justify-end gap-6 pb-1">
        <AmountKeypad
          onDigit={appendDigit}
          onBackspace={backspace}
        />

        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className={cn("w-full shrink-0", authStackCtaClass(canContinue), focusRing)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function AmountKeypad({
  onDigit,
  onBackspace,
}: {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[360px] grid-cols-3 gap-2.5" role="group" aria-label="Amount keypad">
      {KEYPAD_ROWS.flatMap((row, rowIndex) =>
        row.map((key, colIndex) => {
          const id = `${rowIndex}-${colIndex}`;

          if (key === "empty") {
            return <div key={id} className="h-[58px]" aria-hidden />;
          }

          if (key === "backspace") {
            return (
              <button
                key={id}
                type="button"
                aria-label="Delete"
                onClick={onBackspace}
                className={cn(keyClass, focusRing)}
              >
                <Delete className="h-6 w-6 text-[#15131A]" strokeWidth={1.75} />
              </button>
            );
          }

          return (
            <button
              key={id}
              type="button"
              aria-label={key.digit}
              onClick={() => onDigit(key.digit)}
              className={cn(keyClass, focusRing)}
            >
              <span className="text-[22px] font-semibold leading-none text-[#15131A]">
                {key.digit}
              </span>
              {key.letters ? (
                <span className="mt-0.5 text-[9px] font-medium uppercase leading-none tracking-[0.08em] text-[#15131A]">
                  {key.letters}
                </span>
              ) : null}
            </button>
          );
        })
      )}
    </div>
  );
}

const keyClass = cn(
  "flex h-[58px] w-full flex-col items-center justify-center",
  "rounded-[12px] border border-[#EBEBEB] bg-white",
  "transition-[transform,background-color] duration-100",
  "active:scale-[0.97] active:bg-[#F5F5F5]"
);
