"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { LineItemAssignCard } from "@/features/expenses/LineItemAssignCard";
import { LineItemMemberPickerSheet } from "@/features/expenses/LineItemMemberPickerSheet";
import { formatCurrency, isValidCurrencyCode } from "@/lib/currency";
import {
  deriveSplitsFromLineItems,
  isLineItemFullyAssigned,
} from "@/lib/expenses";
import { FxRateUnavailableError, resolveExpenseFx } from "@/lib/fx-client";
import { cn } from "@/lib/utils";
import {
  useAddToast,
  useAuthStore,
  useExpenseStore,
  useOpenBottomSheet,
  useTripMembers,
  useTripStore,
  useUnassignedTotal,
} from "@/store";

interface AssignItemsPageProps {
  params: { tripId: string };
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]";

function useAnimatedMinorUnits(value: number, durationMs = 300) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return display;
}

export default function AssignItemsPage({ params }: AssignItemsPageProps) {
  const { tripId } = params;
  const router = useRouter();
  const addToast = useAddToast();
  const openBottomSheet = useOpenBottomSheet();

  const user = useAuthStore((s) => s.user);
  const trips = useTripStore((s) => s.trips);
  const activeTrip = useTripStore((s) => s.activeTrip);
  const fetchTripDetail = useTripStore((s) => s.fetchTripDetail);
  const trip =
    activeTrip?.id === tripId
      ? activeTrip
      : trips.find((t) => t.id === tripId) ?? null;

  const members = useTripMembers();
  const scanResult = useExpenseStore((s) => s.scanResult);
  const assignedLineItems = useExpenseStore((s) => s.assignedLineItems);
  const updateLineItemSplit = useExpenseStore((s) => s.updateLineItemSplit);
  const clearScanState = useExpenseStore((s) => s.clearScanState);
  const addExpense = useExpenseStore((s) => s.addExpense);
  const unassignedTotal = useUnassignedTotal();

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!scanResult || scanResult.lineItems.length === 0) {
      router.replace(`/trips/${tripId}`);
    }
  }, [scanResult, tripId, router]);

  useEffect(() => {
    if (activeTrip?.id !== tripId || members.length === 0) {
      void fetchTripDetail(tripId);
    }
  }, [tripId, activeTrip?.id, members.length, fetchTripDetail]);

  const currency = scanResult?.currency ?? trip?.baseCurrency ?? "USD";
  const total = scanResult?.total ?? 0;
  const assignedTotal = Math.max(0, total - unassignedTotal);
  const progress = total > 0 ? Math.min(100, (assignedTotal / total) * 100) : 0;
  const merchant = scanResult?.merchantName?.trim() || "Your receipt";
  const canSave = unassignedTotal === 0 && total > 0 && !submitting;

  const animatedAssigned = useAnimatedMinorUnits(assignedTotal);
  const animatedUnassigned = useAnimatedMinorUnits(unassignedTotal);

  const membersById = useMemo(() => {
    const map = new Map(members.map((m) => [m.userId, m]));
    return map;
  }, [members]);

  const handleClose = () => {
    clearScanState();
    router.replace(`/trips/${tripId}`);
  };

  const openPicker = useCallback(
    (itemIndex: number) => {
      const item = assignedLineItems[itemIndex];
      if (!item) return;

      openBottomSheet(
        <LineItemMemberPickerSheet
          itemName={item.name}
          lineTotal={item.lineTotal}
          members={members}
          initiallySelectedIds={item.splitMap.map((s) => s.userId)}
          onConfirm={(splitMap) => {
            updateLineItemSplit(itemIndex, splitMap);
          }}
        />,
        { height: "60" }
      );
    },
    [assignedLineItems, members, openBottomSheet, updateLineItemSplit]
  );

  const handleSave = async () => {
    if (!canSave || !user || !trip || !scanResult) return;
    if (assignedLineItems.some((item) => !isLineItemFullyAssigned(item))) return;

    setSubmitting(true);

    const memberIds = members.map((m) => m.userId);
    const splitMap = deriveSplitsFromLineItems(assignedLineItems, memberIds);
    const amountMinorUnits = total;
    const expenseCurrency = isValidCurrencyCode(currency)
      ? currency
      : trip.baseCurrency;
    const needsCurrencyReview = !isValidCurrencyCode(currency);

    try {
      const fx = await resolveExpenseFx(
        amountMinorUnits,
        expenseCurrency,
        trip.baseCurrency
      );

      addExpense(
        trip.id,
        {
          amountMinorUnits,
          currency: expenseCurrency,
          payerId: user.id,
          splitMethod: "custom",
          splitMap,
          category: scanResult.category,
          note: scanResult.merchantName?.trim() || undefined,
          merchant: scanResult.merchantName?.trim() || undefined,
          receiptImageUrl: scanResult.receiptImageUrl ?? undefined,
          fx,
          needsCurrencyReview,
          lineItems: assignedLineItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            splitMap: item.splitMap,
          })),
        },
        { baseCurrency: trip.baseCurrency, createdBy: user.id }
      );

      clearScanState();
      router.replace(`/trips/${trip.id}`);
    } catch (error) {
      addToast({
        message:
          error instanceof FxRateUnavailableError
            ? error.message
            : "Couldn't save the expense. Please try again.",
        variant: "error",
      });
      setSubmitting(false);
    }
  };

  if (!scanResult || scanResult.lineItems.length === 0) {
    return null;
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#0A0A0F]">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-[#ffffff0f] bg-[#0A0A0F] safe-top">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className={cn(
            "ml-5 flex h-10 w-10 items-center justify-center rounded-full text-[#F8F8FF]",
            "transition-colors hover:bg-[#1C1C27]",
            focusRing
          )}
        >
          <X className="h-[22px] w-[22px]" strokeWidth={2} />
        </button>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold text-[#F8F8FF]">
          Assign items
        </h1>
      </header>

      <div className="mx-auto w-full max-w-[430px] flex-1 overflow-y-auto px-6 pb-[120px] pt-4">
        <h2 className="text-[20px] font-bold leading-tight text-[#F8F8FF]">
          {merchant}
        </h2>

        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1C1C27]">
          <div
            className="h-full rounded-full transition-[width] duration-slow ease-tally"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
            }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-[13px] font-semibold tabular-nums text-[#10B981]">
            {formatCurrency(animatedAssigned, currency)} assigned
          </p>
          <p className="text-[13px] font-semibold tabular-nums text-[#F43F5E]">
            {formatCurrency(animatedUnassigned, currency)} left
          </p>
        </div>

        <ul className="mt-5 flex flex-col gap-2.5">
          {assignedLineItems.map((item, index) => (
            <LineItemAssignCard
              key={`${item.name}-${index}`}
              item={item}
              currency={currency}
              membersById={membersById}
              onAssign={() => openPicker(index)}
            />
          ))}
        </ul>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-mobile px-6 pb-6 safe-bottom">
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={cn(
            "flex h-14 w-full items-center justify-center rounded-[14px] text-[15px] font-semibold",
            "transition-all duration-DEFAULT ease-tally",
            canSave
              ? "bg-accent-gradient text-[#F8F8FF] shadow-[0_0_20px_#7C3AED50]"
              : "cursor-not-allowed bg-[#1C1C27] text-[#475569]",
            focusRing
          )}
        >
          {canSave ? "Save expense" : "Assign all items to save"}
        </button>
      </div>
    </div>
  );
}
