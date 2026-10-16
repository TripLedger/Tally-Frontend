"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthBackButton,
  authFieldBorder,
  authFieldClass,
  authLabelClass,
  authStackCtaClass,
  isResetPasswordValid,
} from "@/features/auth";
import { cn } from "@/lib/utils";
import { useAddToast } from "@/store";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/**
 * Figma — Change password (Profile → Password and Security).
 */
export function ChangePasswordScreen() {
  const router = useRouter();
  const addToast = useAddToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const mismatch =
    repeatPassword.length > 0 && repeatPassword !== newPassword;
  const sameAsCurrent =
    newPassword.length > 0 &&
    currentPassword.length > 0 &&
    newPassword === currentPassword;

  const canSubmit =
    currentPassword.length > 0 &&
    isResetPasswordValid(newPassword) &&
    repeatPassword === newPassword &&
    !sameAsCurrent &&
    !submitting;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      // Mock until change-password API is wired.
      await new Promise((resolve) => setTimeout(resolve, 450));
      addToast({
        message: "Password updated",
        variant: "success",
        duration: 2000,
      });
      router.push("/profile");
    } finally {
      setSubmitting(false);
    }
  };

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
        <AuthBackButton href="/profile" label="Back to profile" />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">Change password</h1>

      <form
        noValidate
        onSubmit={(event) => void onSubmit(event)}
        className="mt-8 flex flex-1 flex-col"
      >
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="current-password" className={authLabelClass}>
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Current password"
              className={cn(authFieldClass, authFieldBorder(), focusRing)}
            />
          </div>

          <div>
            <label htmlFor="new-password" className={authLabelClass}>
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New password"
              className={cn(
                authFieldClass,
                authFieldBorder(
                  Boolean(
                    newPassword.length > 0 &&
                      (!isResetPasswordValid(newPassword) || sameAsCurrent)
                  )
                ),
                focusRing
              )}
            />
            {newPassword.length > 0 && !isResetPasswordValid(newPassword) ? (
              <p className="mt-2 text-[12px] font-normal leading-4 text-[#F43F5E]">
                Use at least 8 characters and one number
              </p>
            ) : null}
            {sameAsCurrent ? (
              <p className="mt-2 text-[12px] font-normal leading-4 text-[#F43F5E]">
                New password must be different from your current password
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="repeat-password" className={authLabelClass}>
              Repeat password
            </label>
            <input
              id="repeat-password"
              type="password"
              autoComplete="new-password"
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              placeholder="Repeat password"
              className={cn(
                authFieldClass,
                authFieldBorder(mismatch),
                focusRing
              )}
            />
            {mismatch ? (
              <p className="mt-2 text-[12px] font-normal leading-4 text-[#F43F5E]">
                Passwords don&apos;t match
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 shrink-0">
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn("w-full", authStackCtaClass(canSubmit), focusRing)}
          >
            {submitting ? "Updating…" : "Change password"}
          </button>
        </div>
      </form>
    </div>
  );
}
