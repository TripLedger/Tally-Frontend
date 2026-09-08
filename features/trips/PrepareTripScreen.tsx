"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthBackButton, useAuthSession } from "@/features/auth";
import { HomeProfileAvatarLink } from "@/features/home";
import { cn } from "@/lib/utils";
import { ExploreDestinationCard } from "./ExploreDestinationCard";
import {
  EXPLORE_CATEGORIES,
  MOCK_EXPLORE_DESTINATIONS,
  filterExploreDestinations,
  type ExploreCategory,
  type ExploreDestination,
} from "./mockExploreDestinations";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const geistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

/** Figma prepare-trip heading 3 — Playfair 32 / 28.8 / -1px */
const prepareHeadingClass = cn(
  "font-serif text-[32px] font-normal leading-[28.8px] tracking-[-1px]",
  "text-[var(--text-primary-500,#15131A)]"
);

interface PrepareTripScreenProps {
  groupId: string;
  /** Default city in the location chip — Figma uses Lagos. */
  city?: string;
}

/**
 * Add-trip flow — first screen (explore destinations).
 * Uses mock places + public/tabr/Trip cards images until the backend is ready.
 */
export function PrepareTripScreen({
  groupId,
  city = "Lagos",
}: PrepareTripScreenProps) {
  const router = useRouter();
  const { user } = useAuthSession();
  const [category, setCategory] = useState<ExploreCategory>("All");
  const [query, setQuery] = useState("");

  const destinations = useMemo(
    () =>
      filterExploreDestinations(MOCK_EXPLORE_DESTINATIONS, {
        category,
        query,
        city,
      }),
    [category, query, city]
  );

  const onSelect = (destination: ExploreDestination) => {
    router.push(`/trips/${groupId}/trips/new/${destination.id}`);
  };

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(1.5rem,var(--safe-bottom))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <div className="flex shrink-0 items-center justify-between">
        <AuthBackButton
          href={`/trips/${groupId}?tab=trips`}
          label="Back to trips"
        />
        <HomeProfileAvatarLink avatarUrl={user?.avatarUrl} />
      </div>

      <header className="mt-5 w-full shrink-0 text-left">
        <h1 id="prepare-trip-heading" className={prepareHeadingClass}>
          <span className="block">Let&apos;s prepare</span>
          <span className="block italic">your trip</span>
        </h1>
        <p className="text-tabr-ink-paragraph-mini-secondary mt-2">
          What&apos;s the vibe?
        </p>
      </header>

      {/* Location + search — Figma combined pill */}
      <div
        className={cn(
          "mt-5 flex h-11 w-full shrink-0 items-center gap-2.5",
          "rounded-full bg-[#F5F5F5] px-3.5",
          "ring-1 ring-[#EFEFEF]"
        )}
        role="search"
      >
        <div className="flex shrink-0 items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tabr/home/icons/map-pin.svg"
            alt=""
            width={14}
            height={14}
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden
          />
          <span className="text-[14px] font-medium leading-5 text-[#15131A]">
            {city}
          </span>
        </div>
        <span
          className="h-4 w-px shrink-0 bg-[#D1D1D6]"
          aria-hidden
        />
        <label className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="sr-only">Search places</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tabr/home/icons/search.svg"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className={cn(
              "min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-5",
              "text-[#15131A] placeholder:text-[#8E8E93]",
              "appearance-none outline-none"
            )}
          />
        </label>
      </div>

      <div className="mt-6 flex shrink-0 items-center justify-between">
        <h2 className="text-[16px] font-semibold leading-6 text-[#15131A]">
          Explore
        </h2>
        <button
          type="button"
          onClick={() => {
            setCategory("All");
            setQuery("");
          }}
          className={cn(
            "text-[14px] font-medium leading-5 text-[#8B5CF6]",
            "transition-opacity active:opacity-80",
            focusRing,
            "rounded-sm"
          )}
        >
          See all
        </button>
      </div>

      <div
        className="-mx-5 mt-3 flex shrink-0 gap-2 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] xs:-mx-6 xs:px-6 [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Place categories"
      >
        {EXPLORE_CATEGORIES.map((item) => {
          const active = category === item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(item)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[14px] leading-5",
                "transition-colors duration-fast ease-tally",
                focusRing,
                active
                  ? "bg-[#8B5CF6] font-medium text-white"
                  : "bg-[#F5F5F5] font-normal text-[#15131A]"
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <ul
        className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-2"
        aria-labelledby="prepare-trip-heading"
      >
        {destinations.length === 0 ? (
          <li className="py-10 text-center text-[14px] text-[#716D7D]">
            No places match that vibe yet.
          </li>
        ) : (
          destinations.map((destination) => (
            <li key={destination.id} className="w-full shrink-0">
              <ExploreDestinationCard
                destination={destination}
                onSelect={onSelect}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
