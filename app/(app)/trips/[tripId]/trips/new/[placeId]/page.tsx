"use client";

import {
  getExploreDestinationById,
  LocationDetailsScreen,
} from "@/features/trips";

interface LocationDetailsPageProps {
  params: { tripId: string; placeId: string };
}

export default function LocationDetailsPage({
  params,
}: LocationDetailsPageProps) {
  const destination = getExploreDestinationById(params.placeId);

  if (!destination) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-[#15131A] px-6">
        <p className="text-center text-[14px] text-white/70">Place not found.</p>
      </div>
    );
  }

  return (
    <LocationDetailsScreen
      groupId={params.tripId}
      destination={destination}
    />
  );
}
