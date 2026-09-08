"use client";

import { ScanReceiptScreen } from "@/features/expenses";

interface ScanReceiptPageProps {
  params: { tripId: string; outingId: string };
}

export default function ScanReceiptPage({ params }: ScanReceiptPageProps) {
  return (
    <ScanReceiptScreen groupId={params.tripId} outingId={params.outingId} />
  );
}
