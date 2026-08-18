"use client";

import Link from "next/link";
import { authStackCtaClass } from "@/features/auth";
import { HomeHeader } from "./HomeHeader";
import { GroupCard } from "./GroupCard";
import { cn } from "@/lib/utils";
import type { Trip, TripMember } from "@/types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

interface ExistingUserHomeProps {
  displayName: string;
  avatarUrl?: string;
  unreadCount: number;
  trips: Trip[];
  membersByTrip: Record<string, TripMember[]>;
  /** Optional per-group trip counts (preview / future API). Defaults to 1. */
  tripCountsByTripId?: Record<string, number>;
}

/**
 * Home for users with one or more groups — scrollable cards + pinned Create group CTA.
 * Same screen whether data comes from the trip store or preview sample data.
 */
export function ExistingUserHome({
  displayName,
  avatarUrl,
  unreadCount,
  trips,
  membersByTrip,
  tripCountsByTripId,
}: ExistingUserHomeProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        "bg-[var(--new-bg,#FAFAFA)] text-[#15131A]"
      )}
    >
      <HomeHeader
        displayName={displayName}
        avatarUrl={avatarUrl}
        unreadCount={unreadCount}
      />

      <section
        id="your-groups"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4 pt-6 xs:px-6 sm:pt-8"
        aria-labelledby="your-groups-heading"
      >
        <h1 id="your-groups-heading" className="text-tabr-ink-heading-3 w-full">
          Your groups
        </h1>

        <ul className="mt-5 flex flex-col gap-4">
          {trips.map((trip, index) => (
            <li key={trip.id}>
              <GroupCard
                trip={trip}
                members={membersByTrip[trip.id]}
                colorIndex={index}
                tripCount={tripCountsByTripId?.[trip.id] ?? 1}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="shrink-0 px-5 pb-2 pt-1 xs:px-6">
        <Link
          href="/trips/new"
          className={cn("w-full", authStackCtaClass(true), focusRing)}
        >
          Create group
        </Link>
      </div>
    </div>
  );
}
