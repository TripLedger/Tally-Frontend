"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  getAvatarColorForUser,
  getMemberInitial,
} from "@/lib/avatar-colors";
import { useCloseBottomSheet } from "@/store";
import { cn } from "@/lib/utils";
import type { TripMember } from "@/types";

interface PayerSelectSheetProps {
  members: TripMember[];
  selectedUserId: string;
  onSelect: (userId: string) => void;
}

export function PayerSelectSheet({
  members,
  selectedUserId,
  onSelect,
}: PayerSelectSheetProps) {
  const closeBottomSheet = useCloseBottomSheet();

  return (
    <div className="flex flex-col">
      {members.map((member, index) => {
        const selected = member.userId === selectedUserId;
        const bgColor = getAvatarColorForUser(member.userId);
        const initial = getMemberInitial(member.displayName);

        return (
          <button
            key={member.userId}
            type="button"
            onClick={() => {
              onSelect(member.userId);
              closeBottomSheet();
            }}
            className={cn(
              "flex h-16 w-full items-center px-0",
              index < members.length - 1 && "border-b border-[#ffffff0f]",
              "transition-colors duration-fast ease-tally",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]"
            )}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-[#F8F8FF]"
              style={{ backgroundColor: bgColor }}
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <span className="ml-3 flex-1 truncate text-left text-[16px] font-medium text-[#F8F8FF]">
              {member.displayName}
            </span>
            {selected && (
              <Check className="h-5 w-5 shrink-0 text-[#7C3AED]" strokeWidth={2.5} />
            )}
          </button>
        );
      })}
    </div>
  );
}

interface PayerRowProps {
  member: TripMember;
  onClick: () => void;
}

export function PayerRow({ member, onClick }: PayerRowProps) {
  const bgColor = getAvatarColorForUser(member.userId);
  const initial = getMemberInitial(member.displayName);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 w-full items-center rounded-[12px] border border-[#ffffff0f] bg-[#13131A] px-3",
        "transition-colors duration-fast ease-tally hover:bg-[#1C1C27]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
      )}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-[#F8F8FF]"
        style={{ backgroundColor: bgColor }}
      >
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          initial
        )}
      </div>
      <span className="ml-3 flex-1 truncate text-left text-[16px] font-semibold text-[#F8F8FF]">
        {member.displayName}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 -rotate-90 text-[#94A3B8]" />
    </button>
  );
}
