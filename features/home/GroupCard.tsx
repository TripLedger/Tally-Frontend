"use client";

import Link from "next/link";
import { formatCompactDateRange, cn } from "@/lib/utils";
import { FIGMA_USER_AVATAR_POOL, figmaUserAvatarAt } from "./figmaUserAvatars";
import type { Trip, TripMember } from "@/types";

const COVER_SRC = "/tabr/home/images/friends.png";

const FALLBACK_AVATARS = FIGMA_USER_AVATAR_POOL;

/** Figma card-colour1–4 — rotate per card in the groups list. */
const CARD_BG_CLASSES = [
  "bg-[var(--card-colour1,#F4F2FF)]",
  "bg-[var(--card-colour2,#FFF2FC)]",
  "bg-[var(--card-colour3,#EBF5FD)]",
  "bg-[var(--card-colour4,#FEF6EF)]",
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

interface GroupCardProps {
  trip: Trip;
  members?: TripMember[];
  /** 0–3 maps to Figma card-colour tokens. */
  colorIndex?: number;
  /** Shown as “N trip(s)” until backend tracks trip history per group. */
  tripCount?: number;
}

function memberAvatarSrc(member: TripMember, index: number): string {
  return member.avatarUrl || figmaUserAvatarAt(index);
}

export function GroupCard({
  trip,
  members = [],
  colorIndex = 0,
  tripCount = 1,
}: GroupCardProps) {
  const friendCount = Math.max(members.length, 1);
  const friendLabel = friendCount === 1 ? "1 friend" : `${friendCount} friends`;
  const tripLabel = tripCount === 1 ? "1 trip" : `${tripCount} trips`;
  const nextLabel = buildNextLabel(trip);
  const faces = members.slice(0, 5);
  const cardBg =
    CARD_BG_CLASSES[colorIndex % CARD_BG_CLASSES.length] ?? CARD_BG_CLASSES[0];

  return (
    <Link
      href={`/trips/${trip.id}`}
      className={cn(
        "block w-full overflow-hidden rounded-[24px] p-3 xs:p-4",
        cardBg,
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
        <h3 className="text-tabr-ink-paragraph-medium text-left">{trip.name}</h3>
        <p className="text-tabr-ink-paragraph-mini-secondary mt-0.5">
          {friendLabel} • {tripLabel}
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
            <p className="text-tabr-ink-paragraph-mini-secondary">{nextLabel}</p>
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
