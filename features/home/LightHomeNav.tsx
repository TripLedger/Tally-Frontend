"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/dashboard",
    label: "Home",
    icon: "/tabr/home/icons/home-active.svg",
  },
  {
    href: "/dashboard#your-groups",
    label: "Groups",
    icon: "/tabr/home/icons/people.svg",
  },
  {
    href: "/balances",
    label: "Wallet",
    icon: "/tabr/home/icons/wallet.svg",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "/tabr/home/icons/profile.svg",
  },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function LightHomeNav() {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-white",
        "border-t border-[#F0EEF5]",
        "safe-bottom",
        "md:left-1/2 md:right-auto md:w-full md:max-w-mobile md:-translate-x-1/2"
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-mobile items-center justify-around px-2 sm:px-4">
        {tabs.map((tab, index) => {
          const isHomeTab = index === 0;
          const isActive = isHomeTab;

          return (
            <Link
              key={`${tab.label}-${tab.icon}`}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-[10px]",
                "transition-transform duration-fast ease-tally active:scale-95",
                isActive && "bg-[#6C4CF1]/[0.12]",
                focusRing
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tab.icon}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4"
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
