import { generateId } from "@/lib/utils";
import type {
  Notification,
  NotificationPayload,
  NotificationType,
} from "@/types";

const memoryByUser = new Map<string, Notification[]>();

function memoryList(userId: string): Notification[] {
  return [...(memoryByUser.get(userId) ?? [])].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function memoryUpsertMany(items: Notification[]) {
  for (const item of items) {
    const list = memoryByUser.get(item.userId) ?? [];
    memoryByUser.set(item.userId, [
      item,
      ...list.filter((n) => n.id !== item.id),
    ]);
  }
}

export function buildNotificationRecord(params: {
  userId: string;
  type: NotificationType;
  tripId: string;
  tripName: string;
  actorId: string;
  actorName: string;
  actorAvatarUrl?: string;
  payload?: NotificationPayload;
  id?: string;
  createdAt?: string;
  read?: boolean;
}): Notification {
  return {
    id: params.id ?? generateId(),
    userId: params.userId,
    type: params.type,
    tripId: params.tripId,
    tripName: params.tripName,
    actorId: params.actorId,
    actorName: params.actorName,
    actorAvatarUrl: params.actorAvatarUrl,
    payload: params.payload ?? {},
    read: params.read ?? false,
    createdAt: params.createdAt ?? new Date().toISOString(),
  };
}

/**
 * Batch-write notifications. Failures are logged by the caller —
 * never throw into the expense/join/settlement critical path.
 */
export async function writeNotifications(
  items: Notification[]
): Promise<void> {
  if (items.length === 0) return;
  memoryUpsertMany(items);
}

export async function fetchNotificationsForUser(
  userId: string,
  limit = 50
): Promise<Notification[]> {
  return memoryList(userId).slice(0, limit);
}

export async function markNotificationsRead(
  userId: string,
  notificationIds?: string[]
): Promise<void> {
  const existing = memoryList(userId);
  const targetSet = notificationIds ? new Set(notificationIds) : null;

  memoryByUser.set(
    userId,
    existing.map((n) =>
      !targetSet || targetSet.has(n.id) ? { ...n, read: true } : n
    )
  );
}
