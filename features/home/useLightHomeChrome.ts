"use client";

import { usePathname } from "next/navigation";

/** Light Figma chrome on home (empty + existing) and create-group. */
export function useLightHomeChrome() {
  const pathname = usePathname();

  return pathname === "/trips/new" || pathname === "/dashboard";
}
