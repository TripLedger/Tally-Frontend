"use client";

import { SelectGroupScreen } from "@/features/trips";

interface SelectGroupPageProps {
  params: { tripId: string; placeId: string };
}

export default function SelectGroupPage({ params }: SelectGroupPageProps) {
  return (
    <SelectGroupScreen groupId={params.tripId} placeId={params.placeId} />
  );
}
