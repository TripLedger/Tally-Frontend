"use client";

import { groupDetailFocusRing } from "./groupDetailStyles";
import { cn } from "@/lib/utils";
import type { TripMember } from "@/types";

interface GroupFriendRowProps {
  member: TripMember;
  email: string;
  onClick?: () => void;
}

export function GroupFriendRow({ member, email, onClick }: GroupFriendRowProps) {
  const isAdmin = member.role === "organizer";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-5 py-4 text-left xs:px-6",
        "transition-colors hover:bg-[#FAFAFA] active:bg-[#F5F5F5]",
        groupDetailFocusRing
      )}
    >
      {member.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.avatarUrl}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F2FF] text-[14px] font-semibold text-[#8B5CF6]"
          aria-hidden
        >
          {member.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-tabr-ink-paragraph-medium text-left">
          {member.displayName}
        </p>
        <p className="truncate text-tabr-ink-paragraph-mini-secondary mt-0.5 text-left">
          {email}
        </p>
      </div>

      {isAdmin ? (
        <span className="shrink-0 rounded-full bg-[var(--card-colour1,#F4F2FF)] px-2.5 py-1 text-[11px] font-medium leading-4 text-[#8B5CF6]">
          Admin
        </span>
      ) : null}
    </button>
  );
}
