"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getInviteUrl } from "./inviteUrl";
import { useAddToast } from "@/store";
import type { DeviceContact } from "./useDeviceContacts";

export type ShareChannel =
  | "message"
  | "mail"
  | "whatsapp"
  | "twitter"
  | "messenger";

interface UseInviteShareOptions {
  inviteToken: string;
  tripName: string;
}

function digitsOnly(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export function useInviteShare({ inviteToken, tripName }: UseInviteShareOptions) {
  const addToast = useAddToast();
  const inviteUrl = inviteToken ? getInviteUrl(inviteToken) : "";
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  const shareText = `Join ${tripName} on Tabr`;
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copyInviteUrl = useCallback(async () => {
    if (!inviteUrl) return false;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      return true;
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = inviteUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        return true;
      } catch {
        return false;
      }
    }
  }, [inviteUrl]);

  const handleCopy = useCallback(async () => {
    if (!inviteUrl) return;

    const ok = await copyInviteUrl();
    if (!ok) {
      addToast({
        message: "Couldn't copy the link. Please try again.",
        variant: "error",
        duration: 3000,
      });
      return;
    }

    setCopied(true);
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(false), 1800);
  }, [inviteUrl, copyInviteUrl, addToast]);

  const handleNativeShare = useCallback(async () => {
    if (!inviteUrl) return;

    const shareData: ShareData = {
      title: "Join my group on Tabr",
      text: shareText,
      url: inviteUrl,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    const ok = await copyInviteUrl();
    if (ok) {
      addToast({
        message: "Link copied — open your messages app to share it",
        variant: "info",
        duration: 3200,
      });
    } else {
      addToast({
        message: "Couldn't share or copy the link. Please try again.",
        variant: "error",
      });
    }
  }, [inviteUrl, shareText, copyInviteUrl, addToast]);

  const openShareChannel = useCallback(
    (channel: ShareChannel, contact?: DeviceContact) => {
      if (!inviteUrl) return;

      const body = `${shareText}\n${inviteUrl}`;
      const encodedBody = encodeURIComponent(body);
      const phone = contact?.tel ? digitsOnly(contact.tel) : "";
      const email = contact?.email?.trim() ?? "";

      switch (channel) {
        case "message": {
          const sms = phone
            ? `sms:${phone}?&body=${encodedBody}`
            : `sms:?&body=${encodedBody}`;
          window.location.href = sms;
          break;
        }
        case "mail": {
          const to = email ? encodeURIComponent(email) : "";
          window.location.href = `mailto:${to}?subject=${encodeURIComponent(
            shareText
          )}&body=${encodedBody}`;
          break;
        }
        case "whatsapp": {
          const wa = phone
            ? `https://wa.me/${phone.replace(/^\+/, "")}?text=${encodedBody}`
            : `https://wa.me/?text=${encodedBody}`;
          window.open(wa, "_blank", "noopener,noreferrer");
          break;
        }
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodedBody}`,
            "_blank",
            "noopener,noreferrer"
          );
          break;
        case "messenger":
          window.open(
            `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
              inviteUrl
            )}&redirect_uri=${encodeURIComponent(inviteUrl)}`,
            "_blank",
            "noopener,noreferrer"
          );
          break;
        default:
          void handleNativeShare();
      }
    },
    [inviteUrl, shareText, handleNativeShare]
  );

  /** Prefer SMS / email for a contact; otherwise fall back to the system share sheet. */
  const shareWithContact = useCallback(
    async (contact: DeviceContact) => {
      if (contact.tel) {
        openShareChannel("message", contact);
        return;
      }
      if (contact.email) {
        openShareChannel("mail", contact);
        return;
      }
      await handleNativeShare();
    },
    [openShareChannel, handleNativeShare]
  );

  return {
    inviteUrl,
    copied,
    canNativeShare,
    handleCopy,
    handleNativeShare,
    openShareChannel,
    shareWithContact,
  };
}
