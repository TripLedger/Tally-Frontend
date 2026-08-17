"use client";

import { Check } from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import { LightHomeOverlay } from "./LightHomeOverlay";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface GroupCreatedOverlayProps {
  open: boolean;
  onInviteFriends: () => void;
  onClose?: () => void;
}

export function GroupCreatedOverlay({
  open,
  onInviteFriends,
  onClose,
}: GroupCreatedOverlayProps) {
  return (
    <LightHomeOverlay
      open={open}
      onClose={onClose}
      ariaLabel="Group created"
      variant="floating"
      sheetClassName="px-6 pb-8 pt-8"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]"
          aria-hidden
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>

        <h2 className="mt-6 text-[20px] font-semibold leading-7 tracking-[-0.02em] text-[#15131A]">
          Group created
        </h2>
        <p className="text-tabr-ink-paragraph-mini-secondary mt-2 max-w-[260px]">
          Your group has been created successfully
        </p>

        <button
          type="button"
          onClick={onInviteFriends}
          className={cn("mt-8 w-full", authStackCtaClass(true), focusRing)}
        >
          Invite friends
        </button>
      </div>
    </LightHomeOverlay>
  );
}
