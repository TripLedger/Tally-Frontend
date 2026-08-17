"use client";

import { HomeHeader } from "./HomeHeader";
import { GroupCard } from "./GroupCard";
import type { Trip, TripMember } from "@/types";

interface ExistingUserHomeProps {
  displayName: string;
  avatarUrl?: string;
  unreadCount: number;
  trips: Trip[];
  membersByTrip: Record<string, TripMember[]>;
}

export function ExistingUserHome({
  displayName,
  avatarUrl,
  unreadCount,
  trips,
  membersByTrip,
}: ExistingUserHomeProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-y-auto bg-[#FAFAFA] text-[#15131A]">
      <HomeHeader
        displayName={displayName}
        avatarUrl={avatarUrl}
        unreadCount={unreadCount}
      />

      <div className="flex flex-1 flex-col px-5 pb-6 pt-6 xs:px-6 sm:pt-8">
        <h1 className="text-tabr-ink-heading-3 w-full">Your groups</h1>

        <ul className="mt-5 flex flex-col gap-4">
          {trips.map((trip) => (
            <li key={trip.id}>
              <GroupCard trip={trip} members={membersByTrip[trip.id]} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
