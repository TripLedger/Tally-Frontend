"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil } from "lucide-react";
import { AuthBackButton, CurrencyPickerSheet } from "@/features/auth";
import { LightHomeOverlay } from "@/features/home";
import { getMemberInitial } from "@/lib/avatar-colors";
import { clearMockUser, mockSignOut } from "@/lib/auth/mock-session";
import { cn } from "@/lib/utils";
import {
  useAddToast,
  useAuthStore,
  useBalanceStore,
  useExpenseStore,
  useNotificationStore,
  useOpenBottomSheet,
  useSettlementStore,
  useTripStore,
  useUser,
} from "@/store";
import { DisplayNameSheet } from "./DisplayNameSheet";
import {
  KYC_STATUS_COLOR,
  KYC_STATUS_LABEL,
  normalizeKycStatus,
  type KycStatus,
} from "./kyc";

const geistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

const cardClass = cn(
  "w-full overflow-hidden rounded-[20px] bg-white",
  "shadow-[0_2px_16px_rgba(21,19,26,0.05)]"
);

function deriveHandle(displayName: string, email: string): string {
  const fromName = displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  if (fromName) return `@${fromName}`;
  const local = email.split("@")[0]?.trim().toLowerCase();
  return local ? `@${local}` : "@user";
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return <div className={cardClass}>{children}</div>;
}

function SettingsRow({
  label,
  value,
  valueColor,
  chevron = true,
  destructive = false,
  showDivider = false,
  onClick,
}: {
  label: string;
  value?: string;
  valueColor?: string;
  chevron?: boolean;
  destructive?: boolean;
  showDivider?: boolean;
  onClick: () => void;
}) {
  return (
    <>
      {showDivider ? (
        <div className="mx-4 h-px bg-[#F0EEF5]" aria-hidden />
      ) : null}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex min-h-[52px] w-full items-center gap-3 px-4 py-3.5 text-left",
          "transition-colors duration-150 hover:bg-[#FAFAFA] active:bg-[#F5F5F7]",
          focusRing
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            "[font-family:var(--font-definitions-font-family-body,Geist)]",
            "text-[length:var(--paragraph-small-font-size,14px)] font-normal",
            "leading-[var(--paragraph-small-line-height,20px)]",
            "tracking-[var(--paragraph-small-letter-spacing,0)]",
            destructive
              ? "text-[#F43F5E]"
              : "text-[var(--text-primary-500,#15131A)]"
          )}
        >
          {label}
        </span>
        {value ? (
          <span
            className="max-w-[140px] shrink-0 truncate text-[15px] font-medium leading-5"
            style={{ color: valueColor ?? "#8E8E93" }}
          >
            {value}
          </span>
        ) : null}
        {chevron ? (
          <ChevronRight
            className="h-5 w-5 shrink-0 text-[#C7C7CC]"
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null}
      </button>
    </>
  );
}

function ProfileAvatar({
  name,
  src,
  onEdit,
}: {
  name: string;
  src?: string;
  onEdit: () => void;
}) {
  const initial = getMemberInitial(name);

  return (
    <div className="relative h-[72px] w-[72px] shrink-0">
      <div className="h-full w-full overflow-hidden rounded-full bg-[#EDE9FE]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            aria-hidden
          >
            <span className="text-[28px] font-semibold leading-none text-[#8B5CF6]">
              {initial}
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit profile photo"
        className={cn(
          "absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center",
          "rounded-full bg-[#8B5CF6] text-white shadow-[0_2px_6px_rgba(139,92,246,0.35)]",
          "transition-transform duration-150 active:scale-95",
          focusRing
        )}
      >
        <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}

function signOutAndClear() {
  mockSignOut();
  clearMockUser();
  useAuthStore.getState().clearUser();
  useTripStore.getState().clearTripState();
  useTripStore.getState().clearPendingInvite();
  useExpenseStore.getState().clearExpenses();
  useBalanceStore.getState().clearBalanceState();
  useSettlementStore.getState().clearSettlementState();
  useNotificationStore.getState().clearNotificationState();
}

/**
 * Light Profile screen (Figma) — stacked white cards, KYC status row,
 * red Sign out. KYC value comes from the user/API; UI only maps colors.
 */
export function ProfileScreen() {
  const user = useUser();
  const router = useRouter();
  const openBottomSheet = useOpenBottomSheet();
  const addToast = useAddToast();
  const updateHomeCurrency = useAuthStore((s) => s.updateHomeCurrency);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = user?.displayName?.trim() || "Traveler";
  const email = user?.email ?? "";
  const homeCurrency = user?.homeCurrency ?? "NGN";
  const language = user?.language?.trim() || "English";
  const phone = user?.phone?.trim() || "+234 810 293 7741";
  const handle = useMemo(
    () => user?.handle?.trim() || deriveHandle(displayName, email),
    [user?.handle, displayName, email]
  );
  const kycStatus: KycStatus = normalizeKycStatus(user?.kycStatus);

  const comingSoon = (message: string) => {
    addToast({ message, variant: "info", duration: 2500 });
  };

  const openDisplayName = () => {
    openBottomSheet(
      <DisplayNameSheet currentName={user?.displayName ?? ""} />,
      { title: "Display name", height: "40" }
    );
  };

  const openHomeCurrency = () => {
    openBottomSheet(
      <CurrencyPickerSheet
        selectedCode={homeCurrency}
        onSelect={async (c) => {
          const ok = await updateHomeCurrency(c.code);
          if (!ok) {
            addToast({
              message: "Couldn't update home currency. Please try again.",
              variant: "error",
            });
            return;
          }
          addToast({
            message: "Home currency updated",
            variant: "success",
          });
        }}
      />,
      { title: "Home currency", height: "75" }
    );
  };

  const confirmSignOut = () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      signOutAndClear();
      setSignOutOpen(false);
      router.refresh();
      router.push("/");
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(6rem,calc(var(--safe-bottom)+5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]",
        geistClass
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/dashboard" label="Back to home" />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">Profile</h1>

      {/* User card */}
      <section className={cn(cardClass, "mt-6 p-4")} aria-label="Account">
        <div className="flex items-center gap-3.5">
          <ProfileAvatar
            name={displayName}
            src={user?.avatarUrl}
            onEdit={openDisplayName}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-semibold leading-6 tracking-[-0.01em] text-[#15131A]">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-[14px] font-normal leading-5 text-[#8E8E93]">
              {handle}
            </p>
            <p className="mt-0.5 truncate text-[14px] font-normal leading-5 text-[#8E8E93]">
              {phone}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-3 flex flex-col gap-3">
        {/* Account */}
        <SettingsCard>
          <SettingsRow
            label="Edit profile"
            onClick={openDisplayName}
          />
          <SettingsRow
            label="Payment method"
            onClick={() => comingSoon("Payment method is coming soon.")}
            showDivider
          />
          <SettingsRow
            label="Password and Security"
            onClick={() => comingSoon("Password and Security is coming soon.")}
            showDivider
          />
          <SettingsRow
            label="KYC Status"
            value={KYC_STATUS_LABEL[kycStatus]}
            valueColor={KYC_STATUS_COLOR[kycStatus]}
            onClick={() => comingSoon("KYC verification is coming soon.")}
            showDivider
          />
          <SettingsRow
            label="Language"
            value={language}
            onClick={() => comingSoon("Language settings are coming soon.")}
            showDivider
          />
        </SettingsCard>

        {/* Preferences */}
        <SettingsCard>
          <SettingsRow
            label="Notifications"
            onClick={() => router.push("/notifications")}
          />
          <SettingsRow
            label="Currency"
            value={homeCurrency}
            onClick={openHomeCurrency}
            showDivider
          />
        </SettingsCard>

        {/* History */}
        <SettingsCard>
          <SettingsRow
            label="Trip History"
            onClick={() => comingSoon("Trip History is coming soon.")}
          />
          <SettingsRow
            label="Settlement reminder"
            onClick={() => comingSoon("Settlement reminder is coming soon.")}
            showDivider
          />
          <SettingsRow
            label="Transaction History"
            onClick={() => comingSoon("Transaction History is coming soon.")}
            showDivider
          />
        </SettingsCard>

        {/* Support */}
        <SettingsCard>
          <SettingsRow
            label="Help center"
            chevron={false}
            onClick={() => comingSoon("Help center is coming soon.")}
          />
          <SettingsRow
            label="Rate the app"
            onClick={() => router.push("/profile/review")}
            showDivider
          />
          <SettingsRow
            label="Share with friends"
            onClick={() => comingSoon("Share with friends is coming soon.")}
            showDivider
          />
          <SettingsRow
            label="About"
            onClick={() => comingSoon("About is coming soon.")}
            showDivider
          />
        </SettingsCard>

        {/* Sign out */}
        <SettingsCard>
          <SettingsRow
            label="Sign out"
            chevron={false}
            destructive
            onClick={() => setSignOutOpen(true)}
          />
        </SettingsCard>
      </div>

      <LightHomeOverlay
        open={signOutOpen}
        onClose={() => !signingOut && setSignOutOpen(false)}
        ariaLabel="Sign out"
        variant="center"
        sheetClassName="px-6 py-7"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-center text-[17px] font-semibold text-[#15131A]">
            Sign out?
          </h2>
          <p className="mt-2 max-w-[260px] text-center text-[14px] font-normal leading-relaxed text-[#8E8E93]">
            You&apos;ll need to sign in again to access your trips.
          </p>
          <button
            type="button"
            onClick={confirmSignOut}
            disabled={signingOut}
            className={cn(
              "mt-6 flex h-[52px] w-full items-center justify-center rounded-full",
              "bg-[#F43F5E] text-[16px] font-semibold text-white",
              "transition-transform duration-150 active:scale-[0.98]",
              "disabled:opacity-60",
              focusRing
            )}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
          <button
            type="button"
            onClick={() => setSignOutOpen(false)}
            disabled={signingOut}
            className={cn(
              "mt-3 flex h-11 w-full items-center justify-center",
              "text-[15px] font-medium text-[#8E8E93]",
              "transition-colors duration-150 hover:text-[#15131A]",
              focusRing
            )}
          >
            Cancel
          </button>
        </div>
      </LightHomeOverlay>
    </div>
  );
}
