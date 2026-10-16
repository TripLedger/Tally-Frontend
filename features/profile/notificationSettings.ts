export type NotificationPrefKey = "settlements" | "groupsTrips" | "explore";

export interface NotificationPrefs {
  settlements: boolean;
  groupsTrips: boolean;
  explore: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  settlements: true,
  groupsTrips: true,
  explore: true,
};

const STORAGE_KEY = "tabr.notificationPrefs";

export function readNotificationPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_PREFS;
    const parsed = JSON.parse(raw) as Partial<NotificationPrefs>;
    return {
      settlements: Boolean(parsed.settlements ?? true),
      groupsTrips: Boolean(parsed.groupsTrips ?? true),
      explore: Boolean(parsed.explore ?? true),
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

export function writeNotificationPrefs(prefs: NotificationPrefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore quota / private mode */
  }
}
