"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import { LightHomeOverlay } from "@/features/home";
import { cn } from "@/lib/utils";
import { lightExpenseFocusRing } from "./lightExpenseChrome";

interface AppReviewModalProps {
  open: boolean;
  onClose?: () => void;
  onTakeSurvey?: (rating: number) => void;
}

/**
 * Bill-sent review popup (Figma) — blurred success screen behind a rating card.
 */
export function AppReviewModal({
  open,
  onClose,
  onTakeSurvey,
}: AppReviewModalProps) {
  const [rating, setRating] = useState(4);

  return (
    <LightHomeOverlay
      open={open}
      onClose={onClose}
      ariaLabel="App review"
      variant="center"
      dismissOnBackdrop
      sheetClassName="px-6 pb-7 pt-8"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[#15131A]">
          How are you enjoying
          <br />
          the app so far?
        </h2>

        <p className="text-tabr-ink-paragraph-small mt-5">Your overall rating</p>

        <div
          className="mt-3 flex items-center justify-center gap-2.5"
          role="radiogroup"
          aria-label="Overall rating"
        >
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const filled = value <= rating;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={value === rating}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                onClick={() => setRating(value)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  "transition-transform duration-150 active:scale-95",
                  lightExpenseFocusRing
                )}
              >
                <Star
                  className={cn(
                    "h-8 w-8",
                    filled
                      ? "fill-[#F5A623] text-[#F5A623]"
                      : "fill-transparent text-[#F5A623]"
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>

        <p className="text-tabr-ink-paragraph-small mt-5 max-w-[280px]">
          We appreciate your feedback in helping us improve. Take a more
          detailed survey to help improve how we serve you. It takes 5 minutes.
        </p>

        <button
          type="button"
          onClick={() => onTakeSurvey?.(rating)}
          className={cn(
            "mt-7 w-full",
            authStackCtaClass(true),
            lightExpenseFocusRing
          )}
        >
          Take survey
        </button>
      </div>
    </LightHomeOverlay>
  );
}
