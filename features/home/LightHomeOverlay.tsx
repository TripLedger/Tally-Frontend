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
   */
  variant?: "sheet" | "floating";
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

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-center",
        isFloating
          ? "items-end px-5 pb-[max(2.5rem,var(--safe-bottom))] pt-6"
          : "items-end"
      )}
    >
      <div
        className="absolute inset-0 bg-[#15131A]/40 backdrop-blur-[2px]"
        onClick={dismissOnBackdrop ? onClose : undefined}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label={ariaLabel}
        className={cn(
          "relative z-10 w-full max-w-mobile bg-white",
          "shadow-[0_-8px_40px_rgba(21,19,26,0.12)]",
          "animate-sheet-in",
          isFloating
            ? "rounded-[24px] shadow-[0_16px_48px_rgba(21,19,26,0.16)]"
            : cn(
                "rounded-t-[24px]",
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
