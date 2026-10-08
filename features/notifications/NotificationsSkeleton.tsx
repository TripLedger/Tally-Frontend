"use client";

import { cn } from "@/lib/utils";

export function NotificationsSkeleton() {
  return (
    <div className="mt-2 flex flex-col gap-4" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2.5 py-1">
          <div className="h-2 w-2 shrink-0 rounded-full bg-[#E8E8ED]" />
          <div className="h-9 w-9 shrink-0 rounded-[10px] bg-[#E8E8ED] animate-shimmer" />
          <div className="min-w-0 flex-1 space-y-2">
            <div
              className={cn(
                "h-3.5 rounded-full bg-[#E8E8ED] animate-shimmer",
                i === 1 ? "w-[55%]" : "w-[75%]"
              )}
            />
            <div className="h-3 w-[40%] rounded-full bg-[#E8E8ED] animate-shimmer" />
          </div>
          <div className="h-5 w-5 shrink-0 rounded-full bg-[#E8E8ED]" />
        </div>
      ))}
    </div>
  );
}
