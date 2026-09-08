"use client";

import { Suspense } from "react";
import { CreatedTripDetailsScreen } from "@/features/trips";

interface OutingDetailsPageProps {
  params: { tripId: string; outingId: string };
}

function OutingDetailsInner({ params }: OutingDetailsPageProps) {
  return (
    <CreatedTripDetailsScreen
      groupId={params.tripId}
      outingId={params.outingId}
    />
  );
}

export default function OutingDetailsPage(props: OutingDetailsPageProps) {
  return (
    <Suspense fallback={null}>
      <OutingDetailsInner {...props} />
    </Suspense>
  );
}
