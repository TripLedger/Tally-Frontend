import { formatCompactDateRange } from "@/lib/utils";
import type { Trip } from "@/types";

interface TripMetaRowProps {
  trip: Trip;
}

export function TripMetaRow({ trip }: TripMetaRowProps) {
  const dateRange = formatCompactDateRange(trip.startDate, trip.endDate);

  return (
    <div className="flex flex-nowrap items-center gap-3 overflow-hidden px-6 pt-3 text-[14px] font-medium text-[#94A3B8]">
      <span>{trip.destination}</span>
      {dateRange ? (
        <>
          <span className="text-[#475569]">•</span>
          <span>{dateRange}</span>
        </>
      ) : null}
      <span className="text-[#475569]">•</span>
      <span className="rounded-pill bg-[#1C1C27] px-[10px] py-1 text-[12px] font-semibold text-[#F8F8FF]">
        {trip.baseCurrency}
      </span>
    </div>
  );
}
