"use client";

import { useEffect } from "react";
import { useUser } from "@/store";
import { useLocaleStore } from "@/store/localeStore";

/** Hydrate locale from localStorage, then soft-sync from user.language when present. */
export function LocaleHydrator() {
  const hydrate = useLocaleStore((s) => s.hydrate);
  const syncFromUserLanguage = useLocaleStore((s) => s.syncFromUserLanguage);
  const userLanguage = useUser()?.language;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    syncFromUserLanguage(userLanguage);
  }, [userLanguage, syncFromUserLanguage]);

  return null;
}
