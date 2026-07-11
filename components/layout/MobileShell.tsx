"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
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

  return (
    <div className="mobile-frame flex min-h-dvh flex-col">
      <main className={navVisible ? "flex-1 pb-20" : "flex-1"}>{children}</main>
      {navVisible && <BottomNav />}
    </div>
  );
}
