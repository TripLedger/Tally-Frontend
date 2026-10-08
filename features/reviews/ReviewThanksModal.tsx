"use client";

import { Check } from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import { LightHomeOverlay } from "@/features/home";
import { cn } from "@/lib/utils";

interface ReviewThanksModalProps {
  open: boolean;
  onBackHome: () => void;
  onTakeSurvey: () => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/**
 * Post-submit thank-you bottom sheet (Figma Profile_Page 6).
 * Leave-a-review stays visible under a soft dark blur; sheet docks at the bottom.
 */
export function ReviewThanksModal({
  open,
  onBackHome,
  onTakeSurvey,
}: ReviewThanksModalProps) {
  return (
    <LightHomeOverlay
      open={open}
      ariaLabel="Thank you for your review"
      variant="sheet"
      dismissOnBackdrop={false}
      sheetClassName="px-6 pb-8 pt-8"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]"
          aria-hidden
        >
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>

        <h2 className="mt-5 text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[#15131A]">
          Thank you for your review
        </h2>

        <p className="mt-3 max-w-[280px] text-[14px] font-normal leading-5 text-[#716D7D]">
          We appreciate your feedback in helping us improve. Take a more
          detailed survey to help improve how we serve you. It takes 5 minutes.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className={cn(
              "box-border flex h-[52px] w-full items-center justify-center rounded-full",
              "border border-[#E5E5EA] bg-[#F5F5F7]",
              "text-[16px] font-semibold leading-none text-[#15131A]",
              "transition-transform duration-150 active:scale-[0.98]",
              focusRing
            )}
          >
            Back to Home
          </button>

          <button
            type="button"
            onClick={onTakeSurvey}
            className={cn("w-full", authStackCtaClass(true), focusRing)}
          >
            Take survey
          </button>
        </div>
      </div>
    </LightHomeOverlay>
  );
}
