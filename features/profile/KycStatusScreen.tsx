"use client";

import { AuthBackButton } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useUser } from "@/store";
import { useT } from "@/store/localeStore";
import {
  KYC_STATUS_COLOR,
  normalizeKycStatus,
  type KycStatus,
} from "./kyc";

/**
 * Figma — KYC status (Profile). Minimal for now; verification steps may land later.
 */
export function KycStatusScreen() {
  const user = useUser();
  const t = useT();
  const status = normalizeKycStatus(user?.kycStatus);

  const copy: Record<KycStatus, { heading: string; body: string; label: string }> =
    {
      pending: {
        heading: t.kyc.pendingHeading,
        body: t.kyc.pendingBody,
        label: t.kyc.pending,
      },
      failed: {
        heading: t.kyc.failedHeading,
        body: t.kyc.failedBody,
        label: t.kyc.failed,
      },
      verified: {
        heading: t.kyc.verifiedHeading,
        body: t.kyc.verifiedBody,
        label: t.kyc.verified,
      },
    };

  const active = copy[status];

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(2rem,calc(var(--safe-bottom)+1.5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/profile" label={t.common.back} />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">{t.kyc.title}</h1>

      <div className="mt-8">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1",
            "text-[13px] font-semibold leading-4"
          )}
          style={{
            color: KYC_STATUS_COLOR[status],
            backgroundColor: `${KYC_STATUS_COLOR[status]}1A`,
          }}
        >
          {active.label}
        </span>

        <h2 className="mt-5 text-[18px] font-semibold leading-6 tracking-[-0.01em] text-[#15131A]">
          {active.heading}
        </h2>
        <p className="mt-2 text-[14px] font-normal leading-5 text-[#8E8E93]">
          {active.body}
        </p>
      </div>
    </div>
  );
}
