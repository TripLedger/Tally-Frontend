"use client";

import { SplitCompleteScreen } from "@/features/expenses";

interface SplitCompletePageProps {
  params: { tripId: string; outingId: string };
}

export default function SplitCompletePage({ params }: SplitCompletePageProps) {
  return (
    <SplitCompleteScreen groupId={params.tripId} outingId={params.outingId} />
  );
}
