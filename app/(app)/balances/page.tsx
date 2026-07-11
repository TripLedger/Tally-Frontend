"use client";

import { StickyHeader } from "@/components/layout/StickyHeader";
import { useTrips } from "@/store";
import Link from "next/link";

export default function GlobalBalancesPage() {
  const trips = useTrips();

  return (
    <>
      <StickyHeader title="Balances" />
      <div className="px-4 py-6">
        {trips.length === 0 ? (
          <p className="text-sm text-text-secondary">
            Join or create a trip first to see balances across your group.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}/balances`}
                className="rounded-card border border-border-glass bg-background-card px-4 py-3 text-sm font-medium text-text-primary hover:border-accent-violet/30"
              >
                {trip.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
