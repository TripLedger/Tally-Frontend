"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, Copy, Share } from "lucide-react";
import { InviteLinkIcon } from "@/features/trips/InviteLinkIcon";
import { getInviteDisplayUrl, getInviteUrl } from "@/features/trips/inviteUrl";
import { cn } from "@/lib/utils";
import { useActiveTrip, useAddToast, useTripStore, useTrips } from "@/store";

interface InvitePageProps {
  params: { tripId: string };
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]";

function InvitePageContent({ tripId }: { tripId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCreate = searchParams.get("from") === "create";

  const activeTrip = useActiveTrip();
  const trips = useTrips();
  const addToast = useAddToast();
  const trip =
    activeTrip?.id === tripId
      ? activeTrip
      : trips.find((t) => t.id === tripId) ?? null;

  useEffect(() => {
    if (activeTrip?.id === tripId) return;
    void useTripStore.getState().fetchTripDetail(tripId);
  }, [tripId, activeTrip?.id]);

  const tripName = trip?.name ?? "Your trip";
  const inviteToken = trip?.inviteToken ?? "";
  const inviteUrl = inviteToken ? getInviteUrl(inviteToken) : "";
  const displayUrl = inviteToken ? getInviteDisplayUrl(inviteToken) : "";

  const [copied, setCopied] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

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

    setFlashing(false);
    requestAnimationFrame(() => setFlashing(true));
    setCopied(true);
    addToast({ message: "Link copied", variant: "success", duration: 2500 });

    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => {
      setCopied(false);
      setFlashing(false);
    }, 1500);
  }, [inviteUrl, copyInviteUrl, addToast]);

  const handleShare = useCallback(async () => {
    if (!inviteUrl) return;

    const shareData: ShareData = {
      title: "Join my trip on Tally",
      text: `Join my trip on Tally: ${tripName}`,
      url: inviteUrl,
    };

    // Prefer native share sheet. Skip canShare — it's overly strict on many browsers
    // (e.g. desktop Chrome reports share exists but canShare returns false).
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User dismissed the sheet — do nothing (do not copy).
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Share failed for another reason — fall through to clipboard fallback.
      }
    }

    // Fallback only when share is unavailable or failed: copy the URL.
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
  }, [inviteUrl, tripName, copyInviteUrl, addToast]);

  const goToTrip = () => {
    router.push(`/trips/${tripId}`);
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#0A0A0F]">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-[#ffffff0f] bg-[#0A0A0F] safe-top">
        <Link
          href={`/trips/${tripId}`}
          aria-label="Back to trip"
          className={cn(
            "ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[#F8F8FF]",
            "transition-colors hover:bg-[#1C1C27]",
            focusRing
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>

        <h1 className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold text-[#F8F8FF]">
          Invite your crew
        </h1>

        {fromCreate ? (
          <Link
            href={`/trips/${tripId}`}
            className={cn(
              "absolute right-4 text-[15px] font-medium text-[#94A3B8]",
              "transition-colors hover:text-[#F8F8FF]",
              focusRing
            )}
          >
            Skip
          </Link>
        ) : (
          <div className="ml-auto mr-2 w-10" aria-hidden />
        )}
      </header>

      {/* Hero + link/share — mid page, matching Figma stack */}
      <div className="flex flex-1 flex-col px-6 pb-[120px] pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-[120px] w-[120px] items-center justify-center">
            <div
              className="pointer-events-none absolute inset-[-12px] rounded-[32px] bg-[radial-gradient(circle_at_center,#7C3AED40_0%,transparent_70%)] animate-invite-glow"
              aria-hidden
            />
            <div
              className={cn(
                "relative flex h-[120px] w-[120px] items-center justify-center",
                "rounded-[24px] border border-[#ffffff0f] bg-[#13131A]",
                "animate-invite-icon-pop"
              )}
            >
              <InviteLinkIcon className="h-12 w-12" />
            </div>
          </div>

          <h2 className="mt-5 text-[22px] font-bold leading-tight text-[#F8F8FF]">
            {tripName} is ready
          </h2>
          <p className="mt-1.5 text-[15px] font-normal leading-relaxed text-[#94A3B8]">
            Share this link so everyone can join
          </p>
        </div>

        {/* Link field — full width, 56px, radius 12 */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!inviteUrl}
          aria-label={copied ? "Link copied" : "Copy invite link"}
          className={cn(
            "mt-10 flex h-14 w-full items-center overflow-hidden rounded-[12px]",
            "border border-[#ffffff0f] bg-[#13131A] px-4",
            "text-left transition-colors duration-fast ease-tally",
            focusRing,
            "disabled:opacity-50",
            flashing && "animate-invite-copy-flash"
          )}
        >
          <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-[#94A3B8]">
            {displayUrl || "Generating invite link…"}
          </span>

          <span
            className="mx-3 h-8 w-px shrink-0 bg-[#ffffff0f]"
            aria-hidden
          />

          <span className="flex shrink-0 items-center gap-2 text-[14px] font-semibold">
            {copied ? (
              <>
                <span className="text-[#10B981]">Copied</span>
                <Check className="h-4 w-4 text-[#10B981] animate-check-pop" />
              </>
            ) : (
              <>
                <span className="text-[#F8F8FF]">Copy</span>
                <Copy className="h-4 w-4 text-[#F8F8FF]" />
              </>
            )}
          </span>
        </button>

        {/* Share link — same width/height/radius as link field, 16px below */}
        <button
          type="button"
          onClick={handleShare}
          disabled={!inviteUrl}
          className={cn(
            "mt-4 flex h-14 w-full items-center justify-center gap-2",
            "rounded-[12px] border border-[#ffffff0f] bg-transparent",
            "text-[15px] font-semibold text-[#F8F8FF]",
            "transition-all duration-fast ease-tally",
            "hover:bg-[#1C1C27] hover:border-[#ffffff1a]",
            "active:scale-[0.98] active:border-[#2563EB] active:bg-[#1C1C27]",
            focusRing,
            "disabled:opacity-50"
          )}
        >
          <Share className="h-[18px] w-[18px]" strokeWidth={2} />
          Share link
        </button>
      </div>

      {/* Go to trip — full width inside padded container, not edge-to-edge */}
      <div className="fixed bottom-6 left-0 right-0 z-20 mx-auto w-full max-w-mobile px-6 safe-bottom">
        <button
          type="button"
          onClick={goToTrip}
          className={cn(
            "flex h-14 w-full items-center justify-center rounded-[12px]",
            "bg-accent-gradient text-[16px] font-semibold text-[#F8F8FF]",
            "shadow-[0_4px_20px_#7C3AED40]",
            "transition-all duration-default ease-tally active:scale-[0.98]",
            focusRing
          )}
        >
          Go to trip
        </button>
      </div>
    </div>
  );
}

function InvitePageFallback() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0A0A0F]">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-[#ffffff0f] bg-[#0A0A0F] safe-top">
        <div className="ml-2 w-10" aria-hidden />
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold text-[#F8F8FF]">
          Invite your crew
        </h1>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <span
          className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white"
          style={{ animationDuration: "800ms" }}
        />
      </div>
    </div>
  );
}

export default function InvitePage({ params }: InvitePageProps) {
  return (
    <Suspense fallback={<InvitePageFallback />}>
      <InvitePageContent tripId={params.tripId} />
    </Suspense>
  );
}
