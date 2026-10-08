"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authStackCtaClass } from "@/features/auth";
import { AppReviewModal } from "@/features/expenses/AppReviewModal";
import { useAddToast, useHomeCurrency } from "@/store";
import { HomeHeader } from "./HomeHeader";
import { HomeTotalBalanceCard } from "./HomeTotalBalanceCard";
import { GroupCard } from "./GroupCard";
import { useAppReviewPrompt } from "./useAppReviewPrompt";
import { cn } from "@/lib/utils";
import type { Trip, TripMember } from "@/types";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface ExistingUserHomeProps {
  displayName: string;
  avatarUrl?: string;
  unreadCount: number;
  trips: Trip[];
  membersByTrip: Record<string, TripMember[]>;
  /** Optional per-group trip counts (preview / future API). Defaults to 1. */
  tripCountsByTripId?: Record<string, number>;
}

/**
 * Home for users with one or more groups — balance card, group list, Create group.
 */
export function ExistingUserHome({
  displayName,
  avatarUrl,
  unreadCount,
  trips,
  membersByTrip,
  tripCountsByTripId,
}: ExistingUserHomeProps) {
  const router = useRouter();
  const homeCurrency = useHomeCurrency();
  const addToast = useAddToast();
  const review = useAppReviewPrompt(trips.length > 0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#your-groups") return;
    requestAnimationFrame(() => {
      document
        .getElementById("your-groups")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col overflow-y-auto bg-white text-[#15131A]">
        <HomeHeader
          displayName={displayName}
          avatarUrl={avatarUrl}
          unreadCount={unreadCount}
        />

        <div className="flex flex-1 flex-col px-5 pb-8 pt-4 xs:px-6 sm:pt-5">
          <HomeTotalBalanceCard
            balanceMinor={0}
            currency={homeCurrency}
            onAdd={() =>
              addToast({
                message: "Add funds is coming soon.",
                variant: "info",
                duration: 2500,
              })
            }
            onSend={() =>
              addToast({
                message: "Send is coming soon.",
                variant: "info",
                duration: 2500,
              })
            }
            onHistory={() => router.push("/balances")}
          />

          <section
            id="your-groups"
            className="mt-8 flex min-h-0 flex-1 scroll-mt-4 flex-col"
            aria-labelledby="your-groups-heading"
          >
            <h2
              id="your-groups-heading"
              className="text-tabr-ink-heading-3 w-full"
            >
              Your groups
            </h2>

            <ul className="mt-5 flex flex-col gap-4">
              {trips.map((trip) => (
                <li key={trip.id}>
                  <GroupCard
                    trip={trip}
                    members={membersByTrip[trip.id]}
                    tripCount={tripCountsByTripId?.[trip.id] ?? 1}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-auto flex shrink-0 flex-col justify-end pt-10 pb-4">
              <Link
                href="/trips/new"
                className={cn("w-full", authStackCtaClass(true), focusRing)}
              >
                Create group
              </Link>
            </div>
          </section>
        </div>
      </div>

      <AppReviewModal
        open={review.open}
        onClose={review.dismiss}
        onTakeSurvey={() => {
          review.dismiss();
          router.push("/profile/review");
        }}
      />
    </>
  );
}
