"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LightHomeOverlayProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  /** Sheet panel classes (height, padding overrides). */
  sheetClassName?: string;
  /** Allow tapping the scrim to dismiss. */
  dismissOnBackdrop?: boolean;
  ariaLabel: string;
  /**
   * `sheet` — full-width bottom sheet (share flow).
   * `floating` — inset card above the bottom edge (group-created success).
   * `center` — centered review card; Figma scrim is a soft dim + barely-there blur.
   */
  variant?: "sheet" | "floating" | "center";
}

export function LightHomeOverlay({
  open,
  onClose,
  children,
  sheetClassName,
  dismissOnBackdrop = true,
  ariaLabel,
  variant = "sheet",
}: LightHomeOverlayProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const isFloating = variant === "floating";
  const isCenter = variant === "center";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-center",
        isCenter
          ? "items-center px-5 py-8"
          : isFloating
            ? "items-end px-5 pb-[max(2.5rem,var(--safe-bottom))] pt-6"
            : "items-end"
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          isCenter
            ? /* Prompt popup: soft dim, blur almost invisible */
              "bg-[#15131A]/30 backdrop-blur-[0.5px]"
            : /* Bottom sheets: dim with barely-there blur (Figma thank-you) */
              "bg-[#15131A]/40 backdrop-blur-[1px]"
        )}
        onClick={dismissOnBackdrop ? onClose : undefined}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label={ariaLabel}
        className={cn(
          "relative z-10 bg-white",
          "shadow-[0_-8px_40px_rgba(21,19,26,0.12)]",
          "animate-sheet-in",
          isCenter
            ? "w-[326px] max-w-[calc(100%-2.5rem)] rounded-[28px] bg-white shadow-[0_16px_48px_rgba(21,19,26,0.14)]"
            : isFloating
              ? "w-full max-w-mobile rounded-[24px] shadow-[0_16px_48px_rgba(21,19,26,0.16)]"
              : cn(
                  "w-full max-w-mobile rounded-t-[24px]",
                  "pb-[max(1.5rem,calc(var(--safe-bottom)+1rem))]"
                ),
          sheetClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
