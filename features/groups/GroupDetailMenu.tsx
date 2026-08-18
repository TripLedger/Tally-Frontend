"use client";

import { useEffect, useRef } from "react";
import { groupDetailFocusRing } from "./groupDetailStyles";
import { cn } from "@/lib/utils";

interface GroupDetailMenuProps {
  open: boolean;
  onClose: () => void;
  onEditGroup: () => void;
  onInviteFriends: () => void;
  onLeaveGroup: () => void;
}

export function GroupDetailMenu({
  open,
  onClose,
  onEditGroup,
  onInviteFriends,
  onLeaveGroup,
}: GroupDetailMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Group options"
      className={cn(
        "absolute right-0 top-[calc(100%+6px)] z-50 w-[min(200px,calc(100vw-2.5rem))]",
        "overflow-hidden rounded-[14px] border border-[#F0EEF5] bg-white",
        "shadow-[0_12px_32px_rgba(21,19,26,0.14)]"
      )}
    >
      <MenuItem label="Edit group" onClick={onEditGroup} />
      <MenuItem label="Invite friends" onClick={onInviteFriends} />
      <div className="mx-3 h-px bg-[#F0EEF5]" aria-hidden />
      <MenuItem label="Leave group" onClick={onLeaveGroup} />
    </div>
  );
}

function MenuItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center px-4 py-3.5 text-left",
        "text-[15px] font-normal leading-5 text-[#15131A]",
        "transition-colors hover:bg-[#FAFAFA] active:bg-[#F5F5F5]",
        groupDetailFocusRing
      )}
    >
      {label}
    </button>
  );
}
