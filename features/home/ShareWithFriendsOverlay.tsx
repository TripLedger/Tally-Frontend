"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Mail,
  MessageCircle,
  Plus,
  Send,
  UserRound,
} from "lucide-react";
import { authStackCtaClass } from "@/features/auth";
import {
  getInviteBrandedPath,
  useDeviceContacts,
  useInviteShare,
  type DeviceContact,
  type ShareChannel,
} from "@/features/trips";
import { LightHomeOverlay } from "./LightHomeOverlay";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const SHARE_APPS: {
  id: ShareChannel;
  label: string;
  className: string;
  icon: typeof MessageCircle;
}[] = [
  {
    id: "message",
    label: "Message",
    className: "bg-[#34C759]",
    icon: MessageCircle,
  },
  {
    id: "mail",
    label: "Mail",
    className: "bg-gradient-to-br from-[#5AC8FA] to-[#007AFF]",
    icon: Mail,
  },
  {
    id: "messenger",
    label: "Messenger",
    className: "bg-gradient-to-br from-[#A855F7] via-[#EC4899] to-[#F97316]",
    icon: Send,
  },
  {
    id: "whatsapp",
    label: "Whatsapp",
    className: "bg-[#25D366]",
    icon: MessageCircle,
  },
  {
    id: "twitter",
    label: "Twitter",
    className: "bg-[#1DA1F2]",
    icon: Send,
  },
];

function ContactAvatar({
  contact,
  selected,
}: {
  contact: DeviceContact;
  selected?: boolean;
}) {
  return (
    <span className="relative">
      {contact.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={contact.avatarUrl}
          alt=""
          width={56}
          height={56}
          className={cn(
            "h-14 w-14 rounded-full object-cover",
            selected && "ring-2 ring-[#8B5CF6] ring-offset-2"
          )}
        />
      ) : (
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-[#EDE9FE] text-[#8B5CF6]",
            selected && "ring-2 ring-[#8B5CF6] ring-offset-2"
          )}
        >
          <UserRound className="h-6 w-6" strokeWidth={1.75} />
        </span>
      )}
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
  const {
    copied,
    canNativeShare,
    handleCopy,
    handleNativeShare,
    openShareChannel,
    shareWithContact,
  } = useInviteShare({ inviteToken, tripName });
  const { supported, contacts, picking, error, pickContacts } =
    useDeviceContacts();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedContacts = useMemo(
    () => contacts.filter((c) => selectedIds.includes(c.id)),
    [contacts, selectedIds]
  );

  const toggleContact = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!inviteToken) return;

    if (selectedContacts.length === 1) {
      await shareWithContact(selectedContacts[0]);
      return;
    }

    if (selectedContacts.length > 1) {
      // Multi-select: open system share sheet with the invite link.
      await handleNativeShare();
      return;
    }

    await handleNativeShare();
  };

  return (
    <LightHomeOverlay
      open={open}
      onClose={onClose}
      ariaLabel="Share with friends"
      sheetClassName="max-h-[92dvh] overflow-y-auto px-5 pt-8 xs:px-6"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-tabr-ink-paragraph-large-medium w-full">
          Share with friends
        </h2>
        <p
          className={cn(
            "mt-1 w-full text-center",
            "font-[family-name:var(--font-definitions-font-family-body,Geist)]",
            "text-[length:var(--paragraph-large-font-size,18px)] font-medium",
            "leading-[var(--paragraph-large-line-height,27px)]",
            "text-[var(--text-secondary-500,#716D7D)]"
          )}
        >
          Start building experiences with your crew
        </p>
      </div>

      <div className="my-5 h-px w-full bg-[#E5E5E5]" aria-hidden />

      <button
        type="button"
        onClick={() => void handleCopy()}
        disabled={!inviteToken}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3",
          "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
          "text-left transition-colors hover:bg-[#FAFAFA]",
          focusRing,
          "disabled:opacity-50",
          copied && "border-[#10B981]/40 bg-[#ECFDF5]"
        )}
        aria-label={copied ? "Invite link copied" : "Copy invite link"}
      >
        <span
          className={cn(
            "h-[22px] min-w-0 flex-1 truncate",
            "text-[16px] font-normal leading-[22px] tracking-[-0.408px] text-black",
            "[font-feature-settings:'case'_on]"
          )}
        >
          {brandedPath || "Generating invite link…"}
        </span>
        {copied ? (
          <Check
            className="h-[18px] w-[18px] shrink-0 text-[#10B981]"
            strokeWidth={2.25}
            aria-hidden
          />
        ) : (
          <Copy
            className="h-[18px] w-[18px] shrink-0 text-[#8E8E93]"
            strokeWidth={1.75}
            aria-hidden
          />
        )}
      </button>

      <section className="mt-8" aria-labelledby="share-contacts-heading">
        <div className="flex items-center justify-between gap-3">
          <h3
            id="share-contacts-heading"
            className="text-tabr-ink-paragraph-medium text-left"
          >
            Share to contacts
          </h3>
          {supported ? (
            <button
              type="button"
              onClick={() => void pickContacts()}
              disabled={picking}
              className={cn(
                "shrink-0 text-[13px] font-medium text-[#8B5CF6]",
                "disabled:opacity-60",
                focusRing
              )}
            >
              {picking ? "Opening…" : contacts.length ? "Add more" : "Choose"}
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="mt-2 text-left text-[13px] leading-5 text-[#F43F5E]">
            {error}
          </p>
        ) : null}

        {contacts.length > 0 ? (
          <ul className="mt-4 flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {contacts.map((contact) => {
              const selected = selectedIds.includes(contact.id);
              return (
                <li key={contact.id} className="w-[72px] shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleContact(contact.id)}
                    onDoubleClick={() => void shareWithContact(contact)}
                    className={cn("flex w-full flex-col items-center", focusRing)}
                    aria-pressed={selected}
                  >
                    <ContactAvatar contact={contact} selected={selected} />
                    <span className="text-tabr-ink-paragraph-mini mt-2 line-clamp-2 w-full text-center">
                      {contact.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (supported) {
                void pickContacts();
                return;
              }
              void handleNativeShare();
            }}
            disabled={picking || !inviteToken}
            className={cn(
              "mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#D4D4D8] bg-[#FAFAFA] px-4 py-3.5",
              "text-left transition-colors hover:bg-[#F4F4F5]",
              focusRing,
              "disabled:opacity-50"
            )}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#8B5CF6] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <Plus className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-medium text-[#15131A]">
                {supported
                  ? "Choose from your contacts"
                  : canNativeShare
                    ? "Share with someone on this device"
                    : "Copy the link to invite friends"}
              </span>
              <span className="mt-0.5 block text-[12px] leading-4 text-[#716D7D]">
                {supported
                  ? "Photos and names come from your phone — nothing is uploaded."
                  : canNativeShare
                    ? "Opens your phone’s share sheet with installed apps."
                    : "Contact access isn’t available in this browser."}
              </span>
            </span>
          </button>
        )}
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
                    const target = selectedContacts[0];
                    openShareChannel(app.id, target);
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
                  <span className="text-tabr-ink-paragraph-mini-secondary mt-2 truncate text-center">
                    {app.label}
                  </span>
                </button>
              </li>
            );
          })}
          {canNativeShare ? (
            <li className="w-[64px] shrink-0">
              <button
                type="button"
                onClick={() => void handleNativeShare()}
                className={cn("flex w-full flex-col items-center", focusRing)}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#15131A]">
                  <Send className="h-7 w-7 text-white" strokeWidth={1.75} />
                </span>
                <span className="text-tabr-ink-paragraph-mini-secondary mt-2 text-center">
                  More
                </span>
              </button>
            </li>
          ) : null}
        </ul>
      </section>

      <div className="mt-8 pt-2">
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!inviteToken}
          className={cn("w-full", authStackCtaClass(!!inviteToken), focusRing)}
        >
          Send
        </button>
      </div>
    </LightHomeOverlay>
  );
}
