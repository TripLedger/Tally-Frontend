"use client";

import { useMemo, useState } from "react";
import { Check, Users } from "lucide-react";
import {
  getAvatarColorForUser,
  getMemberInitial,
} from "@/lib/avatar-colors";
import { equalShareSplitMap } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { useCloseBottomSheet } from "@/store";
import type { TripMember } from "@/types";

interface LineItemMemberPickerSheetProps {
  itemName: string;
  lineTotal: number;
  members: TripMember[];
  /** Pre-selected user IDs when editing an existing assignment. */
  initiallySelectedIds?: string[];
  onConfirm: (splitMap: { userId: string; share: number }[]) => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]";

function CustomCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-fast ease-tally",
        checked
          ? "border-transparent bg-accent-gradient"
          : "border-[#ffffff1a] bg-[#1C1C27]"
      )}
      aria-hidden
    >
      {checked && <Check className="h-3 w-3 text-[#F8F8FF]" strokeWidth={3} />}
    </span>
  );
}

export function LineItemMemberPickerSheet({
  itemName,
  lineTotal,
  members,
  initiallySelectedIds = [],
  onConfirm,
}: LineItemMemberPickerSheetProps) {
  const closeBottomSheet = useCloseBottomSheet();
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initiallySelectedIds)
  );

  const allSelected = members.length > 0 && selected.size === members.length;

  const toggleEveryone = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(members.map((m) => m.userId)));
    }
  };

  const toggleMember = (userId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const selectedCount = selected.size;
  const canConfirm = selectedCount >= 1;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const ids = members
      .map((m) => m.userId)
      .filter((id) => selected.has(id));
    onConfirm(equalShareSplitMap(lineTotal, ids));
    closeBottomSheet();
  };

  const orderedMembers = useMemo(() => members, [members]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 pb-3 pt-2 text-center">
        <h2 className="text-[16px] font-semibold text-[#F8F8FF]">{itemName}</h2>
        <p className="mt-1 text-[13px] font-normal text-[#94A3B8]">
          Who had this?
        </p>
      </div>

      <button
        type="button"
        onClick={toggleEveryone}
        className={cn(
          "mb-3 flex h-14 w-full shrink-0 items-center gap-3 rounded-[12px] border px-4",
          "transition-colors duration-fast ease-tally",
          allSelected
            ? "border-[#7C3AED40] bg-[#7C3AED1a]"
            : "border-[#ffffff0f] bg-[#13131A]",
          focusRing
        )}
      >
        <Users className="h-[18px] w-[18px] shrink-0 text-[#7C3AED]" strokeWidth={2} />
        <span className="flex-1 text-left text-[15px] font-semibold text-[#F8F8FF]">
          Everyone
        </span>
        <CustomCheckbox checked={allSelected} />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {orderedMembers.map((member, index) => {
          const checked = selected.has(member.userId);
          const bgColor = getAvatarColorForUser(member.userId);
          const initial = getMemberInitial(member.displayName);

          return (
            <button
              key={member.userId}
              type="button"
              onClick={() => toggleMember(member.userId)}
              className={cn(
                "flex h-14 w-full items-center gap-3",
                index < orderedMembers.length - 1 && "border-b border-[#ffffff0f]",
                focusRing
              )}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-semibold text-[#F8F8FF]"
                style={{ backgroundColor: bgColor }}
              >
                {member.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <span className="flex-1 truncate text-left text-[15px] font-medium text-[#F8F8FF]">
                {member.displayName}
              </span>
              <CustomCheckbox checked={checked} />
            </button>
          );
        })}
      </div>

      <div className="shrink-0 pt-4 safe-bottom">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className={cn(
            "flex h-14 w-full items-center justify-center rounded-[14px] text-[15px] font-semibold",
            "transition-all duration-DEFAULT ease-tally",
            canConfirm
              ? "bg-accent-gradient text-[#F8F8FF] shadow-[0_0_20px_#7C3AED50]"
              : "cursor-not-allowed bg-[#1C1C27] text-[#475569]",
            focusRing
          )}
        >
          {canConfirm
            ? `Confirm (${selectedCount} selected)`
            : "Confirm (0 selected)"}
        </button>
      </div>
    </div>
  );
}
