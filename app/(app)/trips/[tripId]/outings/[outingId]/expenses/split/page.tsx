"use client";

import { SplitChoicesScreen } from "@/features/expenses";

interface SplitChoicesPageProps {
  params: { tripId: string; outingId: string };
}

export default function SplitChoicesPage({ params }: SplitChoicesPageProps) {
  return (
    <SplitChoicesScreen groupId={params.tripId} outingId={params.outingId} />
  );
}
