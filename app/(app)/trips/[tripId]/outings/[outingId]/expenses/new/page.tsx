"use client";

import { EnterAmountScreen } from "@/features/expenses";

interface EnterAmountPageProps {
  params: { tripId: string; outingId: string };
}

export default function EnterAmountPage({ params }: EnterAmountPageProps) {
  return (
    <EnterAmountScreen groupId={params.tripId} outingId={params.outingId} />
  );
}
