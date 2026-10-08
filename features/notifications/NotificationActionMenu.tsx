"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export interface NotificationMenuItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

interface NotificationActionMenuProps {
  open: boolean;
  onClose: () => void;
  items: NotificationMenuItem[];
  ariaLabel: string;
  /** Align the popover to the trigger edge. */
  align?: "left" | "right";
}

export function NotificationActionMenu({
  open,
  onClose,
  items,
  ariaLabel,
  align = "right",
}: NotificationActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={ariaLabel}
      className={cn(
        "absolute top-[calc(100%+4px)] z-50 min-w-[168px]",
        "overflow-hidden rounded-[16px] border border-[#F0EEF5] bg-white",
        "shadow-[0_12px_32px_rgba(21,19,26,0.14)]",
        align === "right" ? "right-0" : "left-0"
      )}
    >
      {items.map((item, index) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={cn(
            "flex w-full items-center px-4 py-3.5 text-left",
            "[font-family:var(--font-definitions-font-family-body,Geist)]",
            "text-[length:var(--paragraph-small-font-size,14px)] font-normal",
            "leading-[var(--paragraph-small-line-height,20px)]",
            item.destructive ? "text-[#F43F5E]" : "text-[#15131A]",
            "transition-colors hover:bg-[#FAFAFA] active:bg-[#F5F5F5]",
            index > 0 && "border-t border-[#F0EEF5]",
            focusRing
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
