"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { AuthBackButton, authStackCtaClass } from "@/features/auth";
import { markAppReviewCompleted } from "@/lib/app-review";
import { cn } from "@/lib/utils";
import { ReviewThanksModal } from "./ReviewThanksModal";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

/**
 * Full-page Leave a review (Figma Profile → Reviews).
 * Stars start empty — the user chooses their rating.
 */
export function LeaveReviewScreen() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [thanksOpen, setThanksOpen] = useState(false);

  const canSubmit = rating >= 1;

  const onSubmit = () => {
    if (!canSubmit) return;
    markAppReviewCompleted(rating);
    setThanksOpen(true);
  };

  return (
    <>
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full flex-col",
          "bg-[var(--new-bg,#FAFAFA)]",
          "px-5 xs:px-6",
          "pb-[max(1.5rem,calc(var(--safe-bottom)+1rem))]",
          "pt-[calc(max(var(--safe-top),47px)+1rem)]"
        )}
      >
        <div className="flex shrink-0 items-center">
          <AuthBackButton href="/profile" label="Back to profile" />
        </div>

        <h1 className="mt-4 text-tabr-ink-heading-2">Leave a review</h1>

        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-[14px] font-normal leading-5 text-[#716D7D]">
            Your overall rating
          </p>

          <div
            className="flex items-center justify-center gap-2.5"
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
                    focusRing
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
        </div>

        <section className="mt-12 flex flex-col" aria-labelledby="share-more-heading">
          <h2
            id="share-more-heading"
            className="text-[18px] font-semibold leading-6 tracking-[-0.01em] text-[#15131A]"
          >
            Care to share more?
          </h2>
          <p className="mt-2 text-[14px] font-normal leading-5 text-[#716D7D]">
            How was your overall experience? What one thing that stood out for
            you?
          </p>

          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Type your review here."
            rows={5}
            className={cn(
              "mt-4 min-h-[140px] w-full resize-none rounded-[16px] border border-[#E5E5EA] bg-white",
              "px-4 py-3.5 text-[15px] font-normal leading-6 text-[#15131A]",
              "placeholder:text-[#AEAEB2]",
              "outline-none transition-shadow",
              "focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20",
              focusRing
            )}
          />

          {/* Figma: CTA sits directly under the input, not pinned to the page bottom */}
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmit}
            className={cn("mt-6 w-full", authStackCtaClass(canSubmit), focusRing)}
          >
            Submit review
          </button>
        </section>
      </div>

      <ReviewThanksModal
        open={thanksOpen}
        onBackHome={() => {
          setThanksOpen(false);
          router.push("/dashboard");
        }}
        onTakeSurvey={() => {
          setThanksOpen(false);
          router.push("/profile/review/survey");
        }}
      />
    </>
  );
}
