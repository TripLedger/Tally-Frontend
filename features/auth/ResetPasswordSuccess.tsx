"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  AuthBody,
  AuthPrimaryButton,
  AuthStackScreen,
} from "./AuthScreen";

export function ResetPasswordSuccess() {
  const router = useRouter();

  return (
    <AuthStackScreen>
      <AuthBody className="mt-0 flex-1 items-center justify-center gap-0 text-center">
        <div className="flex flex-col items-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]"
            aria-hidden
          >
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="mt-6 text-[24px] font-semibold leading-7 tracking-[-0.03em] text-[#15131A]">
            Success
          </h1>
          <p className="text-tabr-ink-paragraph-small mt-2 max-w-[230px]">
            Your password has been reset successfully
          </p>
        </div>
      </AuthBody>

      <div className="pt-8">
        <AuthPrimaryButton
          type="button"
          variant="stack"
          enabled
          onClick={() => router.replace("/sign-in")}
        >
          Sign in
        </AuthPrimaryButton>
      </div>
    </AuthStackScreen>
  );
}
