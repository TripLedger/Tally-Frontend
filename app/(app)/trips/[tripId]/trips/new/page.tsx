"use client";

import { PrepareTripScreen } from "@/features/trips";

interface AddTripPageProps {
  params: { tripId: string };
}

/**
 * Add-trip explore screen (Figma: “Let's prepare your trip”).
 * Nested under a group so back returns to that group's Trips tab.
 */
export default function AddTripPage({ params }: AddTripPageProps) {
  return <PrepareTripScreen groupId={params.tripId} />;
}
