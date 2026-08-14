"use client";

import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { AUTH } from "./authFormStyles";
import { cn } from "@/lib/utils";

const LENGTH = AUTH.otpLength;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, LENGTH);
}

interface OtpInputProps {
  value: string;
  onChange: (next: string) => void;
  error?: boolean;
  disabled?: boolean;
  id?: string;
}

export function OtpInput({
  value,
  onChange,
  error,
  disabled,
  id = "otp",
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const focusAt = (index: number) => {
    const next = Math.max(0, Math.min(index, LENGTH - 1));
    refs.current[next]?.focus();
    refs.current[next]?.select();
  };

  const write = (next: string, focusIndex?: number) => {
    const digitsOnly = onlyDigits(next);
    onChange(digitsOnly);
    if (typeof focusIndex === "number") {
      requestAnimationFrame(() => focusAt(focusIndex));
    }
  };

  const handleChange = (index: number, raw: string) => {
    const incoming = onlyDigits(raw);
    if (!incoming) {
      const next = digits.map((d, i) => (i === index ? "" : d)).join("");
      write(next, index);
      return;
    }

    if (incoming.length > 1) {
      const merged = (value.slice(0, index) + incoming).slice(0, LENGTH);
      write(merged, Math.min(index + incoming.length, LENGTH - 1));
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = incoming;
    const next = nextDigits.join("").slice(0, LENGTH);
    write(next, incoming ? index + 1 : index);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? "" : d)).join("");
        write(next, index);
        return;
      }
      if (index > 0) {
        const next = digits.map((d, i) => (i === index - 1 ? "" : d)).join("");
        write(next, index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = onlyDigits(event.clipboardData.getData("text"));
    if (!pasted) return;
    write(pasted, Math.min(pasted.length, LENGTH - 1));
  };

  return (
    <div
      className="flex w-full gap-2"
      role="group"
      aria-label="One-time code"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoCorrect="off"
          spellCheck={false}
          maxLength={1}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-label={`Digit ${index + 1} of ${LENGTH}`}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
          className={cn(
            "box-border aspect-square min-w-0 flex-1",
            "rounded-[10px] border bg-white text-center",
            "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]",
            "text-[20px] font-semibold leading-none text-[#15131A]",
            "outline-none transition-colors duration-150",
            "caret-[#15131A]",
            error
              ? "border-[#DC2626] focus:border-[#DC2626]"
              : "border-[#E0E0E0] focus:border-[#8B5CF6]",
            "disabled:opacity-70"
          )}
        />
      ))}
    </div>
  );
}
