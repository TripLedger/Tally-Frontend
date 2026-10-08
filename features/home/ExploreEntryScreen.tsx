"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthBackButton, authStackCtaClass, useAuthSession } from "@/features/auth";
import { ChevronRight } from "lucide-react";
import {
  useTripStore,
  useTrips,
  useTripsLoading,
} from "@/store";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types";
import { figmaUserAvatarAt } from "./figmaUserAvatars";

const geistClass =
  "[font-family:var(--font-definitions-font-family-body,Geist)]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

/**
 * Bottom-nav Explore entry.
 * Routes into the real PrepareTripScreen (`/trips/[groupId]/trips/new`):
 * 0 groups → create group first; 1 group → explore; N → pick a group.
 */
export function ExploreEntryScreen() {
  const router = useRouter();
  const { user } = useAuthSession();
  const trips = useTrips();
  const tripsLoading = useTripsLoading();
  const fetchTrips = useTripStore((s) => s.fetchTrips);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user?.onboardingComplete) return;
    void fetchTrips(user);
  }, [user, fetchTrips]);

  useEffect(() => {
    if (tripsLoading) return;

    if (trips.length === 1) {
      router.replace(`/trips/${trips[0].id}/trips/new`);
      return;
    }

    setReady(true);
  }, [trips, tripsLoading, router]);

  if (!ready || tripsLoading) {
    return (
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full flex-col bg-[var(--new-bg,#FAFAFA)]",
          "px-5 xs:px-6",
          "pt-[calc(max(var(--safe-top),47px)+1rem)]",
          geistClass
        )}
      >
        <div className="mt-10 h-8 w-40 animate-pulse rounded-full bg-[#E8E8ED]" />
        <div className="mt-6 h-16 w-full animate-pulse rounded-[16px] bg-[#E8E8ED]" />
        <div className="mt-3 h-16 w-full animate-pulse rounded-[16px] bg-[#E8E8ED]" />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full flex-col",
          "bg-[var(--new-bg,#FAFAFA)]",
          "px-5 xs:px-6",
          "pb-[max(6rem,calc(var(--safe-bottom)+5rem))]",
          "pt-[calc(max(var(--safe-top),47px)+1rem)]",
          geistClass
        )}
      >
        <AuthBackButton href="/dashboard" label="Back to home" />
        <h1 className="text-tabr-ink-heading-2 mt-4">Explore</h1>
        <p className="text-tabr-ink-paragraph-small mt-2 max-w-[300px]">
          Create a group first — then you can explore places and plan a trip
          together.
        </p>
        <Link
          href="/trips/new"
          className={cn("mt-8", authStackCtaClass(true), focusRing)}
        >
          Create group
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(6rem,calc(var(--safe-bottom)+5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <AuthBackButton href="/dashboard" label="Back to home" />
      <h1 className="text-tabr-ink-heading-2 mt-4">Explore</h1>
      <p className="text-tabr-ink-paragraph-small mt-2">
        Choose a group to explore places with
      </p>

      <ul className="mt-6 flex flex-col gap-3" aria-label="Your groups">
        {trips.map((trip, index) => (
          <li key={trip.id}>
            <ExploreGroupRow
              trip={trip}
              avatarSrc={trip.coverImageUrl || figmaUserAvatarAt(index)}
              onSelect={() => router.push(`/trips/${trip.id}/trips/new`)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExploreGroupRow({
  trip,
  avatarSrc,
  onSelect,
}: {
  trip: Trip;
  avatarSrc: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-[16px] bg-white px-4 py-3.5 text-left",
        "shadow-[0_2px_16px_rgba(21,19,26,0.05)]",
        "transition-transform duration-150 active:scale-[0.99]",
        focusRing
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarSrc}
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 shrink-0 rounded-[12px] object-cover"
      />
      <span className="min-w-0 flex-1">
        <span className="text-tabr-ink-paragraph-medium block truncate">
          {trip.name}
        </span>
        <span className="text-tabr-ink-paragraph-mini-secondary mt-0.5 block truncate">
          Explore places for this group
        </span>
      </span>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-[#C7C7CC]"
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  );
}
