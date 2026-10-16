"use client";

import { History, Plus } from "lucide-react";
import { fromMinorUnits, getCurrencySymbol } from "@/lib/currency";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function formatHomeBalance(minorUnits: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  const amount = fromMinorUnits(minorUnits, currency);
  const whole = Number.isInteger(amount);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: whole ? 0 : undefined,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

interface HomeTotalBalanceCardProps {
  /** Amount in minor units (kobo / cents). New users default to 0. */
  balanceMinor?: number;
  currency: string;
  onAdd?: () => void;
  onHistory?: () => void;
  className?: string;
}

/**
 * Figma home — Total balance card with Add / History pills over the wallet BG.
 */
export function HomeTotalBalanceCard({
  balanceMinor = 0,
  currency,
  onAdd,
  onHistory,
  className,
}: HomeTotalBalanceCardProps) {
  const actions = [
    { label: "Add", Icon: Plus, onClick: onAdd },
    { label: "History", Icon: History, onClick: onHistory },
  ] as const;

  return (
    <section
      className={cn(
        "relative box-border flex h-[170px] w-full max-w-[358px] flex-col justify-between",
        "overflow-hidden rounded-[24px] p-5",
        className
      )}
      aria-label="Total balance"
    >
      <img
        src="/tabr/home/wallet-bg.svg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        aria-hidden
        draggable={false}
      />

      <div className="relative z-10">
        <p className="text-tabr-ink-paragraph-small">Total balance</p>
        <p
          className="text-tabr-ink-heading-2 mt-1 tabular-nums"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {formatHomeBalance(balanceMinor, currency)}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        {actions.map(({ label, Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={cn(
              "flex min-h-10 flex-1 basis-0 items-center justify-center",
              "gap-2 px-2.5 py-2.5 xs:px-3",
              "rounded-full bg-[#ECECEC]",
              "text-[13px] font-medium leading-4 text-[#15131A]",
              "transition-transform duration-150 active:scale-[0.98]",
              "hover:bg-[#E4E4E4]",
              focusRing
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
