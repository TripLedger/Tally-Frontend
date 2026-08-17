"use client";

import Link from "next/link";
import { formatCompactDateRange, cn } from "@/lib/utils";
import type { Trip, TripMember } from "@/types";

const COVER_SRC = "/tabr/home/images/friends.png";

const FALLBACK_AVATARS = [
  "/tabr/home/avatars/14.png",
  "/tabr/home/avatars/15.png",
  "/tabr/home/avatars/18.png",
  "/tabr/home/avatars/21.png",
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

interface GroupCardProps {
  trip: Trip;
  members?: TripMember[];
}

function memberAvatarSrc(member: TripMember, index: number): string {
  return member.avatarUrl || FALLBACK_AVATARS[index % FALLBACK_AVATARS.length];
}

export function GroupCard({ trip, members = [] }: GroupCardProps) {
  const friendCount = Math.max(members.length, 1);
  const friendLabel = friendCount === 1 ? "1 friend" : `${friendCount} friends`;
  const nextLabel = buildNextLabel(trip);
  const faces = members.slice(0, 5);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className={cn(
        "block w-full overflow-hidden rounded-[24px] bg-[var(--card-colour1,#F4F2FF)] p-3 xs:p-4",
        "transition-transform duration-fast ease-tally active:scale-[0.99]",
        focusRing
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_SRC}
        alt=""
        className="h-[140px] w-full rounded-[18px] object-cover xs:h-[160px] sm:h-[180px]"
      />

      <div className="px-1 pb-1 pt-3">
        <h3 className="text-tabr-ink-paragraph-medium text-left">
          {trip.name}
        </h3>
        <p className="text-tabr-ink-paragraph-mini-secondary mt-0.5">
          {friendLabel} • 1 trip
        </p>

        {faces.length > 0 ? (
          <div
            className="mt-3 flex items-center"
            aria-label={`${friendCount} members`}
          >
            {faces.map((member, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={member.userId}
                src={memberAvatarSrc(member, index)}
                alt=""
                width={24}
                height={24}
                className={cn(
                  "relative h-6 w-6 rounded-full object-cover",
                  "border border-white",
                  index > 0 && "-ml-2"
                )}
                style={{ zIndex: index + 1 }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 flex items-center" aria-hidden>
            {FALLBACK_AVATARS.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                width={24}
                height={24}
                className={cn(
                  "relative h-6 w-6 rounded-full object-cover border border-white",
                  index > 0 && "-ml-2"
                )}
                style={{ zIndex: index + 1 }}
              />
            ))}
          </div>
        )}

        {nextLabel ? (
          <>
            <div className="my-3 h-px w-full bg-[#E5E5E5]" />
            <p className="text-tabr-ink-paragraph-mini-secondary">
              {nextLabel}
            </p>
          </>
        ) : null}
      </div>
    </Link>
  );
}

function buildNextLabel(trip: Trip): string | null {
  const destination = trip.destination.trim();
  const dates =
    trip.startDate && trip.endDate
      ? formatCompactDateRange(trip.startDate, trip.endDate)
      : "";

  if (destination && dates) return `Next: ${destination} • ${dates}`;
  if (destination) return `Next: ${destination}`;
  if (dates) return `Next: ${dates}`;
  return null;
}
