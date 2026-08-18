"use client";

import { Suspense } from "react";
import { GroupDetailScreen } from "@/features/groups";

interface TripDetailPageProps {
  params: { tripId: string };
}

export default function TripDetailPage({ params }: TripDetailPageProps) {
  return (
    <Suspense fallback={null}>
      <GroupDetailScreen tripId={params.tripId} />
    </Suspense>
  );
}
