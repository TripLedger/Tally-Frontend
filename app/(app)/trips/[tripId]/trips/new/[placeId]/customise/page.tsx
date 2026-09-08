"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CustomiseTripScreen } from "@/features/trips";

interface CustomiseTripPageProps {
  params: { tripId: string; placeId: string };
}

function CustomiseTripPageInner({ params }: CustomiseTripPageProps) {
  const searchParams = useSearchParams();
  const selectedGroupId =
    searchParams.get("group") ?? params.tripId;

  return (
    <CustomiseTripScreen
      entryGroupId={params.tripId}
      placeId={params.placeId}
      selectedGroupId={selectedGroupId}
    />
  );
}

export default function CustomiseTripPage(props: CustomiseTripPageProps) {
  return (
    <Suspense fallback={null}>
      <CustomiseTripPageInner {...props} />
    </Suspense>
  );
}
