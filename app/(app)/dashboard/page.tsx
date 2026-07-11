"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthSession } from "@/features/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { TripCard } from "@/components/shared/TripCard";
import { TripEmptyIllustration } from "@/components/shared/TripEmptyIllustration";
import { getTimeGreeting } from "@/lib/greeting";
import { useTripStore, useTrips, useTripsLoading } from "@/store";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthSession();
  const trips = useTrips();
  const isLoading = useTripsLoading();
  const fetchTrips = useTripStore((s) => s.fetchTrips);

  useEffect(() => {
    if (user?.onboardingComplete) {
      void fetchTrips(user);
    }
  }, [user?.id, user?.onboardingComplete, fetchTrips, user]);

  const displayName = user?.displayName || "there";
  const greeting = getTimeGreeting();

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Sticky greeting header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#0A0A0F]/95 px-6 pb-4 pt-4 backdrop-blur-lg safe-top">
        <h1 className="text-[20px] font-semibold text-[#F8F8FF]">
          {greeting}, {displayName.split(" ")[0]}
        </h1>
        <Link
          href="/profile"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
          aria-label="Profile"
        >
          <Avatar
            name={displayName}
            src={user?.avatarUrl}
            size="md"
          />
        </Link>
      </header>

      <div className="flex flex-1 flex-col px-6">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : trips.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
            <TripEmptyIllustration />
            <h2 className="mt-6 text-[20px] font-bold text-[#F8F8FF]">
              No trips yet
            </h2>
            <p className="mt-2 max-w-[280px] text-[15px] leading-relaxed text-[#94A3B8]">
              Start a trip and invite your crew to split costs as you go.
            </p>
            <Link
              href="/trips/new"
              className={cn(
                "mt-8 flex h-14 w-full max-w-[342px] items-center justify-center rounded-[12px]",
                "bg-accent-gradient text-[16px] font-semibold text-[#F8F8FF]",
                "shadow-[0_4px_20px_#7C3AED40]",
                "transition-transform duration-fast ease-tally active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
              )}
            >
              Create your first trip
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
