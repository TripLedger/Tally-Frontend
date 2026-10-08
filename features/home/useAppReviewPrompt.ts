"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  markAppReviewDismissed,
  markAppReviewPromptShown,
  shouldPromptAppReview,
} from "@/lib/app-review";

const SHOW_DELAY_MS = 900;

/**
 * Occasional app-review prompt for existing-user home.
 * Never shows again after Take survey; snoozes ~14 days on dismiss.
 * Force with `?review=1` (design QA).
 */
export function useAppReviewPrompt(enabled: boolean) {
  const searchParams = useSearchParams();
  const forceReview = searchParams.get("review") === "1";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled && !forceReview) return;
    if (!forceReview && !shouldPromptAppReview()) return;

    const timer = window.setTimeout(() => {
      if (!forceReview && !shouldPromptAppReview()) return;
      if (!forceReview) markAppReviewPromptShown();
      setOpen(true);
    }, forceReview ? 200 : SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [enabled, forceReview]);

  return {
    open,
    dismiss: () => {
      if (!forceReview) markAppReviewDismissed();
      setOpen(false);
    },
  };
}
