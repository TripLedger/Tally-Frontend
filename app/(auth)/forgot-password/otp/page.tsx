import { Suspense } from "react";
import {
  ForgotPasswordOtpFallback,
  ForgotPasswordOtpForm,
} from "@/features/auth";

export default function ForgotPasswordOtpPage() {
  return (
    <Suspense fallback={<ForgotPasswordOtpFallback />}>
      <ForgotPasswordOtpForm />
    </Suspense>
  );
}
