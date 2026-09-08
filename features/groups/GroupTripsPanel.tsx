"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authStackCtaClass } from "@/features/auth";
import { FIGMA_USER_AVATAR_POOL } from "@/features/home/figmaUserAvatars";
import { useCreatedTripDraftStore } from "@/store";
import { GroupTripCard } from "./GroupTripCard";
import { groupDetailFocusRing } from "./groupDetailStyles";
import type { GroupTripView } from "./mockGroupFriendsData";
import { cn } from "@/lib/utils";

interface GroupTripsPanelProps {
  groupId: string;
  trips: GroupTripView[];
}

function tripHref(trip: GroupTripView): string {
  if (trip.outingHref) return trip.outingHref;
  if (trip.id.startsWith("preview-outing-") || trip.id.startsWith("outing-")) {
    return `/trips/${trip.groupId}/outings/${trip.id}`;
  }
  return `/trips/${trip.groupId}/trips/${trip.id}`;
}

/**
 * Group detail — Trips tab (Figma full-bleed place cards + Add new trip).
 */
export function GroupTripsPanel({ groupId, trips }: GroupTripsPanelProps) {
  const addTripHref = `/trips/${groupId}/trips/new`;
  const draft = useCreatedTripDraftStore((s) => s.draft);
  const hydrateDraft = useCreatedTripDraftStore((s) => s.hydrateDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrateDraft();
    setHydrated(true);
  }, [hydrateDraft]);

  const mergedTrips = useMemo(() => {
    if (!hydrated) return trips;
    if (!draft || draft.groupId !== groupId) return trips;

    const asCard: GroupTripView = {
      id: draft.id,
      groupId: draft.groupId,
      name: draft.placeName,
      destination: [draft.area, draft.city].filter(Boolean).join(", "),
      startDate: draft.date,
      endDate: draft.date,
      coverSrc: draft.imageSrc,
      status: "upcoming",
    };

    const withoutDup = trips.filter((trip) => trip.id !== draft.id);
    return [asCard, ...withoutDup];
  }, [trips, groupId, draft, hydrated]);

  if (mergedTrips.length === 0) {
    return <GroupTripsEmpty addTripHref={addTripHref} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 pt-4">
        {mergedTrips.map((trip) => (
          <li key={trip.id} className="w-full shrink-0">
            <GroupTripCard trip={trip} href={tripHref(trip)} />
          </li>
        ))}
      </ul>

      <div className="shrink-0 px-4 pb-2 pt-3">
        <Link
          href={addTripHref}
          className={cn("w-full", authStackCtaClass(true), groupDetailFocusRing)}
        >
          Add new trip
        </Link>
      </div>
    </div>
  );
}

function GroupTripsEmpty({ addTripHref }: { addTripHref: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white px-5 py-6 xs:px-6">
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
          href={addTripHref}
          className={cn("mt-5", authStackCtaClass(true), groupDetailFocusRing)}
        >
          Add new trip
        </Link>
      </section>
    </div>
  );
}
