"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthSession } from "@/features/auth";
import {
  ExistingUserHome,
  getMockExistingHomeMembersByTrip,
  getMockExistingHomeTripCounts,
  getMockExistingHomeTrips,
  GroupCreatedFlow,
  NewUserHome,
} from "@/features/home";
import { fetchMembersForTrip } from "@/lib/db/members";
import {
  useNotificationStore,
  useTripStore,
  useTrips,
  useUnreadCount,
} from "@/store";
import type { TripMember } from "@/types";

function DashboardContent() {
  const searchParams = useSearchParams();
  const previewExisting =
    searchParams.get("preview") === "existing" ||
    searchParams.get("preview") === "created";
  const { user } = useAuthSession();
  const trips = useTrips();
  const fetchTrips = useTripStore((s) => s.fetchTrips);
  const unreadCount = useUnreadCount();
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const [membersByTrip, setMembersByTrip] = useState<
    Record<string, TripMember[]>
  >({});

  useEffect(() => {
    if (previewExisting || !user?.onboardingComplete) return;
    void fetchTrips(user);
  }, [previewExisting, user?.id, user?.onboardingComplete, fetchTrips, user]);

  useEffect(() => {
    if (!user?.id || !user.onboardingComplete) return;
    void fetchNotifications(user.id);
  }, [user?.id, user?.onboardingComplete, fetchNotifications]);

  useEffect(() => {
    if (trips.length === 0) return;
    let cancelled = false;

    void (async () => {
      const entries = await Promise.all(
        trips.map(async (trip) => {
          const members = await fetchMembersForTrip(trip.id).catch(() => []);
          return [trip.id, members] as const;
        })
      );
      if (cancelled) return;
      setMembersByTrip(Object.fromEntries(entries));
    })();

    return () => {
      cancelled = true;
    };
  }, [trips]);

  const displayName =
    previewExisting && !user?.displayName?.trim()
      ? "Jane Doe"
      : user?.displayName || "there";

  let home = null;

  if (previewExisting) {
    // Same ExistingUserHome screen as production — sample data only for preview.
    home = (
      <ExistingUserHome
        displayName={displayName}
        avatarUrl={user?.avatarUrl}
        unreadCount={unreadCount}
        trips={getMockExistingHomeTrips()}
        membersByTrip={getMockExistingHomeMembersByTrip()}
        tripCountsByTripId={getMockExistingHomeTripCounts()}
      />
    );
  } else if (trips.length === 0) {
    home = (
      <NewUserHome
        displayName={displayName}
        avatarUrl={user?.avatarUrl}
        unreadCount={unreadCount}
      />
    );
  } else {
    home = (
      <ExistingUserHome
        displayName={displayName}
        avatarUrl={user?.avatarUrl}
        unreadCount={unreadCount}
        trips={trips}
        membersByTrip={membersByTrip}
      />
    );
  }

  return (
    <>
      {home}
      <GroupCreatedFlow />
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
