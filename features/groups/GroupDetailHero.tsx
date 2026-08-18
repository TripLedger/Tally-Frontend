"use client";

import Link from "next/link";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { GroupDetailMenu } from "./GroupDetailMenu";
import { FIGMA_HERO_AVATAR_CLUSTER } from "@/features/home/figmaUserAvatars";
import { GROUP_HERO_COVER } from "./mockGroupFriendsData";
import { groupDetailHeroFocusRing } from "./groupDetailStyles";
import { cn } from "@/lib/utils";

interface GroupDetailHeroProps {
  groupName: string;
  friendCount: number;
  tripCount: number;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onEditGroup: () => void;
  onInviteFriends: () => void;
  onLeaveGroup: () => void;
}

export function GroupDetailHero({
  groupName,
  friendCount,
  tripCount,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onEditGroup,
  onInviteFriends,
  onLeaveGroup,
}: GroupDetailHeroProps) {
  const friendLabel = friendCount === 1 ? "1 friend" : `${friendCount} friends`;
  const tripLabel = tripCount === 1 ? "1 trip" : `${tripCount} trips`;

  return (
    <header
      className={cn(
        "relative w-full shrink-0 bg-[var(--new-bg,#FAFAFA)]",
        /* Reserve space for the OS status bar — image starts below this */
        "pt-[calc(max(var(--safe-top),47px))]"
      )}
    >
      <div className="relative h-[clamp(300px,48vh,400px)] min-h-[300px] w-full overflow-hidden sm:min-h-[340px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GROUP_HERO_COVER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#15131A]/35 via-[#15131A]/5 to-[#15131A]/65"
          aria-hidden
        />

        {/* Back + menu on the photo, below the status-bar strip */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 z-30 flex items-center justify-between",
            "px-5 pt-4 xs:px-6"
          )}
        >
          <Link
            href="/dashboard"
            aria-label="Go back"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-white",
              "transition-opacity active:opacity-80",
              groupDetailHeroFocusRing
            )}
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} />
          </Link>

          <div className="relative">
            <button
              type="button"
              aria-label="Group options"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={onToggleMenu}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-white",
                "transition-opacity active:opacity-80",
                groupDetailHeroFocusRing
              )}
            >
              <MoreVertical className="h-5 w-5" strokeWidth={2.25} />
            </button>
            <GroupDetailMenu
              open={menuOpen}
              onClose={onCloseMenu}
              onEditGroup={onEditGroup}
              onInviteFriends={onInviteFriends}
              onLeaveGroup={onLeaveGroup}
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-5 pb-6 pt-16 text-center xs:px-6 sm:pb-8">
          <div className="flex items-center justify-center pl-2" aria-hidden>
            {FIGMA_HERO_AVATAR_CLUSTER.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${index}`}
                src={src}
                alt=""
                width={32}
                height={32}
                className={cn(
                  "relative h-8 w-8 rounded-full border-2 border-white object-cover sm:h-9 sm:w-9",
                  index > 0 && "-ml-2.5 sm:-ml-3"
                )}
                style={{ zIndex: index + 1 }}
              />
            ))}
          </div>

          <h1 className="text-tabr-hero-paragraph-large-medium mt-3 max-w-full truncate">
            {groupName}
          </h1>
          <p className="mt-1.5 text-[12px] font-normal leading-4 text-white/90">
            {friendLabel} • {tripLabel}
          </p>
        </div>
      </div>
    </header>
  );
}
