"use client";

import { BillSentSuccessScreen } from "@/features/expenses";

interface BillSentSuccessPageProps {
  params: { tripId: string; outingId: string };
}

export default function BillSentSuccessPage({
  params,
}: BillSentSuccessPageProps) {
  return <BillSentSuccessScreen groupId={params.tripId} />;
}
