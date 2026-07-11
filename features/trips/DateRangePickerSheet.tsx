"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCloseBottomSheet } from "@/store";
import { formatDateRange } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DateRangePickerSheetProps {
  startDate?: string;
  endDate?: string;
  onSelect: (range: { startDate: string; endDate: string }) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toISO(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function parseISO(iso?: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function DateRangePickerSheet({
  startDate,
  endDate,
  onSelect,
}: DateRangePickerSheetProps) {
  const closeBottomSheet = useCloseBottomSheet();

  const initial = parseISO(startDate) ?? new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [start, setStart] = useState<string | undefined>(startDate);
  const [end, setEnd] = useState<string | undefined>(endDate);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayTap = (day: number) => {
    const iso = toISO(viewYear, viewMonth, day);
    if (!start || (start && end)) {
      setStart(iso);
      setEnd(undefined);
    } else if (iso < start) {
      setStart(iso);
    } else {
      setEnd(iso);
    }
  };

  const dayState = (day: number) => {
    const iso = toISO(viewYear, viewMonth, day);
    const isStart = iso === start;
    const isEnd = iso === end;
    const isBetween = Boolean(start && end && iso > start && iso < end);
    return { iso, isStart, isEnd, isBetween };
  };

  const canConfirm = Boolean(start && end);

  const handleConfirm = () => {
    if (!start || !end) return;
    onSelect({ startDate: start, endDate: end });
    closeBottomSheet();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Month navigation */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Previous month"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#1C1C27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-[16px] font-semibold text-[#F8F8FF]">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Next month"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#1C1C27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="flex h-8 items-center justify-center text-[11px] font-medium text-[#475569]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} className="h-10" />;
          const { isStart, isEnd, isBetween } = dayState(day);
          const isEdge = isStart || isEnd;
          const hasRange = Boolean(start && end);
          return (
            <div
              key={day}
              className="relative flex h-10 items-center justify-center"
            >
              {isBetween && (
                <div className="absolute inset-0 bg-[#7C3AED26]" />
              )}
              {isStart && hasRange && (
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[#7C3AED26]" />
              )}
              {isEnd && (
                <div className="absolute inset-y-0 left-0 w-1/2 bg-[#7C3AED26]" />
              )}
              <button
                type="button"
                onClick={() => handleDayTap(day)}
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[14px] tabular-nums",
                  "transition-colors duration-fast ease-tally",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]",
                  isEdge
                    ? "bg-accent-gradient font-semibold text-white"
                    : "text-[#F8F8FF] hover:bg-[#1C1C27]"
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      <p className="mt-4 text-center text-[13px] text-[#94A3B8]">
        {start
          ? formatDateRange(start, end ?? "")
          : "Tap a start and end date"}
      </p>

      {/* Confirm CTA */}
      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={cn(
            "flex h-14 w-full items-center justify-center rounded-[12px]",
            "text-[16px] font-semibold transition-all duration-default ease-tally",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]",
            canConfirm
              ? "bg-accent-gradient text-[#F8F8FF] shadow-[0_4px_20px_#7C3AED40]"
              : "bg-[#1C1C27] text-[#475569]"
          )}
        >
          Confirm dates
        </button>
      </div>
    </div>
  );
}
