"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LightHomeNav, useLightHomeChrome } from "@/features/home";
import { cn } from "@/lib/utils";
import { BottomNav } from "./BottomNav";

interface MobileShellProps {
  children: ReactNode;
  showNav?: boolean;
}

// Full-screen sub-flows that manage their own header + pinned CTA.
function isImmersiveRoute(pathname: string): boolean {
  return (
    pathname === "/trips/new" ||
    /^\/trips\/[^/]+\/invite$/.test(pathname) ||
    /^\/trips\/[^/]+\/expenses\/new$/.test(pathname) ||
    /^\/trips\/[^/]+\/expenses\/[^/]+$/.test(pathname)
  );
}

export function MobileShell({ children, showNav = true }: MobileShellProps) {
  const pathname = usePathname();
  const navVisible = showNav && !isImmersiveRoute(pathname);
  const lightHome = useLightHomeChrome();

  return (
    <div
      className={cn(
        "mobile-frame flex min-h-dvh flex-col",
        lightHome && "mobile-frame-light bg-[#FAFAFA]"
      )}
    >
      <main className={navVisible ? "flex min-h-0 flex-1 flex-col pb-20" : "flex-1"}>
        {children}
      </main>
      {navVisible && (lightHome ? <LightHomeNav /> : <BottomNav />)}
    </div>
  );
}
