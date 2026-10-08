"use client";

import { usePathname } from "next/navigation";

/** Light Figma chrome on home, create-group, and group detail (Friends/Trips). */
export function useLightHomeChrome() {
  const pathname = usePathname();

  return (
    pathname === "/trips/new" ||
    pathname === "/trips/new/cover" ||
    pathname === "/dashboard" ||
    pathname === "/profile" ||
    pathname === "/notifications" ||
    pathname === "/explore" ||
    pathname === "/balances" ||
    pathname.startsWith("/balances/") ||
    /^\/trips\/[^/]+$/.test(pathname) ||
    /^\/trips\/[^/]+\/trips\/new$/.test(pathname) ||
    /^\/trips\/[^/]+\/trips\/new\/[^/]+$/.test(pathname) ||
    /^\/trips\/[^/]+\/trips\/new\/[^/]+\/group$/.test(pathname) ||
    /^\/trips\/[^/]+\/trips\/new\/[^/]+\/customise$/.test(pathname) ||
    /^\/trips\/[^/]+\/outings\/[^/]+$/.test(pathname) ||
    /^\/trips\/[^/]+\/outings\/[^/]+\/expenses(\/(scan|new|split(\/(equal|items|success))?))?$/.test(
      pathname
    ) ||
    /^\/trips\/[^/]+\/trips\/[^/]+$/.test(pathname)
  );
}
