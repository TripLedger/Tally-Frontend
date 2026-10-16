"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { AuthBackButton, authStackCtaClass } from "@/features/auth";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

/** Placeholder until funding account details come from the backend. */
const PLACEHOLDER_BANK = "Nombank MFB";
const PLACEHOLDER_ACCOUNT_NUMBER = "2398571120";

/**
 * Figma — Make a transfer (home balance card → Add).
 */
export function MakeTransferScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  const copyAccountNumber = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PLACEHOLDER_ACCOUNT_NUMBER);
    } catch {
      return;
    }

    setCopied(true);
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(4.5rem,calc(var(--safe-bottom)+3.5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/dashboard" label="Back to home" />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">Make a transfer</h1>
      <p className="text-tabr-ink-paragraph-small mt-2 max-w-[320px]">
        Transfer to the account below to complete your transaction
      </p>

      <section
        className={cn(
          "mt-8 w-full rounded-[24px] bg-white p-5",
          "shadow-[0_1px_3px_rgba(21,19,26,0.04)]"
        )}
        aria-label="Transfer account details"
      >
        <div>
          <p className="text-[13px] font-normal leading-5 text-[#AEAEB2]">
            Bank
          </p>
          <p className="mt-1 text-[16px] font-semibold leading-6 text-[#15131A]">
            {PLACEHOLDER_BANK}
          </p>
        </div>

        <div className="my-4 h-px w-full bg-[#F0F0F2]" aria-hidden />

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-normal leading-5 text-[#AEAEB2]">
              Account number
            </p>
            <p
              className="mt-1 text-[16px] font-semibold leading-6 tabular-nums text-[#15131A]"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {PLACEHOLDER_ACCOUNT_NUMBER}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void copyAccountNumber()}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-[10px] bg-[#F3F3F5] text-[#15131A]",
              "transition-transform duration-150 active:scale-95",
              focusRing
            )}
            aria-label={copied ? "Account number copied" : "Copy account number"}
          >
            {copied ? (
              <Check
                className="h-[18px] w-[18px] text-[#10B981]"
                strokeWidth={2.25}
                aria-hidden
              />
            ) : (
              <Copy className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </section>

      <div className="mt-auto shrink-0">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={cn("w-full", authStackCtaClass(true), focusRing)}
        >
          Done
        </button>
      </div>
    </div>
  );
}
