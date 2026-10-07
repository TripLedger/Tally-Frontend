"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronRight, LayoutPanelTop, ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthBackButton, AuthStackHeader } from "@/features/auth";
import { cn } from "@/lib/utils";
import { BillAmountCard } from "./BillAmountCard";
import {
  lightExpenseFocusRing,
  lightExpenseShellClass,
} from "./lightExpenseChrome";
import { useOutingBill } from "./useOutingBill";

interface SplitChoicesScreenProps {
  groupId: string;
  outingId: string;
}

/**
 * Outing flow — How do you want to split? (Figma).
 */
export function SplitChoicesScreen({
  groupId,
  outingId,
}: SplitChoicesScreenProps) {
  const router = useRouter();
  const { amount, currency } = useOutingBill();
  const base = `/trips/${groupId}/outings/${outingId}/expenses`;

  return (
    <div className={lightExpenseShellClass}>
      <div className="flex shrink-0 items-center">
        <AuthBackButton href={`${base}/new`} label="Back to amount" />
      </div>

      <AuthStackHeader
        title={
          <>
            How do you want
            <br />
            to split?
          </>
        }
        subtitle="Choose how you want to split your bill"
      />

      <BillAmountCard amount={amount} currency={currency} className="mt-12" />

      <div
        className={cn(
          "mt-10 w-full rounded-[24px] bg-white p-5",
          "shadow-[0_2px_16px_rgba(21,19,26,0.05)]"
        )}
      >
        <div className="flex flex-col gap-5">
          <SplitChoiceRow
            icon={ReceiptText}
            title="Assign by item"
            subtitle="Each person pays for what they ordered"
            onClick={() => router.push(`${base}/split/items`)}
          />
          <SplitChoiceRow
            icon={LayoutPanelTop}
            title="Split equally"
            subtitle="Every person pays the same share"
            onClick={() => router.push(`${base}/split/equal`)}
          />
        </div>
      </div>
    </div>
  );
}

function SplitChoiceRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[16px] bg-[#F5F5F7]",
        "px-4 py-4 text-left",
        "transition-[transform,background-color] duration-150",
        "hover:bg-[#F0F0F2] active:scale-[0.99]",
        lightExpenseFocusRing
      )}
    >
      <Icon
        className="h-5 w-5 shrink-0 text-[#15131A]"
        strokeWidth={1.75}
        aria-hidden
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold leading-6 tracking-[-0.01em] text-[#15131A]">
          {title}
        </span>
        <span className="mt-0.5 block text-tabr-ink-paragraph-small">
          {subtitle}
        </span>
      </span>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-[#C7C7CC]"
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  );
}
