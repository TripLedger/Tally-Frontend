"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, List, Users } from "lucide-react";
import { formatCurrency, fromMinorUnits } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  useCloseBottomSheet,
  useExpenseStore,
  type ScanResult,
} from "@/store";

interface SplitModeDecisionSheetProps {
  tripId: string;
  scan: ScanResult;
  /** Called before navigation so the scan page can ignore backdrop dismiss. */
  onChose?: () => void;
}

const rowClasses = cn(
  "relative flex h-[72px] w-full items-center gap-3 rounded-[16px] px-4 text-left",
  "border border-[#ffffff0f] bg-[#13131A]",
  "shadow-[inset_0_1px_0_#ffffff0a]",
  "transition-all duration-fast ease-tally",
  "active:scale-[0.98] active:bg-[#1C1C27]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]"
);

export function SplitModeDecisionSheet({
  tripId,
  scan,
  onChose,
}: SplitModeDecisionSheetProps) {
  const router = useRouter();
  const closeBottomSheet = useCloseBottomSheet();
  const setPrefillData = useExpenseStore((s) => s.setPrefillData);
  const clearScanState = useExpenseStore((s) => s.clearScanState);

  const currency = scan.currency ?? "USD";
  const total = scan.total ?? 0;
  const itemCount = scan.lineItems.length;
  const title = scan.merchantName?.trim() || "Your receipt";
  const totalLabel = formatCurrency(total, currency);

  const finishAndGo = (path: string) => {
    onChose?.();
    closeBottomSheet();
    router.replace(path);
  };

  const handleAssignByItem = () => {
    finishAndGo(`/trips/${tripId}/expenses/assign`);
  };

  const handleSplitEqually = () => {
    // Prefill still uses major-unit totals (Add Expense form contract).
    setPrefillData({
      totalAmount: total > 0 ? fromMinorUnits(total, currency) : null,
      currency: scan.currency,
      category: scan.category,
      merchantName: scan.merchantName,
      receiptImageUrl: scan.receiptImageUrl,
      failed: false,
    });
    clearScanState();
    finishAndGo(`/trips/${tripId}/expenses/new`);
  };

  return (
    <div className="flex flex-col pt-5">
      <div className="text-center">
        <h2 className="text-[17px] font-bold leading-snug tracking-[-0.01em] text-[#F8F8FF]">
          {title}
        </h2>
        <p className="mt-1 text-[14px] font-normal tabular-nums text-[#94A3B8]">
          {itemCount} {itemCount === 1 ? "item" : "items"} · {totalLabel}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAssignByItem}
          className={rowClasses}
        >
          <span
            className="absolute -top-2 right-3 rounded-full border border-[#7C3AED40] bg-[#7C3AED1a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7C3AED]"
            aria-hidden
          >
            Recommended
          </span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#7C3AED1a]">
            <List className="h-5 w-5 text-[#7C3AED]" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-[#F8F8FF]">
              Assign by item
            </span>
            <span className="mt-0.5 block text-[13px] font-normal text-[#94A3B8]">
              Tag who ordered what
            </span>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-[#475569]"
            strokeWidth={2}
          />
        </button>

        <button
          type="button"
          onClick={handleSplitEqually}
          className={rowClasses}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#1C1C27]">
            <Users className="h-5 w-5 text-[#94A3B8]" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-[#F8F8FF]">
              Split equally
            </span>
            <span className="mt-0.5 block text-[13px] font-normal text-[#94A3B8]">
              Everyone shares the total
            </span>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-[#475569]"
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
}
