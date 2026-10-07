"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import { cn } from "@/lib/utils";
import { AppReviewModal } from "./AppReviewModal";
import {
  lightExpenseFocusRing,
  lightExpenseShellClass,
  lightExpenseSuccessFooterClass,
} from "./lightExpenseChrome";

interface BillSentSuccessScreenProps {
  groupId: string;
}

/**
 * Outing flow — Bill sent success (Figma) + optional review modal.
 */
export function BillSentSuccessScreen({ groupId }: BillSentSuccessScreenProps) {
  const router = useRouter();
  const [reviewOpen, setReviewOpen] = useState(true);

  const goToGroup = () => {
    router.push(`/trips/${groupId}?tab=trips`);
  };

  return (
    <>
      <div
        className={cn(lightExpenseShellClass, "bg-[var(--new-bg,#FAFAFA)] pb-0")}
      >
        <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]"
            aria-hidden
          >
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="mt-6 text-tabr-ink-heading-2">Success</h1>
          <p className="text-tabr-ink-paragraph-small mt-2">
            Your crew has been notified
          </p>
        </div>

        <div className={cn(lightExpenseSuccessFooterClass, "pt-8")}>
          <button
            type="button"
            onClick={goToGroup}
            className={cn(
              "w-full",
              authStackCtaClass(true),
              lightExpenseFocusRing
            )}
          >
            Back to group
          </button>
        </div>
      </div>

      <AppReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onTakeSurvey={() => {
          setReviewOpen(false);
          goToGroup();
        }}
      />
    </>
  );
}
