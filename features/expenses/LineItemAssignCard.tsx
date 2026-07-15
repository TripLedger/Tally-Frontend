"use client";

import { Pencil } from "lucide-react";
import {
  getAvatarColorForUser,
  getMemberInitial,
} from "@/lib/avatar-colors";
import { formatCurrency } from "@/lib/currency";
import { isLineItemFullyAssigned, type LineItemWithSplit } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import type { TripMember } from "@/types";

interface LineItemAssignCardProps {
  item: LineItemWithSplit;
  currency: string;
  membersById: Map<string, TripMember>;
  onAssign: () => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]";

export function LineItemAssignCard({
  item,
  currency,
  membersById,
  onAssign,
}: LineItemAssignCardProps) {
  const assigned = isLineItemFullyAssigned(item);
  const assignedMembers = item.splitMap
    .map((s) => membersById.get(s.userId))
    .filter(Boolean) as TripMember[];
  const shown = assignedMembers.slice(0, 3);
  const extra = Math.max(0, assignedMembers.length - 3);

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3 rounded-[14px] bg-[#13131A] p-4",
        "transition-[border-color] duration-DEFAULT ease-tally",
        assigned
          ? "border border-[#10B98140]"
          : "border border-[#ffffff0f] shadow-[inset_0_1px_0_#ffffff0a]"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-[#F8F8FF]">
          {item.name}
        </p>
        <p className="mt-0.5 text-[13px] font-normal tabular-nums text-[#94A3B8]">
          x{item.quantity} · {formatCurrency(item.lineTotal, currency)}
        </p>
      </div>

      {assigned ? (
        <button
          type="button"
          onClick={onAssign}
          aria-label={`Edit assignment for ${item.name}`}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full",
            "animate-assign-avatars-in",
            focusRing
          )}
        >
          <span className="flex items-center">
            {shown.map((member, i) => {
              const bg = getAvatarColorForUser(member.userId);
              const initial = getMemberInitial(member.displayName);
              return (
                <span
                  key={member.userId}
                  className="relative flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-full text-[9px] font-semibold text-[#F8F8FF] ring-2 ring-[#13131A]"
                  style={{
                    backgroundColor: bg,
                    marginLeft: i === 0 ? 0 : -6,
                    zIndex: shown.length - i,
                  }}
                >
                  {member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </span>
              );
            })}
            {extra > 0 && (
              <span
                className="relative flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#1C1C27] text-[9px] font-semibold text-[#94A3B8] ring-2 ring-[#13131A]"
                style={{ marginLeft: -6 }}
              >
                +{extra}
              </span>
            )}
          </span>
          <Pencil className="h-3.5 w-3.5 text-[#94A3B8]" strokeWidth={2} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onAssign}
          className={cn(
            "animate-assign-pill-pulse shrink-0 rounded-full border border-[#7C3AED40] bg-[#7C3AED1a]",
            "px-3.5 py-2 text-[13px] font-semibold text-[#7C3AED]",
            focusRing
          )}
        >
          Assign →
        </button>
      )}
    </li>
  );
}
