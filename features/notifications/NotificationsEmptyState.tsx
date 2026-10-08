"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationsEmptyState() {
  return (
    <div
      className={cn(
        "mt-2 flex w-full flex-col items-center rounded-[20px] bg-white px-6 py-10 text-center",
        "shadow-[0_2px_16px_rgba(21,19,26,0.05)]"
      )}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#F5F5F7]"
        aria-hidden
      >
        <Bell className="h-6 w-6 text-[#15131A]" strokeWidth={1.75} />
      </div>
      <h2
        className={cn(
          "mt-4 text-center",
          "[font-family:var(--font-definitions-font-family-body,Geist)]",
          "text-[length:var(--paragraph-regular-font-size,16px)] font-medium",
          "leading-[var(--paragraph-regular-line-height,24px)]",
          "tracking-[var(--paragraph-regular-letter-spacing,0)]",
          "text-[var(--general-primary,#171717)]"
        )}
      >
        No Notifications
      </h2>
      <p
        className={cn(
          "mt-1.5 max-w-[260px] text-center",
          "[font-family:var(--font-definitions-font-family-body,Geist)]",
          "text-[length:var(--paragraph-small-font-size,14px)] font-normal",
          "leading-[var(--paragraph-small-line-height,20px)]",
          "tracking-[var(--paragraph-small-letter-spacing,0)]",
          "text-[var(--general-muted-foreground,#737373)]"
        )}
      >
        You&apos;re all caught up. New notifications will appear here.
      </p>
    </div>
  );
}
