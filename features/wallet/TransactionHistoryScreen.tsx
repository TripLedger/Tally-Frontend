"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_WALLET_TRANSACTIONS } from "./mockTransactionHistory";
import { TransactionHistoryFilter } from "./TransactionHistoryFilter";
import {
  formatHistorySignedAmount,
  formatHistoryWhen,
} from "./formatHistoryMoney";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
  type CategoryFilter,
  type StatusFilter,
  type WalletTransaction,
} from "./transactionHistoryTypes";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

const LAST_MONTH_KEY = "tabr.wallet.historyMonth";

function monthKeyFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthKeyFromIso(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 7);
  return monthKeyFromDate(date);
}

function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return monthKey;
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function parseMonthKey(monthKey: string): { year: number; monthIndex: number } | null {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return null;
  return { year: y, monthIndex: m - 1 };
}

function readLastMonth(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(LAST_MONTH_KEY);
    return value && /^\d{4}-\d{2}$/.test(value) ? value : null;
  } catch {
    return null;
  }
}

function writeLastMonth(monthKey: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_MONTH_KEY, monthKey);
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Month picker range from real activity only:
 * - newest: current month (or latest transaction month if somehow newer)
 * - oldest: first (earliest) transaction month
 * - no padding into unused years when the user is new
 */
function buildMonthOptions(transactions: WalletTransaction[]): string[] {
  const current = monthKeyFromDate(new Date());
  if (transactions.length === 0) return [current];

  let earliest = monthKeyFromIso(transactions[0].occurredAt);
  let latestTx = earliest;
  for (const tx of transactions) {
    const key = monthKeyFromIso(tx.occurredAt);
    if (key < earliest) earliest = key;
    if (key > latestTx) latestTx = key;
  }

  const newest = latestTx > current ? latestTx : current;
  const start = parseMonthKey(newest);
  const end = parseMonthKey(earliest);
  if (!start || !end) return [current];

  const keys: string[] = [];
  let year = start.year;
  let monthIndex = start.monthIndex;
  while (
    year > end.year ||
    (year === end.year && monthIndex >= end.monthIndex)
  ) {
    keys.push(monthKeyFromDate(new Date(year, monthIndex, 1)));
    monthIndex -= 1;
    if (monthIndex < 0) {
      monthIndex = 11;
      year -= 1;
    }
    // Safety cap — never walk more than ~10 years of history.
    if (keys.length > 120) break;
  }
  return keys;
}

function StatusPill({ status }: { status: WalletTransaction["status"] }) {
  const styles =
    status === "completed"
      ? { label: "Completed", className: "bg-[#ECFDF5] text-[#059669]" }
      : status === "failed"
        ? { label: "Failed", className: "bg-[#FEF2F2] text-[#E11D48]" }
        : { label: "Pending", className: "bg-[#FFF7ED] text-[#EA580C]" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] px-2 py-0.5",
        "text-[11px] font-medium leading-4",
        styles.className
      )}
    >
      {styles.label}
    </span>
  );
}

function TransactionRow({
  tx,
  showDivider,
}: {
  tx: WalletTransaction;
  showDivider: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-4 py-3.5",
        showDivider && "border-b border-[#F0F0F2]"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium leading-5 text-[#15131A]">
          {tx.title}
        </p>
        <p className="mt-1 truncate text-[12px] font-normal leading-4 text-[#8E8E93]">
          {tx.tripName} · {formatHistoryWhen(tx.occurredAt)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <p
          className="text-[15px] font-semibold leading-5 tabular-nums text-[#15131A]"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {formatHistorySignedAmount(tx.amountMinor, tx.currency)}
        </p>
        <StatusPill status={tx.status} />
      </div>
    </div>
  );
}

function MonthPicker({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (monthKey: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(
      '[aria-selected="true"]'
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [open, value]);

  return (
    <div ref={rootRef} className="relative mt-4 inline-flex">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select month"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 text-left",
          "text-[16px] font-semibold leading-6 text-[#15131A]",
          "transition-opacity active:opacity-70",
          focusRing,
          "rounded-md"
        )}
      >
        <span>{formatMonthLabel(value)}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#15131A] transition-transform duration-150",
            open && "rotate-180"
          )}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Months"
          className={cn(
            "absolute left-0 top-[calc(100%+8px)] z-50 min-w-[220px]",
            "max-h-72 overflow-y-auto overscroll-contain",
            "rounded-[16px] border border-[#F0EEF5] bg-white",
            "shadow-[0_12px_32px_rgba(21,19,26,0.14)]"
          )}
        >
          {options.map((monthKey) => {
            const active = monthKey === value;
            return (
              <button
                key={monthKey}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(monthKey);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-4 py-3 text-left text-[14px]",
                  "transition-colors hover:bg-[#F9F7FC]",
                  active
                    ? "font-semibold text-[#5921B5]"
                    : "font-normal text-[#15131A]"
                )}
              >
                {formatMonthLabel(monthKey)}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Transaction History — month picker + category/status filters + single-month card.
 */
export function TransactionHistoryScreen() {
  const router = useRouter();
  const monthOptions = useMemo(
    () => buildMonthOptions(MOCK_WALLET_TRANSACTIONS),
    []
  );

  const [monthKey, setMonthKey] = useState(() => {
    const current = monthKeyFromDate(new Date());
    const monthsWithData = new Set(
      MOCK_WALLET_TRANSACTIONS.map((tx) => monthKeyFromIso(tx.occurredAt))
    );
    const last = readLastMonth();
    const latestTx = [...monthsWithData].sort((a, b) => b.localeCompare(a))[0];

    // Last month the user viewed (if still in their history range).
    if (last && monthOptions.includes(last)) return last;
    // Current month, or the month of their most recent transaction.
    if (monthsWithData.has(current)) return current;
    return latestTx ?? current;
  });

  const [category, setCategory] = useState<CategoryFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [openFilter, setOpenFilter] = useState<"category" | "status" | null>(
    null
  );

  useEffect(() => {
    writeLastMonth(monthKey);
  }, [monthKey]);

  const monthTransactions = useMemo(() => {
    return MOCK_WALLET_TRANSACTIONS.filter((tx) => {
      if (monthKeyFromIso(tx.occurredAt) !== monthKey) return false;
      if (category !== "all" && tx.category !== category) return false;
      if (status !== "all" && tx.status !== status) return false;
      return true;
    }).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [monthKey, category, status]);

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(2rem,calc(var(--safe-bottom)+1.5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          aria-label="Back to home"
          onClick={() => router.push("/dashboard")}
          className={cn(
            "-ml-2 flex h-11 w-11 items-center justify-center",
            "text-[#15131A] transition-transform duration-150 active:scale-95",
            focusRing,
            "rounded-full"
          )}
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">Transaction History</h1>
      <p className="text-tabr-ink-paragraph-small mt-2">
        All your trip money, in one place.
      </p>

      <div className="relative z-20 mt-5 flex items-center gap-2.5">
        <TransactionHistoryFilter
          label="Category"
          options={TRANSACTION_CATEGORY_OPTIONS.map(({ id, label }) => ({
            id,
            label,
          }))}
          value={category}
          open={openFilter === "category"}
          onOpenChange={(open) => setOpenFilter(open ? "category" : null)}
          onChange={(id) => setCategory(id as CategoryFilter)}
          align="left"
        />
        <TransactionHistoryFilter
          label="Status"
          options={TRANSACTION_STATUS_OPTIONS}
          value={status}
          open={openFilter === "status"}
          onOpenChange={(open) => setOpenFilter(open ? "status" : null)}
          onChange={(id) => setStatus(id as StatusFilter)}
          align="right"
        />
      </div>

      <MonthPicker
        value={monthKey}
        options={monthOptions}
        onChange={setMonthKey}
      />

      <div className="mt-5 flex-1">
        {monthTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[20px] bg-white px-6 py-16 text-center shadow-[0_1px_3px_rgba(21,19,26,0.04)]">
            <p className="text-[15px] font-semibold text-[#15131A]">
              No transactions
            </p>
            <p className="mt-1 text-[13px] font-normal text-[#8E8E93]">
              Nothing matches {formatMonthLabel(monthKey)}
              {category !== "all" || status !== "all"
                ? " with these filters"
                : ""}
            </p>
          </div>
        ) : (
          <section
            className={cn(
              "overflow-hidden rounded-[20px] bg-white",
              "shadow-[0_1px_3px_rgba(21,19,26,0.04)]"
            )}
            aria-label={`Transactions for ${formatMonthLabel(monthKey)}`}
          >
            {monthTransactions.map((tx, index) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                showDivider={index < monthTransactions.length - 1}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
