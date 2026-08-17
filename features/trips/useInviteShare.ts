"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getInviteUrl } from "./inviteUrl";
import { useAddToast } from "@/store";

interface UseInviteShareOptions {
  inviteToken: string;
  tripName: string;
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
      });
      return;
    }

    setCopied(true);
    addToast({ message: "Link copied", variant: "success", duration: 2500 });

    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(false), 1500);
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
        message: "Link copied — sharing isn't available on this device",
        variant: "info",
        duration: 3000,
      });
    } else {
      addToast({
        message: "Couldn't share or copy the link. Please try again.",
        variant: "error",
      });
    }
  }, [inviteUrl, shareText, copyInviteUrl, addToast]);

  const openShareChannel = useCallback(
    (channel: "message" | "mail" | "whatsapp" | "twitter") => {
      if (!inviteUrl) return;

      const body = encodeURIComponent(`${shareText}\n${inviteUrl}`);

      switch (channel) {
        case "message":
          window.location.href = `sms:?&body=${body}`;
          break;
        case "mail":
          window.location.href = `mailto:?subject=${encodeURIComponent(
            shareText
          )}&body=${body}`;
          break;
        case "whatsapp":
          window.open(`https://wa.me/?text=${body}`, "_blank", "noopener,noreferrer");
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${body}`,
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

  return {
    inviteUrl,
    copied,
    handleCopy,
    handleNativeShare,
    openShareChannel,
  };
}
