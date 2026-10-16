"use client";

import { useState } from "react";
import { AuthBackButton } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useT } from "@/store/localeStore";
import {
  readNotificationPrefs,
  writeNotificationPrefs,
  type NotificationPrefKey,
  type NotificationPrefs,
} from "./notificationSettings";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/** iOS-style on/off switch matching Figma (green when on). */
function PrefToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative isolate h-8 w-[52px] shrink-0 rounded-full border-0 p-0",
        "transition-colors duration-200 ease-out",
        checked ? "bg-[#34C759]" : "bg-[#E5E5EA]",
        focusRing
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-0.5 left-0.5 block h-7 w-7 rounded-full bg-white",
          "shadow-[0_1px_2px_rgba(0,0,0,0.28)]",
          "transition-transform duration-200 ease-out",
          checked && "translate-x-[20px]"
        )}
        aria-hidden
      />
    </button>
  );
}

/**
 * Figma — Notification settings (Profile → Notifications).
 * Inbox/history stays on the bell → /notifications.
 */
export function NotificationSettingsScreen() {
  const t = useT();
  const [prefs, setPrefs] = useState<NotificationPrefs>(() =>
    readNotificationPrefs()
  );

  const rows: {
    key: NotificationPrefKey;
    title: string;
    description: string;
  }[] = [
    {
      key: "settlements",
      title: t.notifications.settlements,
      description: t.notifications.settlementsDesc,
    },
    {
      key: "groupsTrips",
      title: t.notifications.groupsTrips,
      description: t.notifications.groupsTripsDesc,
    },
    {
      key: "explore",
      title: t.notifications.explore,
      description: t.notifications.exploreDesc,
    },
  ];

  const setPref = (key: NotificationPrefKey, value: boolean) => {
    setPrefs((current) => {
      const next = { ...current, [key]: value };
      writeNotificationPrefs(next);
      return next;
    });
  };

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(2rem,calc(var(--safe-bottom)+1.5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/profile" label={t.common.back} />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">{t.notifications.title}</h1>

      <div className="mt-6 flex flex-col">
        {rows.map((row) => (
          <div key={row.key} className="border-b border-[#F0F0F2]">
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-[16px] font-semibold leading-6 text-[#15131A]">
                  {row.title}
                </p>
                <p className="mt-0.5 text-[13px] font-normal leading-5 text-[#8E8E93]">
                  {row.description}
                </p>
              </div>
              <PrefToggle
                checked={prefs[row.key]}
                onChange={(next) => setPref(row.key, next)}
                label={row.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
