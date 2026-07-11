import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import type { Trip } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  memberCount?: number;
  className?: string;
}

export function TripCard({ trip, memberCount, className }: TripCardProps) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className={cn(
        "block rounded-card border border-border-glass bg-background-card p-4",
        "transition-all duration-default ease-tally",
        "hover:border-accent-violet/30 hover:bg-background-elevated active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-text-primary">
            {trip.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{trip.destination}</span>
          </div>
        </div>
        <Badge variant="violet">{trip.baseCurrency}</Badge>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-text-disabled">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {formatRelativeDate(trip.startDate)} –{" "}
            {formatRelativeDate(trip.endDate)}
          </span>
        </div>
        {memberCount !== undefined && (
          <span>{memberCount} members</span>
        )}
      </div>
    </Link>
  );
}
