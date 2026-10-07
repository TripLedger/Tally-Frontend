"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  AuthBackButton,
  AuthStackHeader,
  authStackCtaClass,
} from "@/features/auth";
import { fromMinorUnits, getCurrencySymbol, toMinorUnits } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { BillAmountCard } from "./BillAmountCard";
import {
  lightExpenseCtaFooterClass,
  lightExpenseFocusRing,
  lightExpenseShellClass,
} from "./lightExpenseChrome";
import { getOutingSplitCrew } from "./outingSplit";
import { useOutingBill } from "./useOutingBill";

interface AssignByItemScreenProps {
  groupId: string;
  outingId: string;
}

/** Figma seed shares for a ₦20,000 demo bill: 3k / 12k / 3k / 2k. */
const FIGMA_SEED_WEIGHTS = [3, 12, 3, 2];

/**
 * Outing flow — Assign by item / custom split (Figma).
 * Same chrome as split-complete, with per-person amount sliders.
 */
export function AssignByItemScreen({
  groupId,
  outingId,
}: AssignByItemScreenProps) {
  const router = useRouter();
  const { amount, currency } = useOutingBill();
  const crew = useMemo(() => getOutingSplitCrew(groupId), [groupId]);
  const totalMinor = toMinorUnits(amount, currency);
  const symbol = getCurrencySymbol(currency);
  const backHref = `/trips/${groupId}/outings/${outingId}/expenses/split`;
  const successHref = `/trips/${groupId}/outings/${outingId}/expenses/split/success`;

  const [amountsMinor, setAmountsMinor] = useState<number[]>(() =>
    seedCustomAmounts(totalMinor, crew.length)
  );

  const onSlide = (index: number, nextMajor: number) => {
    setAmountsMinor((prev) =>
      redistributeAmount(prev, index, toMinorUnits(nextMajor, currency), totalMinor)
    );
  };

  return (
    <div className={cn(lightExpenseShellClass, "bg-white pb-0")}>
      <div className="flex shrink-0 items-center">
        <AuthBackButton href={backHref} label="Back to split choices" />
      </div>

      <AuthStackHeader
        title="Split complete"
        subtitle={
          <>
            Now you can share the bill with your
            <br />
            crew
          </>
        }
      />

      <BillAmountCard
        amount={amount}
        currency={currency}
        className="mt-12 shrink-0"
      />

      {/* Off-white starts above the member rows (Figma assign-by-item). */}
      <div className="-mx-5 mt-8 flex flex-1 flex-col xs:-mx-6">
        <div
          className={cn(
            "flex flex-1 flex-col px-5 pt-6 xs:px-6",
            "bg-[linear-gradient(180deg,#FFFFFF_0px,var(--new-bg,#FAFAFA)_40px,var(--new-bg,#FAFAFA)_100%)]"
          )}
        >
          <ul className="flex flex-col gap-5">
            {crew.map((member, index) => {
              const shareMinor = amountsMinor[index] ?? 0;
              const shareMajor = Math.round(
                fromMinorUnits(shareMinor, currency)
              );
              const totalMajor = Math.max(
                1,
                Math.round(fromMinorUnits(totalMinor, currency))
              );

              return (
                <li
                  key={member.userId}
                  className="rounded-[16px] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(21,19,26,0.05)]"
                >
                  <div className="flex items-center gap-3.5">
                    {member.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F2FF] text-[14px] font-semibold text-[#8B5CF6]"
                        aria-hidden
                      >
                        {member.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <p className="min-w-0 flex-1 truncate text-[16px] font-medium leading-6 text-[#15131A]">
                      {member.displayName}
                    </p>
                    <p className="shrink-0 text-[16px] font-semibold leading-6 tabular-nums text-[#15131A]">
                      {symbol}
                      {shareMajor.toLocaleString("en-US")}
                    </p>
                  </div>

                  <label className="mt-3 block">
                    <span className="sr-only">
                      Adjust amount for {member.displayName}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={totalMajor}
                      step={1}
                      value={shareMajor}
                      onChange={(e) => onSlide(index, Number(e.target.value))}
                      className="assign-split-slider w-full"
                      style={
                        {
                          ["--assign-pct"]: `${(shareMajor / totalMajor) * 100}%`,
                        } as CSSProperties
                      }
                    />
                  </label>
                </li>
              );
            })}
          </ul>

          <div className={cn(lightExpenseCtaFooterClass, "mt-10")}>
            <button
              type="button"
              onClick={() => router.push(successHref)}
              className={cn(
                "w-full",
                authStackCtaClass(true),
                lightExpenseFocusRing
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function seedCustomAmounts(totalMinor: number, count: number): number[] {
  if (count <= 0 || totalMinor <= 0) return [];

  const weights =
    count === FIGMA_SEED_WEIGHTS.length
      ? FIGMA_SEED_WEIGHTS
      : Array.from({ length: count }, () => 1);
  const weightSum = weights.reduce((sum, w) => sum + w, 0);

  const amounts = weights.map((weight) =>
    Math.floor((totalMinor * weight) / weightSum)
  );
  let remainder = totalMinor - amounts.reduce((sum, n) => sum + n, 0);
  let i = 0;
  while (remainder > 0) {
    amounts[i % amounts.length] += 1;
    remainder -= 1;
    i += 1;
  }
  return amounts;
}

/** Keep the bill total exact while one person's share changes. */
function redistributeAmount(
  current: number[],
  index: number,
  nextMinor: number,
  totalMinor: number
): number[] {
  if (current.length === 0) return current;

  const clamped = Math.max(0, Math.min(totalMinor, nextMinor));
  if (current.length === 1) return [clamped];

  const others = current.filter((_, i) => i !== index);
  const othersSum = others.reduce((sum, n) => sum + n, 0);
  const remaining = totalMinor - clamped;

  const next = [...current];
  next[index] = clamped;

  if (othersSum === 0) {
    const base = Math.floor(remaining / others.length);
    let rem = remaining - base * others.length;
    current.forEach((_, i) => {
      if (i === index) return;
      next[i] = base + (rem > 0 ? 1 : 0);
      if (rem > 0) rem -= 1;
    });
    return next;
  }

  let allocated = 0;
  const otherIndexes = current
    .map((_, i) => i)
    .filter((i) => i !== index);

  otherIndexes.forEach((i, pos) => {
    if (pos === otherIndexes.length - 1) {
      next[i] = remaining - allocated;
      return;
    }
    const share = Math.floor((remaining * current[i]) / othersSum);
    next[i] = share;
    allocated += share;
  });

  return next;
}
