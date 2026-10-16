"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  useBottomSheet,
  useCloseBottomSheet,
  useOpenBottomSheet,
} from "@/store";
import { cn } from "@/lib/utils";

export function BottomSheet() {
  const { isOpen, content, title, height, variant } = useBottomSheet();
  const closeBottomSheet = useCloseBottomSheet();
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const light = variant === "light";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const handleTouchEnd = () => {
    const delta = currentY.current - startY.current;
    if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    if (delta > 100) {
      closeBottomSheet();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-default",
          light
            ? "bg-[#15131A]/40 backdrop-blur-[1px]"
            : "bg-[#0A0A0F]/60 backdrop-blur-[4px]"
        )}
        onClick={closeBottomSheet}
        aria-hidden
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal
        aria-label={title ?? "Sheet"}
        className={cn(
          "relative z-10 flex w-full max-w-mobile flex-col overflow-hidden",
          "rounded-t-[20px] transition-transform duration-default ease-tally",
          "animate-sheet-in",
          light ? "bg-white" : "bg-[#13131A]",
          height === "75"
            ? "h-[75dvh]"
            : height === "45"
              ? "h-[45dvh]"
              : height === "40"
                ? "h-[40dvh]"
                : "h-[60dvh]"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center pt-3">
          <div
            className={cn(
              "h-1 w-9 rounded-full",
              light ? "bg-[#E5E5EA]" : "bg-[#ffffff1a]"
            )}
          />
        </div>
        {title ? (
          <h2
            className={cn(
              "px-6 pt-2 text-lg font-semibold",
              light ? "text-[#15131A]" : "text-text-primary"
            )}
          >
            {title}
          </h2>
        ) : null}
        <div className="safe-bottom flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-10 pt-1">
          {content}
        </div>
      </div>
    </div>
  );
}

interface BottomSheetTriggerProps {
  children: ReactNode;
  content: ReactNode;
  title?: string;
}

export function BottomSheetTrigger({
  children,
  content,
  title,
  height,
}: BottomSheetTriggerProps & { height?: "40" | "45" | "60" | "75" }) {
  const openBottomSheet = useOpenBottomSheet();

  return (
    <div
      onClick={() => openBottomSheet(content, { title, height })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openBottomSheet(content, { title, height });
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
