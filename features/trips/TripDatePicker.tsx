"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISO(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function parseISO(iso?: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Figma: “9 September, 2026” */
export function formatCustomiseTripDate(iso: string): string {
  const date = parseISO(iso);
  if (!date) return "";
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

interface TripDatePickerProps {
  selectedDate?: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
  containerRef?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Inline single-day calendar for Customise your trip (light Figma chrome).
 */
export function TripDatePicker({
  selectedDate,
  onSelect,
  onClose,
  containerRef,
  className,
}: TripDatePickerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const initial = parseISO(selectedDate) ?? new Date(2026, 8, 9);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

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

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef?.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [onClose, containerRef]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Pick a date"
      className={cn(
        "w-full rounded-[16px] border border-[#E5E5E5] bg-white p-3",
        "shadow-[0_8px_24px_rgba(21,19,26,0.08)]",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#716D7D] transition-colors hover:bg-[#F5F5F5]"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="text-[14px] font-semibold leading-5 text-[#15131A]">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#716D7D] transition-colors hover:bg-[#F5F5F5]"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center text-[11px] font-medium text-[#8E8E93]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-9" />;
          }
          const iso = toISO(viewYear, viewMonth, day);
          const selected = iso === selectedDate;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => {
                onSelect(iso);
                onClose();
              }}
              className={cn(
                "mx-auto flex h-9 w-9 items-center justify-center rounded-[8px]",
                "text-[14px] font-normal leading-none text-[#15131A]",
                "transition-colors hover:bg-[#F0F0F0]",
                selected && "bg-[#E8E8ED] font-medium"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
