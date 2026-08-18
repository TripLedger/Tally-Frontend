"use client";

import { useMemo, useState } from "react";
import { GroupFriendRow } from "./GroupFriendRow";
import { GROUP_DETAIL_ICONS, groupDetailFocusRing } from "./groupDetailStyles";
import type { GroupMemberView } from "./mockGroupFriendsData";
import { cn } from "@/lib/utils";

const VISIBLE_MEMBER_COUNT = 5;

interface GroupFriendsPanelProps {
  members: GroupMemberView[];
  onInviteFriends: () => void;
}

export function GroupFriendsPanel({
  members,
  onInviteFriends,
}: GroupFriendsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleMembers = useMemo(() => {
    if (expanded) return members;
    return members.slice(0, VISIBLE_MEMBER_COUNT);
  }, [expanded, members]);

  const hiddenCount = Math.max(members.length - VISIBLE_MEMBER_COUNT, 0);
  const memberLabel =
    members.length === 1 ? "1 member" : `${members.length} members`;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between px-5 pb-1 pt-5 xs:px-6 sm:pt-6">
          <p className="text-tabr-ink-paragraph-mini-secondary">{memberLabel}</p>
          <button
            type="button"
            aria-label="Search members"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              "transition-colors hover:bg-[#FAFAFA] active:bg-[#F0EEF5]",
              groupDetailFocusRing
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GROUP_DETAIL_ICONS.search}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
              aria-hidden
            />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          <button
            type="button"
            onClick={onInviteFriends}
            className={cn(
              "flex w-full items-center gap-3 border-y border-[#F0EEF5] px-5 py-4 text-left xs:px-6",
              "transition-colors hover:bg-[#FAFAFA] active:bg-[#F5F5F5]",
              groupDetailFocusRing
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GROUP_DETAIL_ICONS.invite}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] shrink-0"
              aria-hidden
            />
            <span className="text-tabr-ink-paragraph-medium">Invite friends</span>
          </button>

          <div>
            {visibleMembers.map((entry, index) => (
              <div
                key={`${entry.member.userId}-${index}`}
                className={cn(
                  index < visibleMembers.length - 1 && "border-b border-[#F0EEF5]"
                )}
              >
                <GroupFriendRow member={entry.member} email={entry.email} />
              </div>
            ))}
          </div>

          {!expanded && hiddenCount > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className={cn(
                "w-full py-5 text-center text-tabr-ink-paragraph-mini-secondary",
                "transition-colors hover:bg-[#FAFAFA] active:bg-[#F5F5F5]",
                groupDetailFocusRing
              )}
            >
              View all ({hiddenCount} more)
            </button>
          ) : null}
        </div>
    </div>
  );
}
