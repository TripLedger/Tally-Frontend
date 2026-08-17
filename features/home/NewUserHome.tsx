"use client";

import Link from "next/link";
import { authStackCtaClass } from "@/features/auth";
import { HomeHeader } from "./HomeHeader";
import { cn } from "@/lib/utils";

const CREW_AVATARS = [
  { src: "/tabr/home/avatars/14.png", alt: "Crew member" },
  { src: "/tabr/home/avatars/15.png", alt: "Crew member" },
  { src: "/tabr/home/avatars/18.png", alt: "Crew member" },
  { src: "/tabr/home/avatars/21.png", alt: "Crew member" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface NewUserHomeProps {
  displayName: string;
  avatarUrl?: string;
  unreadCount: number;
}

export function NewUserHome({
  displayName,
  avatarUrl,
  unreadCount,
}: NewUserHomeProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-y-auto bg-white text-[#15131A]">
      <HomeHeader
        displayName={displayName}
        avatarUrl={avatarUrl}
        unreadCount={unreadCount}
      />

      <div className="flex flex-1 flex-col px-5 pb-6 pt-6 xs:px-6 sm:pt-8">
        <h1 className="font-serif text-tabr-heading-3 w-full max-w-[20rem]">
          <span className="block">Create your</span>
          <span className="block italic">first group</span>
        </h1>

        <section
          className={cn(
            "mt-6 flex w-full flex-col items-stretch rounded-[20px] bg-white px-5 py-6 xs:px-6",
            "shadow-[0_8px_32px_rgba(21,19,26,0.06)]",
            "ring-1 ring-[#F0EEF5]"
          )}
          aria-labelledby="create-group-heading"
        >
          <div
            className="flex items-center justify-center"
            aria-hidden
          >
            {CREW_AVATARS.map((avatar, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={avatar.src}
                src={avatar.src}
                alt=""
                width={24}
                height={24}
                className={cn(
                  "relative h-6 w-6 rounded-full object-cover",
                  "border border-white",
                  "flex shrink-0 aspect-square"
                )}
                style={{
                  marginLeft: index === 0 ? 0 : -8,
                  zIndex: index + 1,
                }}
              />
            ))}
          </div>

          <h2
            id="create-group-heading"
            className="text-tabr-ink-paragraph-medium mt-4 text-center"
          >
            Get the crew together
          </h2>
          <p
            className={cn(
              "mt-1.5 w-full self-stretch text-center",
              "whitespace-nowrap",
              "[font-family:var(--font-definitions-font-family-body,Geist)]",
              "text-[length:clamp(11px,3.5vw,14px)] font-normal leading-5",
              "text-[var(--text-secondary-500,#716D7D)]"
            )}
          >
            Create a group and start building the trip together
          </p>

          <Link
            href="/trips/new"
            className={cn("mt-5", authStackCtaClass(true), focusRing)}
          >
            Create group
          </Link>
        </section>

        <section
          id="your-groups"
          className="mt-8 flex min-h-[140px] flex-1 scroll-mt-4 flex-col sm:mt-10"
          aria-labelledby="your-groups-heading"
        >
          <h2
            id="your-groups-heading"
            className="text-tabr-ink-heading-3"
          >
            Your groups
          </h2>

          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-tabr-ink-paragraph-medium text-center">
              You don&apos;t have any groups yet
            </p>
            <p className="mt-1.5 max-w-[260px] text-[13px] font-normal leading-5 text-[#716D7D] xs:text-[14px]">
              When you create one, your groups will be displayed here
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
