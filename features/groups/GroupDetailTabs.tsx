"use client";

import { groupDetailFocusRing } from "./groupDetailStyles";
import { cn } from "@/lib/utils";

export type GroupDetailTab = "friends" | "trips";

interface GroupDetailTabsProps {
  active: GroupDetailTab;
  onChange: (tab: GroupDetailTab) => void;
}

export function GroupDetailTabs({ active, onChange }: GroupDetailTabsProps) {
  return (
    <div
      className="shrink-0 border-b border-[#E5E5E5] bg-white px-2"
      role="tablist"
      aria-label="Group sections"
    >
      <div className="grid grid-cols-2">
        <TabButton
          label="Friends"
          active={active === "friends"}
          onClick={() => onChange("friends")}
        />
        <TabButton
          label="Trips"
          active={active === "trips"}
          onClick={() => onChange("trips")}
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={active}
      role="tab"
      className={cn(
        "relative px-4 pb-4 pt-5 text-center text-[15px] font-medium transition-colors sm:text-[16px]",
        active ? "text-[#8B5CF6]" : "text-[#716D7D]",
        groupDetailFocusRing
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-6 bottom-0 h-[2px] rounded-full transition-colors",
          active ? "bg-[#8B5CF6]" : "bg-transparent"
        )}
      />
    </button>
  );
}
