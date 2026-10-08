"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "home" | "groups" | "explore" | "wallet" | "profile";

const tabs: {
  id: TabId;
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "home", href: "/dashboard", label: "Home", Icon: Home },
  {
    id: "groups",
    href: "/dashboard#your-groups",
    label: "Groups",
    Icon: Users,
  },
  { id: "explore", href: "/explore", label: "Explore", Icon: Search },
  { id: "wallet", href: "/balances", label: "Wallet", Icon: Wallet },
  { id: "profile", href: "/profile", label: "Profile", Icon: User },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function isGroupDetailPath(pathname: string): boolean {
  return /^\/trips\/[^/]+$/.test(pathname);
}

function isExploreFlowPath(pathname: string): boolean {
  return (
    pathname === "/explore" ||
    pathname.startsWith("/explore/") ||
    /^\/trips\/[^/]+\/trips\/new/.test(pathname)
  );
}

function isTabActive(id: TabId, pathname: string, hash: string): boolean {
  switch (id) {
    case "home":
      return pathname === "/dashboard" && hash !== "#your-groups";
    case "groups":
      return (
        (pathname === "/dashboard" && hash === "#your-groups") ||
        isGroupDetailPath(pathname)
      );
    case "explore":
      return isExploreFlowPath(pathname);
    case "wallet":
      return pathname === "/balances" || pathname.startsWith("/balances/");
    case "profile":
      return pathname === "/profile" || pathname.startsWith("/profile/");
    default:
      return false;
  }
}

function scrollToGroups() {
  requestAnimationFrame(() => {
    document
      .getElementById("your-groups")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function LightHomeNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 overflow-visible",
        "rounded-t-[28px] bg-white",
        "shadow-[0_-8px_28px_rgba(21,19,26,0.08)]",
        "safe-bottom",
        "md:left-1/2 md:right-auto md:w-full md:max-w-mobile md:-translate-x-1/2"
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[72px] max-w-mobile items-end justify-between px-2 pb-2.5 sm:px-3">
        {tabs.map((tab) => {
          const active = isTabActive(tab.id, pathname, hash);
          const Icon = tab.Icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              aria-label={tab.label}
              onClick={() => {
                if (tab.id === "home") {
                  window.history.replaceState(null, "", "/dashboard");
                  setHash("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (tab.id === "groups") {
                  setHash("#your-groups");
                  if (pathname === "/dashboard") {
                    scrollToGroups();
                  }
                }
              }}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-end gap-1",
                "pt-8 transition-transform duration-150 active:scale-[0.97]",
                focusRing
              )}
            >
              {active ? (
                <span
                  className={cn(
                    "absolute left-1/2 top-[-22px] flex -translate-x-1/2",
                    "h-[58px] w-[58px] items-start justify-center gap-[10px]",
                    "rounded-[29px] bg-[var(--primary-500,#8B5CF6)] p-[17px]",
                    "text-white shadow-[0_8px_20px_rgba(139,92,246,0.35)]"
                  )}
                  aria-hidden
                >
                  <Icon className="h-6 w-6 shrink-0" strokeWidth={2} />
                </span>
              ) : (
                <span
                  className="mb-0.5 flex h-6 w-6 items-center justify-center text-[#8E8E93]"
                  aria-hidden
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
              )}

              <span
                className={cn(
                  "[font-family:var(--font-definitions-font-family-body,Geist)]",
                  "text-[11px] leading-4 tracking-[0]",
                  active
                    ? "font-medium text-[#15131A]"
                    : "font-normal text-[#8E8E93]"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
