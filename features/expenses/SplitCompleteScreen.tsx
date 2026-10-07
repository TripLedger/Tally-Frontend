"use client";

import { useRouter } from "next/navigation";
import {
  AuthBackButton,
  AuthStackHeader,
  authStackCtaClass,
} from "@/features/auth";
import { fromMinorUnits, getCurrencySymbol } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { BillAmountCard } from "./BillAmountCard";
import {
  lightExpenseCtaFooterClass,
  lightExpenseFocusRing,
  lightExpenseShellClass,
} from "./lightExpenseChrome";
import { splitOutingEqually } from "./outingSplit";
import { useOutingBill } from "./useOutingBill";

interface SplitCompleteScreenProps {
  groupId: string;
  outingId: string;
}

/**
 * Outing flow — Split complete (Figma). Equal shares, then Send.
 */
export function SplitCompleteScreen({
  groupId,
  outingId,
}: SplitCompleteScreenProps) {
  const router = useRouter();
  const { amount, currency } = useOutingBill();
  const shares = splitOutingEqually(groupId, amount, currency);
  const symbol = getCurrencySymbol(currency);
  const backHref = `/trips/${groupId}/outings/${outingId}/expenses/split`;

  const onSend = () => {
    router.push(
      `/trips/${groupId}/outings/${outingId}/expenses/split/success`
    );
  };

  return (
    <div
      className={cn(
        lightExpenseShellClass,
        "bg-white",
        "pb-0"
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href={backHref} label="Back to split choices" />
      </div>

      <AuthStackHeader
        title="Split complete"
        subtitle={
          <>
            Now you can share the bill with your
            <br />
            crew
          </>
        }
      />

      {/* Soft white → off-white blend above / behind the bill card (Figma). */}
      <div className="-mx-5 mt-4 flex flex-1 flex-col xs:-mx-6">
        <div
          className={cn(
            "px-5 pt-8 xs:px-6",
            "bg-[linear-gradient(180deg,#FFFFFF_0px,#FFFFFF_20px,var(--new-bg,#FAFAFA)_96px,var(--new-bg,#FAFAFA)_100%)]"
          )}
        >
          <BillAmountCard
            amount={amount}
            currency={currency}
            className="shrink-0"
          />
        </div>

        <div className="flex flex-1 flex-col bg-[var(--new-bg,#FAFAFA)] px-5 xs:px-6">
          <ul className="mt-8 flex flex-col gap-5">
            {shares.map(({ member, amountMinorUnits }) => {
              const share = Math.round(
                fromMinorUnits(amountMinorUnits, currency)
              );
              return (
                <li
                  key={member.userId}
                  className="flex items-center gap-3.5 rounded-[16px] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(21,19,26,0.05)]"
                >
                  {member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.avatarUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F2FF] text-[14px] font-semibold text-[#8B5CF6]"
                      aria-hidden
                    >
                      {member.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <p className="min-w-0 flex-1 truncate text-[16px] font-medium leading-6 text-[#15131A]">
                    {member.displayName}
                  </p>
                  <p className="shrink-0 text-[16px] font-semibold leading-6 tabular-nums text-[#15131A]">
                    {symbol}
                    {share.toLocaleString("en-US")}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className={cn(lightExpenseCtaFooterClass, "mt-10")}>
            <button
              type="button"
              onClick={onSend}
              className={cn(
                "w-full",
                authStackCtaClass(true),
                lightExpenseFocusRing
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
