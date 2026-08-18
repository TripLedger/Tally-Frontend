"use client";

import { TripItineraryScreen } from "@/features/groups";
import {
  getPreviewNestedTrip,
  getPreviewTripEvents,
} from "@/features/groups/mockGroupFriendsData";

interface NestedTripPageProps {
  params: { tripId: string; itemId: string };
}

export default function NestedTripPage({ params }: NestedTripPageProps) {
  const trip = getPreviewNestedTrip(params.itemId);

  if (!trip || trip.groupId !== params.tripId) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-white px-6">
        <p className="text-center text-[14px] text-[#716D7D]">Trip not found.</p>
      </div>
    );
  }

  return (
    <TripItineraryScreen
      trip={trip}
      events={getPreviewTripEvents(params.itemId)}
    />
  );
}
