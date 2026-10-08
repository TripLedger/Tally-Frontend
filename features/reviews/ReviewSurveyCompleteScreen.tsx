"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/**
 * Survey finished — Figma “Review complete”.
 */
export function ReviewSurveyCompleteScreen() {
  const router = useRouter();

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(2.5rem,calc(var(--safe-bottom)+1.75rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]"
          aria-hidden
        >
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>

        <h1 className="mt-6 text-center text-[16px] font-medium leading-6 text-[#15131A]">
          Thank you, this shapes what
          <br />
          we build next
        </h1>

        <p className="mt-2 text-center text-[12px] font-normal leading-[18px] text-[#716D7D]">
          Some one from our team actually reads
          <br />
          this so you&apos;re not shouting into a form
        </p>
      </div>

      <div className="shrink-0">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={cn("w-full", authStackCtaClass(true), focusRing)}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
