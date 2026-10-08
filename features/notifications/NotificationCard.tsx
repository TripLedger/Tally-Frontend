"use client";

import {
  AlertCircle,
  Check,
  DollarSign,
  MoreVertical,
  Send,
} from "lucide-react";
import {
  formatNotificationMessage,
  formatNotificationTime,
} from "@/features/notifications/format";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";
import { NotificationActionMenu } from "./NotificationActionMenu";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

function TypeIcon({ type }: { type: NotificationType }) {
  const config =
    type === "expense_logged"
      ? { bg: "#E8F1FF", fg: "#3B82F6", Icon: DollarSign }
      : type === "settlement_confirmed"
        ? { bg: "#E8F8EF", fg: "#22C55E", Icon: Check }
        : type === "member_joined"
          ? { bg: "#EDE9FE", fg: "#8B5CF6", Icon: Send }
          : { bg: "#FEE2E2", fg: "#F43F5E", Icon: AlertCircle };

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
      style={{ backgroundColor: config.bg }}
      aria-hidden
    >
      <config.Icon
        className="h-4 w-4"
        style={{ color: config.fg }}
        strokeWidth={2.25}
      />
    </span>
  );
}

interface NotificationCardProps {
  notification: Notification;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpen: (notification: Notification) => void;
  onMarkRead: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

export function NotificationCard({
  notification,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpen,
  onMarkRead,
  onDelete,
}: NotificationCardProps) {
  const unread = !notification.read;
  const title = formatNotificationMessage(notification);
  const subtitle = formatNotificationTime(notification.createdAt);

  return (
    <div className="relative flex items-center gap-2.5 py-3.5">
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          unread ? "bg-[#8B5CF6]" : "bg-transparent"
        )}
        aria-hidden
      />

      <button
        type="button"
        onClick={() => onOpen(notification)}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3 text-left",
          "rounded-[12px] transition-opacity active:opacity-80",
          focusRing
        )}
      >
        <TypeIcon type={notification.type} />
        <span className="min-w-0 flex-1">
          <span className="text-tabr-notif-title line-clamp-2 block">
            {title}
          </span>
          <span className="text-tabr-ink-paragraph-mini-secondary mt-0.5 block truncate">
            {subtitle}
          </span>
        </span>
      </button>

      <div className="relative shrink-0">
        <button
          type="button"
          aria-label={`Actions for ${title}`}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-[#8E8E93]",
            "transition-colors hover:bg-[#F0EEF5] hover:text-[#15131A]",
            focusRing
          )}
        >
          <MoreVertical className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
        <NotificationActionMenu
          open={menuOpen}
          onClose={onCloseMenu}
          ariaLabel="Notification actions"
          items={[
            {
              label: "Mark as read",
              onClick: () => onMarkRead(notification),
            },
            {
              label: "Delete",
              onClick: () => onDelete(notification),
              destructive: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
