"use client";

import { usePathname } from "next/navigation";

/** Light Figma chrome on home, create-group, and group detail (Friends/Trips). */
export function useLightHomeChrome() {
  const pathname = usePathname();

  return (
    pathname === "/trips/new" ||
    pathname === "/trips/new/cover" ||
    pathname === "/dashboard" ||
    /^\/trips\/[^/]+$/.test(pathname) ||
    /^\/trips\/[^/]+\/trips\/[^/]+$/.test(pathname)
  );
}
