"use client";

import { useEffect, useState } from "react";
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
 * App review popup (Figma — existing home + bill-sent).
 * Soft dim scrim; 326px white card; stars + Take survey.
 */
export function AppReviewModal({
  open,
  onClose,
  onTakeSurvey,
}: AppReviewModalProps) {
  /** Unselected until the user picks — never pre-fill a high rating. */
  const [rating, setRating] = useState(0);
  const hasRating = rating >= 1;

  useEffect(() => {
    if (open) setRating(0);
  }, [open]);

  return (
    <LightHomeOverlay
      open={open}
      onClose={onClose}
      ariaLabel="App review"
      variant="center"
      dismissOnBackdrop
      sheetClassName="px-6 py-7"
    >
      <div className="flex w-full flex-col items-center gap-8 text-center">
        <h2 className="text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[#15131A]">
          How are you enjoying
          <br />
          the app so far?
        </h2>

        <div className="flex flex-col items-center gap-3">
          <p className="text-[14px] font-normal leading-5 text-[#716D7D]">
            Your overall rating
          </p>

          <div
            className="flex items-center justify-center gap-2"
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
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    "transition-transform duration-150 active:scale-95",
                    lightExpenseFocusRing
                  )}
                >
                  <Star
                    className={cn(
                      "h-7 w-7",
                      filled
                        ? "fill-[#F5A623] text-[#F5A623]"
                        : "fill-transparent text-[#D1D1D6]"
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p className="max-w-[260px] text-[14px] font-normal leading-5 text-[#716D7D]">
          We appreciate your feedback in helping us improve. Take a more
          detailed survey to help improve how we serve you. It takes 5 minutes.
        </p>

        <button
          type="button"
          disabled={!hasRating}
          onClick={() => {
            if (!hasRating) return;
            onTakeSurvey?.(rating);
          }}
          className={cn(
            "w-full",
            authStackCtaClass(hasRating),
            lightExpenseFocusRing
          )}
        >
          Take survey
        </button>
      </div>
    </LightHomeOverlay>
  );
}
