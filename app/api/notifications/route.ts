import { NextResponse } from "next/server";
import { z } from "zod";
import {
  fetchNotificationsForUser,
  markNotificationsRead,
} from "@/lib/db/notifications";

/**
 * GET /api/notifications?userId=… — list feed (newest first).
 * PATCH /api/notifications — { userId, ids?: string[] } mark read (omit ids = all).
 *
 * Open while auth is mock — userId is required until the real backend ships.
 */

export async function GET(request: Request) {
  const userId = new URL(request.url).searchParams.get("userId")?.trim();
  if (!userId) {
    return NextResponse.json(
      { ok: false, reason: "unauthorized" },
      { status: 401 }
    );
  }

  const notifications = await fetchNotificationsForUser(userId, 50);
  return NextResponse.json({
    ok: true,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  });
}

const patchSchema = z
  .object({
    userId: z.string().min(1),
    ids: z.array(z.string()).optional(),
  })
  .strict();

export async function PATCH(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation_error" },
      { status: 400 }
    );
  }

  await markNotificationsRead(parsed.data.userId, parsed.data.ids);
  return NextResponse.json({ ok: true });
}
