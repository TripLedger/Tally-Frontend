"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import {
  AuthBackButton,
  AuthStackHeader,
  authControlBoxClass,
  authStackCtaClass,
} from "@/features/auth";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

const geistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

const secondaryBtnClass = cn(
  authControlBoxClass,
  "flex items-center justify-center border border-[#E5E5E5] bg-white",
  "text-[16px] font-semibold leading-none text-[#15131A]",
  "transition-[transform,background-color] duration-150",
  "hover:bg-[#FAFAFA] active:scale-[0.98]",
  focusRing
);

interface AddExpenseScreenProps {
  groupId: string;
  outingId: string;
}

/**
 * Outing flow — Add expense landing (Figma).
 * Choose scan receipt or enter manually.
 */
export function AddExpenseScreen({
  groupId,
  outingId,
}: AddExpenseScreenProps) {
  const base = `/trips/${groupId}/outings/${outingId}/expenses`;
  const outingHref = `/trips/${groupId}/outings/${outingId}`;

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(1.5rem,var(--safe-bottom))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href={outingHref} label="Back to trip" />
      </div>

      <AuthStackHeader
        title="Add expense"
        subtitle="Assign expenses to your trip"
      />

      <div className="flex min-h-0 flex-1 flex-col items-center pt-10 pb-16 sm:justify-center sm:pt-0">
        <div
          className={cn(
            "flex w-full max-w-[340px] flex-col items-center",
            "rounded-[20px] bg-white px-6 py-8",
            "shadow-[0_2px_16px_rgba(21,19,26,0.06)]"
          )}
        >
          <Wallet
            className="h-10 w-10 text-[#15131A]"
            strokeWidth={1.5}
            aria-hidden
          />

          <p className="mt-4 text-center text-[15px] font-normal leading-5 text-[#8E8E93]">
            Add an expense and split the bill
          </p>

          <div className="mt-6 flex w-full flex-col gap-3">
            <Link
              href={`${base}/scan`}
              className={cn("w-full", authStackCtaClass(true), focusRing)}
            >
              Scan receipt
            </Link>
            <Link
              href={`${base}/new`}
              className={cn("w-full", secondaryBtnClass)}
            >
              Enter manually
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
