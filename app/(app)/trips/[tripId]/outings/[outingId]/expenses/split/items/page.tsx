"use client";

import { AssignByItemScreen } from "@/features/expenses";

interface AssignByItemPageProps {
  params: { tripId: string; outingId: string };
}

export default function AssignByItemPage({ params }: AssignByItemPageProps) {
  return (
    <AssignByItemScreen groupId={params.tripId} outingId={params.outingId} />
  );
}
