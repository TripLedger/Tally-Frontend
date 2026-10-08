"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { AuthBackButton } from "@/features/auth";
import {
  useNotificationStore,
  useNotifications,
  useNotificationsLoading,
  useUser,
} from "@/store";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { NotificationActionMenu } from "./NotificationActionMenu";
import { NotificationCard } from "./NotificationCard";
import { NotificationsEmptyState } from "./NotificationsEmptyState";
import { NotificationsSkeleton } from "./NotificationsSkeleton";
import {
  notificationGroup,
  notificationHref,
  type NotificationGroupKey,
} from "./format";

const geistClass =
  "[font-family:var(--font-definitions-font-family-body,Geist)]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

const GROUP_ORDER: NotificationGroupKey[] = [
  "today",
  "yesterday",
  "this_week",
];

const GROUP_LABEL: Record<NotificationGroupKey, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This week",
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-tabr-ink-paragraph-mini-secondary mb-1 font-medium">
      {children}
    </p>
  );
}

/**
 * Light Notifications screen (Figma) — empty card, grouped list,
 * header + per-row ⋮ menus.
 */
export function NotificationsScreen() {
  const router = useRouter();
  const user = useUser();
  const notifications = useNotifications();
  const isLoading = useNotificationsLoading();
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const markOneRead = useNotificationStore((s) => s.markOneRead);
  const deleteOne = useNotificationStore((s) => s.deleteOne);
  const clearAll = useNotificationStore((s) => s.clearAll);
  /** `header` | notification id | null — only one ⋮ menu open at a time. */
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const userId = user?.id;
  const headerMenuOpen = openMenuId === "header";

  const refresh = useCallback(() => {
    if (!userId) return;
    void fetchNotifications(userId);
  }, [userId, fetchNotifications]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  const groups = useMemo(() => {
    const buckets: Record<NotificationGroupKey, Notification[]> = {
      today: [],
      yesterday: [],
      this_week: [],
    };
    for (const n of notifications) {
      buckets[notificationGroup(n.createdAt)].push(n);
    }
    return buckets;
  }, [notifications]);

  const handleOpen = async (notification: Notification) => {
    if (!userId) return;
    await markOneRead(userId, notification.id);
    router.push(notificationHref(notification));
  };

  const handleMarkRead = (notification: Notification) => {
    if (!userId) return;
    void markOneRead(userId, notification.id);
  };

  const handleDelete = (notification: Notification) => {
    if (!userId) return;
    void deleteOne(userId, notification.id);
  };

  const handleMarkAll = () => {
    if (!userId) return;
    void markAllRead(userId);
  };

  const handleClearAll = () => {
    if (!userId) return;
    void clearAll(userId);
  };

  const showSkeleton = isLoading && notifications.length === 0;
  const hasAny = GROUP_ORDER.some((key) => groups[key].length > 0);

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(6rem,calc(var(--safe-bottom)+5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/dashboard" label="Back to home" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <h1 className="text-tabr-ink-heading-2 min-w-0">Notifications</h1>
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Notification options"
            aria-expanded={headerMenuOpen}
            aria-haspopup="menu"
            onClick={() =>
              setOpenMenuId((id) => (id === "header" ? null : "header"))
            }
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-[#15131A]",
              "transition-colors hover:bg-[#F0EEF5]",
              focusRing
            )}
          >
            <MoreVertical className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
          <NotificationActionMenu
            open={headerMenuOpen}
            onClose={() => setOpenMenuId(null)}
            ariaLabel="Notification list actions"
            items={[
              { label: "Mark all as read", onClick: handleMarkAll },
              {
                label: "Clear all",
                onClick: handleClearAll,
                destructive: true,
              },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        {showSkeleton ? (
          <NotificationsSkeleton />
        ) : !hasAny ? (
          <NotificationsEmptyState />
        ) : (
          <div className="flex flex-col">
            {GROUP_ORDER.map((key, sectionIndex) => {
              const list = groups[key];
              if (list.length === 0) return null;

              const priorVisible = GROUP_ORDER.slice(0, sectionIndex).some(
                (k) => groups[k].length > 0
              );

              return (
                <section
                  key={key}
                  aria-label={GROUP_LABEL[key]}
                  className={cn(priorVisible && "mt-1")}
                >
                  {priorVisible ? (
                    <div className="mb-4 h-px w-full bg-[#EFEFEF]" aria-hidden />
                  ) : null}
                  <SectionHeader>{GROUP_LABEL[key]}</SectionHeader>
                  <div className="flex flex-col">
                    {list.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        menuOpen={openMenuId === n.id}
                        onToggleMenu={() =>
                          setOpenMenuId((id) => (id === n.id ? null : n.id))
                        }
                        onCloseMenu={() => setOpenMenuId(null)}
                        onOpen={handleOpen}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
