"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { formatOutingTime } from "./outingFormat";

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Parse "HH:mm" (24h) into 12h parts. */
export function parseTripTime(value: string): {
  hour12: number;
  minute: number;
  period: "AM" | "PM";
} {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return { hour12: 10, minute: 30, period: "AM" };
  let hour24 = Number(match[1]);
  let minute = Number(match[2]);
  if (Number.isNaN(hour24) || hour24 > 23) hour24 = 10;
  if (Number.isNaN(minute) || minute > 59) minute = 30;
  // Snap minutes to nearest 5 for the picker grid
  minute = Math.round(minute / 5) * 5;
  if (minute === 60) minute = 55;
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, minute, period };
}

/** Build "HH:mm" (24h) from 12h parts. */
export function buildTripTime(
  hour12: number,
  minute: number,
  period: "AM" | "PM"
): string {
  let hour24 = hour12 % 12;
  if (period === "PM") hour24 += 12;
  return `${pad2(hour24)}:${pad2(minute)}`;
}

/** Display label for the time field — “10:30 AM”. */
export function formatTripTimeField(value: string): string {
  const formatted = formatOutingTime(value);
  // Insert space before AM/PM for field readability
  return formatted.replace(/(AM|PM)$/, " $1");
}

interface TripTimePickerProps {
  value: string;
  onSelect: (time: string) => void;
  onClose: () => void;
  containerRef?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Inline time picker for Customise your trip — hour / minute / AM·PM.
 * Avoids manual typing; matches the date calendar popover pattern.
 */
export function TripTimePicker({
  value,
  onSelect,
  onClose,
  containerRef,
  className,
}: TripTimePickerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const parts = useMemo(() => parseTripTime(value || "10:30"), [value]);

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

  const commit = (
    hour12: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    onSelect(buildTripTime(hour12, minute, period));
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Pick a time"
      className={cn(
        "w-full rounded-[16px] border border-[#E5E5E5] bg-white p-3",
        "shadow-[0_8px_24px_rgba(21,19,26,0.08)]",
        className
      )}
    >
      <p className="mb-3 text-center text-[14px] font-semibold leading-5 text-[#15131A]">
        {formatTripTimeField(buildTripTime(parts.hour12, parts.minute, parts.period))}
      </p>

      <div className="mb-3 flex gap-1 rounded-full bg-[#F5F5F5] p-1">
        {(["AM", "PM"] as const).map((period) => {
          const active = parts.period === period;
          return (
            <button
              key={period}
              type="button"
              onClick={() => commit(parts.hour12, parts.minute, period)}
              className={cn(
                "flex-1 rounded-full py-2 text-[13px] font-semibold leading-none",
                "transition-colors",
                active
                  ? "bg-white text-[#15131A] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-[#716D7D]"
              )}
            >
              {period}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[#8E8E93]">
            Hour
          </p>
          <div className="grid max-h-[168px] grid-cols-3 gap-1 overflow-y-auto pr-0.5">
            {HOURS_12.map((hour) => {
              const active = parts.hour12 === hour;
              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => commit(hour, parts.minute, parts.period)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-[10px] text-[14px]",
                    "transition-colors",
                    active
                      ? "bg-[#8B5CF6] font-semibold text-white"
                      : "bg-[#F5F5F5] text-[#15131A] hover:bg-[#EFEFEF]"
                  )}
                >
                  {hour}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[#8E8E93]">
            Min
          </p>
          <div className="grid max-h-[168px] grid-cols-3 gap-1 overflow-y-auto pr-0.5">
            {MINUTES.map((minute) => {
              const active = parts.minute === minute;
              return (
                <button
                  key={minute}
                  type="button"
                  onClick={() => commit(parts.hour12, minute, parts.period)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-[10px] text-[14px]",
                    "transition-colors",
                    active
                      ? "bg-[#8B5CF6] font-semibold text-white"
                      : "bg-[#F5F5F5] text-[#15131A] hover:bg-[#EFEFEF]"
                  )}
                >
                  {pad2(minute)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className={cn(
          "mt-3 flex h-11 w-full items-center justify-center rounded-full",
          "bg-[#8B5CF6] text-[15px] font-semibold text-white",
          "transition-transform active:scale-[0.98]"
        )}
      >
        Done
      </button>
    </div>
  );
}
