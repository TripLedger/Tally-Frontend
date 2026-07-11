"use client";

import Link from "next/link";
import { ChevronLeft, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDetailHeaderProps {
  title: string;
  tripId: string;
}

export function TripDetailHeader({ title, tripId }: TripDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#ffffff0f] bg-[#0A0A0F]/95 backdrop-blur-lg safe-top">
      <Link
        href="/dashboard"
        aria-label="Back to dashboard"
        className={cn(
          "ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[#F8F8FF]",
          "transition-colors hover:bg-[#1C1C27]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
        )}
      >
        <ChevronLeft className="h-6 w-6" />
      </Link>

      <h1
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2",
          "max-w-[240px] truncate text-center text-[17px] font-semibold text-[#F8F8FF]"
        )}
      >
        {title}
      </h1>

      <Link
        href={`/trips/${tripId}/invite`}
        aria-label="Invite crew"
        className={cn(
          "ml-auto mr-5 flex h-10 w-10 items-center justify-center rounded-full text-[#F8F8FF]",
          "transition-colors hover:bg-[#1C1C27]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
        )}
      >
        <UserPlus className="h-[22px] w-[22px]" strokeWidth={2} />
      </Link>
    </header>
  );
}
