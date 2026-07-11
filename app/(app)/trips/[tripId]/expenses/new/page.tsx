"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { CurrencyPickerSheet } from "@/features/auth";
import { AmountHeroInput } from "@/features/expenses/AmountHeroInput";
import { CategoryChips } from "@/features/expenses/CategoryChips";
import {
  PayerRow,
  PayerSelectSheet,
} from "@/features/expenses/PayerSelectSheet";
import {
  SplitMethodSection,
  type SplitMode,
} from "@/features/expenses/SplitMethodSection";
import { splitEquallyMinorUnits } from "@/features/expenses/splitMath";
import { isCustomSplitExact } from "@/features/expenses/splitMath";
import {
  getDecimalPlacesError,
  hasValidDecimalPlaces,
  parseAmountToMinorUnits,
} from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  useActiveTrip,
  useExpenseStore,
  useOpenBottomSheet,
  useTripMembers,
  useTrips,
  useUser,
} from "@/store";
import type { ExpenseCategory, ExpenseSplit } from "@/types";

interface NewExpensePageProps {
  params: { tripId: string };
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]";

export default function NewExpensePage({ params }: NewExpensePageProps) {
  const router = useRouter();
  const user = useUser();
  const activeTrip = useActiveTrip();
  const trips = useTrips();
  const members = useTripMembers();
  const addExpense = useExpenseStore((s) => s.addExpense);
  const openBottomSheet = useOpenBottomSheet();

  const trip =
    activeTrip?.id === params.tripId
      ? activeTrip
      : trips.find((t) => t.id === params.tripId) ?? null;

  const [currency, setCurrency] = useState(trip?.baseCurrency ?? "NGN");
  const [amountStr, setAmountStr] = useState("");
  const [payerId, setPayerId] = useState(user?.id ?? "");
  const [splitMode, setSplitMode] = useState<SplitMode>("equal");
  const [includedUserIds, setIncludedUserIds] = useState<string[]>(
    () => members.map((m) => m.userId)
  );
  const [customSplits, setCustomSplits] = useState<ExpenseSplit[]>([]);
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (trip?.baseCurrency) setCurrency(trip.baseCurrency);
  }, [trip?.baseCurrency]);

  useEffect(() => {
    if (members.length === 0) return;
    setIncludedUserIds((prev) =>
      prev.length > 0 ? prev : members.map((m) => m.userId)
    );
    if (user?.id) setPayerId((prev) => prev || user.id);
  }, [members, user?.id]);

  const totalMinor = useMemo(
    () => parseAmountToMinorUnits(amountStr, currency),
    [amountStr, currency]
  );

  const decimalError = useMemo(() => {
    if (!amountStr || hasValidDecimalPlaces(amountStr, currency)) return null;
    return getDecimalPlacesError(currency);
  }, [amountStr, currency]);

  const payer = members.find((m) => m.userId === payerId) ?? members[0];

  const splitValid = useMemo(() => {
    if (totalMinor <= 0) return false;
    if (splitMode === "equal") {
      return includedUserIds.length > 0;
    }
    return isCustomSplitExact(totalMinor, customSplits);
  }, [totalMinor, splitMode, includedUserIds, customSplits]);

  const canSave =
    totalMinor > 0 &&
    Boolean(payerId) &&
    splitValid &&
    !decimalError &&
    !submitting;

  const openCurrencyPicker = useCallback(() => {
    openBottomSheet(
      <CurrencyPickerSheet
        selectedCode={currency}
        onSelect={(c) => {
          setCurrency(c.code);
          if (!hasValidDecimalPlaces(amountStr, c.code)) {
            setAmountStr(amountStr.split(".")[0] ?? "");
          }
        }}
      />,
      { height: "75" }
    );
  }, [openBottomSheet, currency, amountStr]);

  const openPayerPicker = useCallback(() => {
    openBottomSheet(
      <PayerSelectSheet
        members={members}
        selectedUserId={payerId}
        onSelect={setPayerId}
      />,
      { title: "Paid by", height: "60" }
    );
  }, [openBottomSheet, members, payerId]);

  const handleSave = async () => {
    if (!canSave || !user || !trip) return;

    setSubmitting(true);

    const splitMap =
      splitMode === "equal"
        ? splitEquallyMinorUnits(totalMinor, includedUserIds)
        : customSplits;

    try {
      addExpense(
        trip.id,
        {
          amountMinorUnits: totalMinor,
          currency,
          payerId,
          splitMethod: splitMode,
          splitMap,
          category,
          note: note.trim() || undefined,
        },
        { baseCurrency: trip.baseCurrency, createdBy: user.id }
      );

      router.push(`/trips/${trip.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!trip) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0A0A0F] px-6">
        <p className="text-[14px] text-[#94A3B8]">Trip not found.</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#0A0A0F]">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-[#ffffff0f] bg-[#0A0A0F] safe-top">
        <Link
          href={`/trips/${trip.id}`}
          aria-label="Close"
          className={cn(
            "ml-5 flex h-10 w-10 items-center justify-center rounded-full text-[#F8F8FF]",
            "transition-colors hover:bg-[#1C1C27]",
            focusRing
          )}
        >
          <X className="h-[22px] w-[22px]" strokeWidth={2} />
        </Link>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold text-[#F8F8FF]">
          Add expense
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-[120px]">
        <div className="px-6 pt-4">
          <AmountHeroInput
            currency={currency}
            amountStr={amountStr}
            onAmountChange={setAmountStr}
            onCurrencyClick={openCurrencyPicker}
            decimalError={decimalError}
          />
        </div>

        <div className="mt-8 space-y-8 px-6">
          <div>
            <p className="mb-1.5 text-[13px] font-medium text-[#94A3B8]">
              Paid by
            </p>
            {payer && <PayerRow member={payer} onClick={openPayerPicker} />}
          </div>

          <SplitMethodSection
            members={members}
            currency={currency}
            totalMinor={totalMinor}
            mode={splitMode}
            onModeChange={setSplitMode}
            includedUserIds={includedUserIds}
            onIncludedChange={setIncludedUserIds}
            customSplits={customSplits}
            onCustomSplitsChange={setCustomSplits}
          />

          <CategoryChips selected={category} onSelect={setCategory} />

          <div className="pt-6">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className={cn(
                "h-12 w-full rounded-[12px] border border-[#ffffff0f] bg-[#13131A] px-[14px]",
                "text-[15px] font-normal text-[#F8F8FF] placeholder:text-[#475569]",
                focusRing
              )}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-20 mx-auto w-full max-w-mobile px-6 safe-bottom">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "relative flex h-14 w-full items-center justify-center rounded-[12px]",
            "text-[16px] font-semibold transition-all duration-default ease-tally",
            focusRing,
            canSave
              ? "bg-accent-gradient text-[#F8F8FF] shadow-[0_4px_20px_#7C3AED40] active:scale-[0.98]"
              : "bg-[#1C1C27] text-[#475569]"
          )}
        >
          <span className={cn(submitting && "opacity-0")}>Save expense</span>
          {submitting && (
            <span
              className="absolute h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white"
              style={{ animationDuration: "800ms" }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
