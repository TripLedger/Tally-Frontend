"use client";

import { EXPENSE_CATEGORIES } from "@/features/expenses/categoryConfig";
import { cn } from "@/lib/utils";
import type { ExpenseCategory } from "@/types";

interface CategoryChipsProps {
  selected: ExpenseCategory | null;
  onSelect: (category: ExpenseCategory | null) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-[#94A3B8]">
        Category{" "}
        <span className="text-[#475569]">(optional)</span>
      </p>
      <div className="relative -mx-1">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-[#0A0A0F] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-[#0A0A0F] to-transparent"
          aria-hidden
        />
        <div className="scrollbar-hide flex gap-2.5 overflow-x-auto px-1 pb-0.5">
          {EXPENSE_CATEGORIES.map(({ id, label, icon: Icon, color }) => {
            const active = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(active ? null : id)}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-pill border px-3.5",
                  "transition-all duration-fast ease-tally",
                  active
                    ? "border-[1.5px] border-[#7C3AED] bg-[#7C3AED1a] text-[#F8F8FF]"
                    : "border border-[#ffffff0f] bg-[#13131A] text-[#94A3B8]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
                )}
              >
                <Icon
                  className="h-4 w-4"
                  style={{ color: active ? color : "#94A3B8" }}
                  strokeWidth={2}
                />
                <span className="text-[14px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
