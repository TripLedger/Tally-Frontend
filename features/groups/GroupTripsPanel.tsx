"use client";

import Link from "next/link";
import { authStackCtaClass } from "@/features/auth";
import { FIGMA_USER_AVATAR_POOL } from "@/features/home/figmaUserAvatars";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface GroupTripsPanelProps {
  tripCount?: number;
}

export function GroupTripsPanel({ tripCount: _tripCount = 0 }: GroupTripsPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--new-bg,#FAFAFA)] px-5 py-6 xs:px-6">
      <section
        className={cn(
          "flex w-full flex-col items-stretch rounded-[20px] bg-white px-5 py-6 xs:px-6",
          "shadow-[0_8px_32px_rgba(21,19,26,0.06)]",
          "ring-1 ring-[#F0EEF5]"
        )}
        aria-labelledby="empty-trips-heading"
      >
        <div className="flex items-center justify-center" aria-hidden>
          {FIGMA_USER_AVATAR_POOL.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              width={24}
              height={24}
              className="relative h-6 w-6 shrink-0 rounded-full border border-white object-cover"
              style={{
                marginLeft: index === 0 ? 0 : -8,
                zIndex: index + 1,
              }}
            />
          ))}
        </div>

        <h2
          id="empty-trips-heading"
          className="text-tabr-ink-paragraph-medium mt-4 text-center"
        >
          You don&apos;t have any trips yet
        </h2>
        <p className="text-tabr-ink-paragraph-mini-secondary mt-1.5 text-center">
          Add a trip and create memories
        </p>

        <Link
          href="/trips/new"
          className={cn("mt-5", authStackCtaClass(true), focusRing)}
        >
          Add new trip
        </Link>
      </section>
    </div>
  );
}
