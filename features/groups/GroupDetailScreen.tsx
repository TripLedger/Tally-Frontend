"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { ShareWithFriendsOverlay } from "@/features/home";
import { GroupDetailHero } from "./GroupDetailHero";
import { GroupDetailTabs, type GroupDetailTab } from "./GroupDetailTabs";
import { GroupFriendsPanel } from "./GroupFriendsPanel";
import { GroupTripsPanel } from "./GroupTripsPanel";
import {
  getPreviewGroupFriendsMembers,
  getPreviewGroupTrip,
  getPreviewGroupTripCount,
  getPreviewGroupTrips,
  isPreviewGroupTripId,
  membersToGroupViews,
} from "./mockGroupFriendsData";
import { useAddToast, useTripMembers, useTripStore, useTrips, useTripsLoading } from "@/store";
import type { Trip } from "@/types";

interface GroupDetailScreenProps {
  tripId: string;
}

export function GroupDetailScreen({ tripId }: GroupDetailScreenProps) {
  const addToast = useAddToast();
  const searchParams = useSearchParams();
  const trips = useTrips();
  const storeMembers = useTripMembers();
  const isLoading = useTripsLoading();

  const initialTab =
    searchParams.get("tab") === "trips" ? "trips" : "friends";
  const [activeTab, setActiveTab] = useState<GroupDetailTab>(initialTab);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const isPreview = isPreviewGroupTripId(tripId);

  useEffect(() => {
    if (isPreview) return;
    void useTripStore.getState().fetchTripDetail(tripId);
  }, [tripId, isPreview]);

  const trip: Trip | null = useMemo(() => {
    if (isPreview) return getPreviewGroupTrip(tripId);
    const fromStore = useTripStore.getState().activeTrip;
    if (fromStore?.id === tripId) return fromStore;
    return trips.find((entry) => entry.id === tripId) ?? null;
  }, [isPreview, tripId, trips]);

  const memberViews = useMemo(() => {
    if (isPreview) return getPreviewGroupFriendsMembers(tripId);
    return membersToGroupViews(storeMembers);
  }, [isPreview, tripId, storeMembers]);

  const tripCount = isPreview
    ? getPreviewGroupTripCount(tripId)
    : 1;

  const groupTrips = isPreview ? getPreviewGroupTrips(tripId) : [];

  const showInitialLoading = !isPreview && isLoading && !trip;

  const openInvite = () => {
    setMenuOpen(false);
    setShareOpen(true);
  };

  if (showInitialLoading) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-[var(--new-bg,#FAFAFA)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-[var(--new-bg,#FAFAFA)] px-6">
        <p className="text-center text-[14px] text-[#716D7D]">Group not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--new-bg,#FAFAFA)]">
        <GroupDetailHero
          groupName={trip.name}
          friendCount={memberViews.length}
          tripCount={tripCount}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
          onCloseMenu={() => setMenuOpen(false)}
          onEditGroup={() => {
            setMenuOpen(false);
            addToast({
              message: "Edit group is coming soon.",
              variant: "info",
              duration: 2500,
            });
          }}
          onInviteFriends={openInvite}
          onLeaveGroup={() => {
            setMenuOpen(false);
            addToast({
              message: "Leave group is coming soon.",
              variant: "info",
              duration: 2500,
            });
          }}
        />

        <GroupDetailTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "friends" ? (
          <GroupFriendsPanel
            members={memberViews}
            onInviteFriends={openInvite}
          />
        ) : (
          <GroupTripsPanel trips={groupTrips} />
        )}
      </div>

      <ShareWithFriendsOverlay
        open={shareOpen}
        inviteToken={trip.inviteToken}
        tripName={trip.name}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}
