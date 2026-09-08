"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { authControlBoxClass, authStackCtaClass } from "@/features/auth";
import { LightHomeOverlay } from "@/features/home";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const secondaryBtnClass = cn(
  authControlBoxClass,
  "flex items-center justify-center border border-[#E5E5E5] bg-white",
  "text-[16px] font-semibold leading-none text-[#15131A]",
  "transition-[transform,background-color] duration-150",
  "hover:bg-[#FAFAFA] active:scale-[0.98]",
  focusRing
);

interface TripCreatedOverlayProps {
  open: boolean;
  homeHref?: string;
  onViewDetails: () => void;
  onClose?: () => void;
}

/** Figma success card after Create — Back to Home / View details. */
export function TripCreatedOverlay({
  open,
  homeHref = "/dashboard",
  onViewDetails,
  onClose,
}: TripCreatedOverlayProps) {
  return (
    <LightHomeOverlay
      open={open}
      onClose={onClose}
      ariaLabel="Trip created"
      variant="floating"
      dismissOnBackdrop={false}
      sheetClassName="px-6 pb-8 pt-8"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]"
          aria-hidden
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>

        <h2 className="mt-6 text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[#15131A]">
          Trip created
        </h2>
        <p className="text-tabr-ink-paragraph-mini-secondary mt-2 max-w-[280px]">
          Your trip has been created successfully
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Link href={homeHref} className={secondaryBtnClass}>
            Back to Home
          </Link>
          <button
            type="button"
            onClick={onViewDetails}
            className={cn("w-full", authStackCtaClass(true), focusRing)}
          >
            View details
          </button>
        </div>
      </div>
    </LightHomeOverlay>
  );
}
