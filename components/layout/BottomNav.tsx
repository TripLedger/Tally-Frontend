"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Plus, Scale, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveTrip } from "@/store";

const tabs = [
  { href: "/dashboard", label: "Trips", icon: Map },
  { href: "/add", label: "Add", icon: Plus, isFab: true },
  { href: "/balances", label: "Balances", icon: Scale },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const activeTrip = useActiveTrip();

  const addHref =
    activeTrip && pathname.startsWith("/trips/")
      ? `/trips/${activeTrip.id}/expenses/new`
      : "/add";

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "border-t border-border-glass bg-background/95 backdrop-blur-lg",
        "safe-bottom"
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-mobile items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/dashboard"
              ? pathname === "/dashboard" || pathname.startsWith("/trips")
              : pathname.startsWith(tab.href);

          if ("isFab" in tab && tab.isFab) {
            return (
              <Link
                key={tab.href}
                href={addHref}
                className={cn(
                  "relative -mt-6 flex h-14 w-14 items-center justify-center",
                  "rounded-pill bg-accent-gradient shadow-glow",
                  "transition-transform duration-fast ease-tally active:scale-95"
                )}
                aria-label="Add expense"
              >
                <tab.icon className="h-6 w-6 text-white" strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1",
                "transition-colors duration-fast ease-tally",
                isActive ? "text-accent-violet" : "text-text-disabled"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
