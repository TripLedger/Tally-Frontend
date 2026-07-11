"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import {
  getAvatarColorForUser,
  getMemberInitial,
} from "@/lib/avatar-colors";
import {
  formatCurrency,
  fromMinorUnits,
  getCurrencySymbol,
  toMinorUnits,
} from "@/lib/currency";
import {
  getCustomSplitDelta,
  isCustomSplitExact,
  splitEquallyMinorUnits,
} from "@/features/expenses/splitMath";
import { cn } from "@/lib/utils";
import type { ExpenseSplit, TripMember } from "@/types";

export type SplitMode = "equal" | "custom";

interface SplitMethodSectionProps {
  members: TripMember[];
  currency: string;
  totalMinor: number;
  mode: SplitMode;
  onModeChange: (mode: SplitMode) => void;
  includedUserIds: string[];
  onIncludedChange: (ids: string[]) => void;
  customSplits: ExpenseSplit[];
  onCustomSplitsChange: (splits: ExpenseSplit[]) => void;
}

function MemberChip({
  member,
  selected,
  onToggle,
}: {
  member: TripMember;
  selected: boolean;
  onToggle: () => void;
}) {
  const bgColor = getAvatarColorForUser(member.userId);
  const initial = getMemberInitial(member.displayName);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex h-10 items-center gap-2 rounded-xl border px-[14px] py-2",
        "transition-all duration-fast ease-tally",
        selected
          ? "border-[1.5px] border-[#7C3AED] bg-[#7C3AED1a] opacity-100"
          : "border border-[#ffffff0f] bg-[#13131A] opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
      )}
    >
      <div
        className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-[#F8F8FF]"
        style={{ backgroundColor: bgColor }}
      >
        {initial}
      </div>
      <span className="text-[14px] font-medium text-[#F8F8FF]">
        {member.displayName.split(" ")[0]}
      </span>
    </button>
  );
}

export function SplitMethodSection({
  members,
  currency,
  totalMinor,
  mode,
  onModeChange,
  includedUserIds,
  onIncludedChange,
  customSplits,
  onCustomSplitsChange,
}: SplitMethodSectionProps) {
  const [pulseKey, setPulseKey] = useState(0);
  const equalPerPerson = useMemo(() => {
    if (includedUserIds.length === 0 || totalMinor <= 0) return 0;
    const splits = splitEquallyMinorUnits(totalMinor, includedUserIds);
    return splits[0]?.amountMinorUnits ?? 0;
  }, [totalMinor, includedUserIds]);

  useEffect(() => {
    if (mode !== "custom" || totalMinor <= 0) return;
    const suggested = splitEquallyMinorUnits(
      totalMinor,
      members.map((m) => m.userId)
    );
    onCustomSplitsChange(suggested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const toggleMember = (userId: string) => {
    const next = includedUserIds.includes(userId)
      ? includedUserIds.filter((id) => id !== userId)
      : [...includedUserIds, userId];
    onIncludedChange(next);
    setPulseKey((k) => k + 1);
  };

  const delta = getCustomSplitDelta(totalMinor, customSplits);
  const isExact = isCustomSplitExact(totalMinor, customSplits);

  const allocationLabel = () => {
    if (totalMinor <= 0) return "Enter an amount first";
    if (isExact) {
      return (
        <span className="flex items-center gap-1.5 text-[#10B981]">
          All set
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </span>
      );
    }
    if (delta > 0) {
      return (
        <span className="text-[#94A3B8]">
          {formatCurrency(delta, currency)} remaining
        </span>
      );
    }
    return (
      <span className="font-semibold text-[#F43F5E]">
        {formatCurrency(Math.abs(delta), currency)} over
      </span>
    );
  };

  const updateCustomAmount = (userId: string, value: string) => {
    const num = Number(value.replace(/,/g, ""));
    const minor = Number.isFinite(num) ? toMinorUnits(num, currency) : 0;
    onCustomSplitsChange(
      customSplits.map((s) =>
        s.userId === userId ? { ...s, amountMinorUnits: minor } : s
      )
    );
  };

  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-[#94A3B8]">Split</p>

      <div className="relative flex h-11 rounded-xl bg-[#1C1C27] p-1">
        <div
          className={cn(
            "absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-[10px] bg-accent-gradient",
            "transition-transform duration-default ease-tally",
            mode === "custom" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
          )}
        />
        {(["equal", "custom"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={cn(
              "relative z-10 flex-1 rounded-[10px] text-[14px] font-semibold transition-colors duration-fast",
              mode === m ? "text-[#F8F8FF]" : "text-[#94A3B8]"
            )}
          >
            {m === "equal" ? "Equally" : "Custom"}
          </button>
        ))}
      </div>

      {mode === "equal" ? (
        <div className="mt-4">
          <div className="flex flex-wrap gap-3">
            {members.map((member) => (
              <MemberChip
                key={member.userId}
                member={member}
                selected={includedUserIds.includes(member.userId)}
                onToggle={() => toggleMember(member.userId)}
              />
            ))}
          </div>
          {totalMinor > 0 && includedUserIds.length > 0 && (
            <p
              key={pulseKey}
              className="mt-4 animate-amount-pulse text-center text-[15px] tabular-nums"
            >
              <span className="font-semibold text-[#F8F8FF]">
                {formatCurrency(equalPerPerson, currency)}
              </span>{" "}
              <span className="font-medium text-[#94A3B8]">each</span>
            </p>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex h-12 items-center rounded-[12px] bg-[#13131A] px-[14px] text-[14px] font-medium">
            {allocationLabel()}
          </div>
          <div className="mt-4">
            {members.map((member, index) => {
              const split = customSplits.find((s) => s.userId === member.userId);
              const bgColor = getAvatarColorForUser(member.userId);
              const initial = getMemberInitial(member.displayName);
              const displayAmount = split
                ? fromMinorUnits(split.amountMinorUnits, currency)
                : 0;
              const symbol = getCurrencySymbol(currency);

              return (
                <div
                  key={member.userId}
                  className={cn(
                    "flex h-[60px] items-center",
                    index < members.length - 1 && "border-b border-[#ffffff0f]"
                  )}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-[#F8F8FF]"
                    style={{ backgroundColor: bgColor }}
                  >
                    {initial}
                  </div>
                  <span className="ml-3 min-w-0 flex-1 truncate text-[15px] font-medium text-[#F8F8FF]">
                    {member.displayName}
                  </span>
                  <div className="relative w-[100px]">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#94A3B8]">
                      {symbol}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={displayAmount || ""}
                      onChange={(e) =>
                        updateCustomAmount(member.userId, e.target.value)
                      }
                      className={cn(
                        "h-10 w-full rounded-[10px] border border-[#ffffff0f] bg-[#1C1C27]",
                        "pr-2 pl-7 text-right text-[15px] font-semibold text-[#F8F8FF] tabular-nums",
                        "focus:border-[1.5px] focus:border-[#7C3AED] focus:outline-none"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
