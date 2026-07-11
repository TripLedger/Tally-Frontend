"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { emailAuthSchema, type EmailAuthFormData } from "./schemas";
import { cn } from "@/lib/utils";

interface EmailAuthSheetProps {
  onClose?: () => void;
}

export function EmailAuthSheet({ onClose }: EmailAuthSheetProps) {
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EmailAuthFormData>({
    resolver: zodResolver(emailAuthSchema),
  });

  const sendLink = async (email: string) => {
    setSubmitting(true);
    setFormError(null);

    if (!isSupabaseConfigured()) {
      setFormError(
        "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
      );
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      setSentTo(email);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (data: EmailAuthFormData) => sendLink(data.email);

  if (sentTo) {
    return (
      <div className="flex flex-col items-center px-2 pb-4 pt-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7C3AED1a]">
          <MailCheck className="h-7 w-7 text-[#7C3AED]" strokeWidth={2} />
        </div>
        <h2 className="mt-4 text-[18px] font-semibold text-[#F8F8FF]">
          Check your email
        </h2>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-[#94A3B8]">
          We sent a magic link to{" "}
          <span className="font-medium text-[#F8F8FF]">{sentTo}</span>. Tap it on
          this device to sign in.
        </p>
        <button
          type="button"
          onClick={() => {
            setSentTo(null);
          }}
          className="mt-5 text-[14px] font-medium text-[#94A3B8] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A] rounded"
        >
          Use a different email
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => sendLink(sentTo)}
          className="mt-3 text-[13px] text-[#475569] disabled:opacity-60"
        >
          {submitting ? "Resending…" : "Didn't get it? Resend"}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-2">
      <div className="mb-1">
        <h2 className="text-[18px] font-semibold text-[#F8F8FF]">
          Continue with email
        </h2>
        <p className="mt-1 text-[14px] text-[#94A3B8]">
          We&apos;ll email you a magic link — no password needed.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <input
          {...register("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="you@example.com"
          className={cn(
            "h-[52px] w-full rounded-[12px] bg-[#1C1C27] px-4 text-base font-normal text-[#F8F8FF]",
            "border placeholder:text-[#475569]",
            "focus:outline-none focus:ring-0",
            "focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]",
            errors.email
              ? "border-[#F43F5E]"
              : "border-[#ffffff0f] focus:border-[#7C3AED] focus:border-[1.5px]"
          )}
        />
        {errors.email && (
          <p className="mt-1.5 text-[13px] text-[#F43F5E]">
            {errors.email.message}
          </p>
        )}

        {formError && (
          <p className="mt-3 text-[13px] text-[#F43F5E]">{formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "mt-5 flex h-[52px] w-full items-center justify-center rounded-[12px]",
            "bg-accent-gradient text-[15px] font-semibold text-[#F8F8FF]",
            "transition-transform duration-fast ease-tally active:scale-[0.98]",
            "disabled:opacity-70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13131A]"
          )}
        >
          {submitting ? (
            <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Send magic link"
          )}
        </button>
      </form>
    </div>
  );
}
