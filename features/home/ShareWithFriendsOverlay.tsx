"use client";

import {
  Copy,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import {
  getInviteBrandedPath,
  useInviteShare,
} from "@/features/trips";
import { LightHomeOverlay } from "./LightHomeOverlay";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const SHARE_CONTACTS = [
  {
    id: "laura",
    name: "Laura Scott",
    avatar: "/tabr/home/avatars/14.png",
    badge: "messenger",
  },
  {
    id: "fred",
    name: "Fred Tunde",
    avatar: "/tabr/home/avatars/21.png",
    badge: "whatsapp",
  },
  {
    id: "francis",
    name: "Francis House",
    sublabel: "2 People",
    avatar: "/tabr/home/avatars/15.png",
    badge: "whatsapp",
  },
  {
    id: "first",
    name: "First Last",
    avatar: "/tabr/home/avatars/18.png",
    badge: "imessage",
  },
] as const;

const SHARE_APPS = [
  {
    id: "message" as const,
    label: "Message",
    className: "bg-[#34C759]",
    icon: MessageCircle,
  },
  {
    id: "mail" as const,
    label: "Mail",
    className: "bg-gradient-to-br from-[#5AC8FA] to-[#007AFF]",
    icon: Mail,
  },
  {
    id: "messenger" as const,
    label: "Messenger",
    className: "bg-gradient-to-br from-[#A855F7] via-[#EC4899] to-[#F97316]",
    icon: Send,
  },
  {
    id: "whatsapp" as const,
    label: "Whatsapp",
    className: "bg-[#25D366]",
    icon: MessageCircle,
  },
  {
    id: "twitter" as const,
    label: "Twit",
    className: "bg-[#1DA1F2]",
    icon: Send,
  },
] as const;

function ChannelBadge({ channel }: { channel: string }) {
  const styles =
    channel === "messenger"
      ? "bg-gradient-to-br from-[#A855F7] to-[#EC4899]"
      : channel === "whatsapp"
        ? "bg-[#25D366]"
        : "bg-[#34C759]";

  return (
    <span
      className={cn(
        "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center",
        "rounded-full border-2 border-white",
        styles
      )}
      aria-hidden
    >
      <MessageCircle className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
    </span>
  );
}

interface ShareWithFriendsOverlayProps {
  open: boolean;
  inviteToken: string;
  tripName: string;
  onClose?: () => void;
}

export function ShareWithFriendsOverlay({
  open,
  inviteToken,
  tripName,
  onClose,
}: ShareWithFriendsOverlayProps) {
  const brandedPath = inviteToken ? getInviteBrandedPath(inviteToken) : "";
  const { copied, handleCopy, handleNativeShare, openShareChannel } =
    useInviteShare({ inviteToken, tripName });

  return (
    <LightHomeOverlay
      open={open}
      onClose={onClose}
      ariaLabel="Share with friends"
      sheetClassName="max-h-[92dvh] overflow-y-auto px-5 pt-8 xs:px-6"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.02em] text-[#15131A]">
          Share with friends
        </h2>
        <p className="text-tabr-ink-paragraph-mini-secondary mt-1.5 max-w-[280px]">
          Start building experiences with your crew
        </p>
      </div>

      <button
        type="button"
        onClick={() => void handleCopy()}
        disabled={!inviteToken}
        className={cn(
          "mt-6 flex w-full items-center gap-3 rounded-2xl bg-[#F5F5F7] px-4 py-3.5",
          "text-left transition-colors hover:bg-[#EFEFEF]",
          focusRing,
          "disabled:opacity-50"
        )}
        aria-label={copied ? "Link copied" : "Copy invite link"}
      >
        <span className="min-w-0 flex-1 truncate text-[14px] font-normal text-[#15131A]">
          {brandedPath || "Generating invite link…"}
        </span>
        <Copy className="h-[18px] w-[18px] shrink-0 text-[#8E8E93]" strokeWidth={1.75} />
      </button>

      <section className="mt-8" aria-labelledby="share-contacts-heading">
        <h3
          id="share-contacts-heading"
          className="text-tabr-ink-paragraph-medium text-left"
        >
          Share to contacts
        </h3>
        <ul className="mt-4 flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SHARE_CONTACTS.map((contact) => (
            <li key={contact.id} className="w-[72px] shrink-0">
              <button
                type="button"
                onClick={() => void handleNativeShare()}
                className={cn("flex w-full flex-col items-center", focusRing)}
              >
                <span className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={contact.avatar}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <ChannelBadge channel={contact.badge} />
                </span>
                <span className="text-tabr-ink-paragraph-mini mt-2 line-clamp-2 w-full text-center">
                  {contact.name}
                </span>
                {"sublabel" in contact && contact.sublabel ? (
                  <span className="text-tabr-ink-paragraph-mini-secondary mt-0.5">
                    {contact.sublabel}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="my-6 h-px w-full bg-[#E5E5E5]" aria-hidden />

      <section aria-labelledby="share-via-heading">
        <h3
          id="share-via-heading"
          className="text-tabr-ink-paragraph-medium text-left"
        >
          Share via
        </h3>
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SHARE_APPS.map((app) => {
            const Icon = app.icon;
            return (
              <li key={app.id} className="w-[64px] shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (app.id === "messenger") {
                      void handleNativeShare();
                      return;
                    }
                    openShareChannel(
                      app.id === "twitter"
                        ? "twitter"
                        : app.id === "whatsapp"
                          ? "whatsapp"
                          : app.id
                    );
                  }}
                  className={cn("flex w-full flex-col items-center", focusRing)}
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-[16px]",
                      app.className
                    )}
                  >
                    <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />
                  </span>
                  <span className="text-tabr-ink-paragraph-mini-secondary mt-2 text-center">
                    {app.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-8 pt-2">
        <button
          type="button"
          onClick={() => void handleNativeShare()}
          disabled={!inviteToken}
          className={cn("w-full", authStackCtaClass(!!inviteToken), focusRing)}
        >
          Send
        </button>
      </div>
    </LightHomeOverlay>
  );
}
