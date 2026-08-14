"use client";

import { cn } from "@/lib/utils";

interface OnboardingPaginationProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function OnboardingPagination({
  count,
  activeIndex,
  onSelect,
  className,
}: OnboardingPaginationProps) {
  return (
    <div
      className={cn("flex items-center gap-[6px]", className)}
      role="tablist"
      aria-label="Onboarding slides"
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Slide ${index + 1} of ${count}`}
            onClick={() => onSelect(index)}
            className={cn(
              "rounded-full transition-all duration-300 ease-tally",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
              isActive
                ? "h-2 w-[22px] bg-white"
                : "h-2 w-2 bg-[#FFFFFF59]"
            )}
          />
        );
      })}
    </div>
  );
}
