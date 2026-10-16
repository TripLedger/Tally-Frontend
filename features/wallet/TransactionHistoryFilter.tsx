"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

interface FilterOption {
  id: string;
  label: string;
}

interface TransactionHistoryFilterProps {
  label: string;
  options: FilterOption[];
  value: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (id: string) => void;
  align?: "left" | "right";
}

export function TransactionHistoryFilter({
  label,
  options,
  value,
  open,
  onOpenChange,
  onChange,
  align = "left",
}: TransactionHistoryFilterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selected =
    options.find((option) => option.id === value)?.label ?? label;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2",
          "rounded-[14px] border border-[#E8E4EF] bg-white px-3.5",
          "text-left text-[14px] font-medium leading-5 text-[#15131A]",
          "transition-colors hover:bg-[#FAFAFA]",
          focusRing
        )}
      >
        <span className="min-w-0 truncate">{selected}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#5921B5] transition-transform duration-150",
            open && "rotate-180"
          )}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className={cn(
            "absolute top-[calc(100%+6px)] z-50 max-h-64 min-w-full overflow-y-auto",
            "rounded-[16px] border border-[#F0EEF5] bg-white",
            "shadow-[0_12px_32px_rgba(21,19,26,0.14)]",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((option) => {
            const active = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.id);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center px-4 py-3 text-left text-[14px]",
                  "transition-colors hover:bg-[#F9F7FC]",
                  active
                    ? "font-semibold text-[#5921B5]"
                    : "font-normal text-[#15131A]"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
