"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authStackCtaClass } from "@/features/auth";
import { playfair } from "@/lib/fonts";
import { useAddToast, useHomeCurrency } from "@/store";
import { FIGMA_USER_AVATAR_POOL } from "./figmaUserAvatars";
import { HomeHeader } from "./HomeHeader";
import { HomeTotalBalanceCard } from "./HomeTotalBalanceCard";
import { cn } from "@/lib/utils";

const CREW_AVATARS = FIGMA_USER_AVATAR_POOL.map((src) => ({
  src,
  alt: "Crew member",
}));

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
  const router = useRouter();
  const homeCurrency = useHomeCurrency();
  const addToast = useAddToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#your-groups") return;
    requestAnimationFrame(() => {
      document
        .getElementById("your-groups")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const comingSoon = (message: string) => {
    addToast({ message, variant: "info", duration: 2500 });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col overflow-y-auto bg-white text-[#15131A]">
      <HomeHeader
        displayName={displayName}
        avatarUrl={avatarUrl}
        unreadCount={unreadCount}
      />

      <div className="flex flex-1 flex-col px-5 pb-8 pt-4 xs:px-6 sm:pt-5">
        <HomeTotalBalanceCard
          balanceMinor={0}
          currency={homeCurrency}
          onAdd={() => comingSoon("Add funds is coming soon.")}
          onSend={() => comingSoon("Send is coming soon.")}
          onHistory={() => router.push("/balances")}
        />

        <h1
          className={cn(
            playfair.className,
            "mt-8 w-full",
            "text-[32px] font-normal leading-[28.8px] tracking-[-1px]",
            "text-[var(--text-primary-500,#15131A)]"
          )}
        >
          <span className="block">Create your</span>
          <span className="block italic">first group</span>
        </h1>

        <section
          className={cn(
            "mt-5 flex w-full flex-col items-stretch rounded-[20px] bg-white px-5 py-6 xs:px-6",
            "shadow-[0_8px_32px_rgba(21,19,26,0.06)]",
            "ring-1 ring-[#F0EEF5]"
          )}
          aria-labelledby="create-group-heading"
        >
          <div className="flex items-center justify-center" aria-hidden>
            {CREW_AVATARS.map((avatar, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={avatar.src}
                src={avatar.src}
                alt=""
                width={32}
                height={32}
                className={cn(
                  "relative h-8 w-8 rounded-full object-cover",
                  "border-2 border-white",
                  "flex shrink-0 aspect-square"
                )}
                style={{
                  marginLeft: index === 0 ? 0 : -10,
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
              "[font-family:var(--font-definitions-font-family-body,Geist)]",
              "text-[length:var(--paragraph-small-font-size,14px)] font-normal",
              "leading-[var(--paragraph-small-line-height,20px)]",
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
          <h2 id="your-groups-heading" className="text-tabr-ink-heading-3">
            Your groups
          </h2>

          <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
            <p
              className={cn(
                "text-center",
                "[font-family:var(--font-definitions-font-family-body,Geist)]",
                "text-[length:var(--paragraph-regular-font-size,16px)] font-medium",
                "leading-[var(--paragraph-regular-line-height,24px)]",
                "text-[var(--general-primary,#171717)]"
              )}
            >
              You don&apos;t have any groups yet
            </p>
            <p
              className={cn(
                "mt-1.5 max-w-[280px] text-center",
                "[font-family:var(--font-definitions-font-family-body,Geist)]",
                "text-[length:var(--paragraph-small-font-size,14px)] font-normal",
                "leading-[var(--paragraph-small-line-height,20px)]",
                "text-[var(--general-muted-foreground,#737373)]"
              )}
            >
              When you create one, your groups will be displayed here
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
