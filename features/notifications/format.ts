import type {
  MemberJoinedPayload,
  Notification,
} from "@/types";

export type NotificationGroupKey = "today" | "yesterday" | "this_week";

/** Local-calendar day key using the user's timezone (not UTC). */
export function localDayKey(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const fmt = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  void now;
  return fmt.format(date);
}

export function isLocalToday(iso: string, now = new Date()): boolean {
  return localDayKey(iso) === localDayKey(now.toISOString());
}

export function isLocalYesterday(iso: string, now = new Date()): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return localDayKey(iso) === localDayKey(yesterday.toISOString());
}

export function notificationGroup(
  iso: string,
  now = new Date()
): NotificationGroupKey {
  if (isLocalToday(iso, now)) return "today";
  if (isLocalYesterday(iso, now)) return "yesterday";
  return "this_week";
}

function formatClock(date: Date): string {
  return date
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s/g, "")
    .toLowerCase();
}

/** Subtitle under the title — Figma uses time-of-day copy. */
export function formatNotificationTime(
  iso: string,
  now = new Date()
): string {
  const date = new Date(iso);
  const clock = formatClock(date);

  if (isLocalToday(iso, now)) {
    const hour = date.getHours();
    if (hour < 12) return `This morning at ${clock}`;
    if (hour < 17) return `This afternoon at ${clock}`;
    return `This evening at ${clock}`;
  }

  return clock;
}

/** Short headline — paragraph small/medium in the list. */
export function formatNotificationMessage(n: Notification): string {
  switch (n.type) {
    case "member_joined": {
      const payload = n.payload as MemberJoinedPayload;
      if (payload.recipientRole === "organizer") {
        return `${n.actorName} joined your trip`;
      }
      return `${n.actorName} joined ${n.tripName}`;
    }
    case "expense_logged":
      return `${n.actorName} added an expense`;
    case "settlement_confirmed":
      return `${n.actorName} settled up with you`;
    default:
      return "New activity";
  }
}

export function notificationHref(n: Notification): string {
  switch (n.type) {
    case "settlement_confirmed":
      return `/trips/${n.tripId}/balances`;
    case "expense_logged":
      return `/trips/${n.tripId}?tab=trips`;
    case "member_joined":
    default:
      return `/trips/${n.tripId}`;
  }
}
