"use client";

import { cn } from "@/lib/utils";
import {
  HomeNotificationsBell,
  HomeProfileAvatarLink,
} from "./HomeHeaderActions";
import { HomeUserGreeting } from "./HomeUserGreeting";

interface HomeHeaderProps {
  displayName: string;
  avatarUrl?: string;
  unreadCount: number;
}

export function HomeHeader({
  displayName,
  avatarUrl,
  unreadCount,
}: HomeHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 px-5 pb-2 xs:px-6",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <HomeUserGreeting displayName={displayName} />

      <div className="flex shrink-0 items-center">
        <HomeNotificationsBell unreadCount={unreadCount} />
        <HomeProfileAvatarLink avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
