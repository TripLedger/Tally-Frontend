"use client";

import Link from "next/link";
import { authStackCtaClass } from "@/features/auth";
import { FIGMA_USER_AVATAR_POOL } from "@/features/home/figmaUserAvatars";
import { GroupTripCard } from "./GroupTripCard";
import { groupDetailFocusRing } from "./groupDetailStyles";
import type { GroupTripView } from "./mockGroupFriendsData";
import { cn } from "@/lib/utils";

interface GroupTripsPanelProps {
  trips: GroupTripView[];
}

export function GroupTripsPanel({ trips }: GroupTripsPanelProps) {
  if (trips.length === 0) {
    return <GroupTripsEmpty />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--new-bg,#FAFAFA)]">
      <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 pt-[43px]">
        {trips.map((trip) => (
          <li key={trip.id} className="w-full shrink-0">
            <GroupTripCard
              trip={trip}
              href={`/trips/${trip.groupId}/trips/${trip.id}`}
            />
          </li>
        ))}
      </ul>

      <div className="shrink-0 px-4 pb-2 pt-4">
        <Link
          href="/trips/new"
          className={cn("w-full", authStackCtaClass(true), groupDetailFocusRing)}
        >
          Add new trip
        </Link>
      </div>
    </div>
  );
}

function GroupTripsEmpty() {
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
          className={cn("mt-5", authStackCtaClass(true), groupDetailFocusRing)}
        >
          Add new trip
        </Link>
      </section>
    </div>
  );
}
