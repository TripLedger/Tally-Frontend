"use client";

import Link from "next/link";
import { GROUP_DETAIL_ICONS } from "./groupDetailStyles";
import { formatFigmaTripDates } from "./tripDateFormat";
import type { GroupTripView } from "./mockGroupFriendsData";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

interface GroupTripCardProps {
  trip: GroupTripView;
  href?: string;
}

export function GroupTripCard({ trip, href }: GroupTripCardProps) {
  const body = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={trip.coverSrc}
        alt=""
        width={72}
        height={72}
        className="h-14 w-14 shrink-0 rounded-[12px] object-cover xs:h-[72px] xs:w-[72px]"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-tabr-ink-paragraph-medium truncate text-left">
          {trip.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GROUP_DETAIL_ICONS.mapPin}
            alt=""
            width={12}
            height={12}
            className="h-3 w-3 shrink-0"
            aria-hidden
          />
          <span className="text-tabr-ink-paragraph-mini-secondary truncate">
            {trip.destination}
          </span>
        </p>
        <p className="mt-0.5 flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GROUP_DETAIL_ICONS.calendar}
            alt=""
            width={12}
            height={12}
            className="h-3 w-3 shrink-0"
            aria-hidden
          />
          <span className="text-tabr-ink-paragraph-mini-secondary truncate">
            {formatFigmaTripDates(trip.startDate, trip.endDate)}
          </span>
        </p>
      </div>
    </>
  );

  const className = cn(
    "flex w-full min-w-0 items-center gap-3 rounded-[16px] bg-white p-3",
    "shadow-[0_1px_3px_rgba(21,19,26,0.06)]",
    href && "transition-transform duration-fast ease-tally active:scale-[0.99]",
    href && focusRing
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <article className={className}>{body}</article>;
}
