"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthBackButton,
  AuthBody,
  AuthPrimaryButton,
  AuthStackHeader,
  AuthStackScreen,
} from "./AuthScreen";
import { AUTH } from "./authFormStyles";
import { OtpInput } from "./OtpInput";

/** Mock: the Figma error frame uses 000000 — any other 6-digit code passes. */
const MOCK_INVALID_OTP = "000000";

export function ForgotPasswordOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTH.resendSeconds as number);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const complete = otp.length === AUTH.otpLength;
  const enabled = complete && !submitting && !error;

  const resendLabel = useMemo(() => {
    if (secondsLeft > 0) return `Resend in ${secondsLeft} secs`;
    return "Resend";
  }, [secondsLeft]);

  const onOtpChange = (next: string) => {
    setOtp(next);
    if (error) setError(false);
  };

  const onResend = () => {
    if (secondsLeft > 0 || submitting) return;
    setOtp("");
    setError(false);
    setSecondsLeft(AUTH.resendSeconds);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!enabled) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    if (otp === MOCK_INVALID_OTP) {
      setError(true);
      setSubmitting(false);
      return;
    }

    const resetPath = email
      ? `/forgot-password/reset?email=${encodeURIComponent(email)}`
      : "/forgot-password/reset";
    router.push(resetPath);
  };

  return (
    <AuthStackScreen>
      <AuthBackButton />
      <AuthStackHeader
        title={"You\u2019ve got mail"}
        subtitle="Please enter the code sent to your email"
      />

      <AuthBody className="flex-1">
        <form
          onSubmit={onSubmit}
          className="flex w-full min-w-0 flex-1 flex-col"
        >
          <OtpInput
            value={otp}
            onChange={onOtpChange}
            error={error}
            disabled={submitting}
          />

          <p className="text-tabr-ink-paragraph-small mt-4 text-center">
            Didn{"\u2019"}t get the code?{" "}
            {secondsLeft > 0 ? (
              <span className="text-[#DC2626]">{resendLabel}</span>
            ) : (
              <button
                type="button"
                onClick={onResend}
                className="text-[#DC2626]"
              >
                Resend
              </button>
            )}
          </p>

          <div className="mt-auto pt-16">
            <AuthPrimaryButton
              variant="stack"
              enabled={enabled}
              disabled={!enabled}
            >
              {submitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Verify"
              )}
            </AuthPrimaryButton>
          </div>
        </form>
      </AuthBody>
    </AuthStackScreen>
  );
}

export function ForgotPasswordOtpFallback() {
  return (
    <AuthStackScreen>
      <div className="h-11 w-11" />
      <AuthStackHeader
        title={"You\u2019ve got mail"}
        subtitle="Please enter the code sent to your email"
      />
    </AuthStackScreen>
  );
}
