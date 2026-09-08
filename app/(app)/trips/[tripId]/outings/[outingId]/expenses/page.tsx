"use client";

import { AddExpenseScreen } from "@/features/expenses";

interface AddExpensePageProps {
  params: { tripId: string; outingId: string };
}

export default function AddExpensePage({ params }: AddExpensePageProps) {
  return (
    <AddExpenseScreen groupId={params.tripId} outingId={params.outingId} />
  );
}
