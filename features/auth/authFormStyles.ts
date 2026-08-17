import { cn } from "@/lib/utils";

/**
 * Shared control size — same as onboarding “Get started”:
 * px-6 inset, h-[52px], w-full, rounded-full.
 */
export const AUTH = {
  padX: 24,
  controlH: 52,
  gap: 16,
  otpLength: 6,
  resendSeconds: 26,
  color: {
    bg: "#FFFFFF",
    text: "#0A0A0A",
    ink: "#15131A",
    muted: "#8E8E93",
    secondary: "#716D7D",
    placeholder: "#C7C7CC",
    border: "#E0E0E0",
    googleBg: "#F3F4F6",
    primary: "#9367F9",
    cta: "#8B5CF6",
    ctaDisabled: "#C5ADFA",
    error: "#F43F5E",
    success: "#22C55E",
  },
} as const;

const authGeistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

/**
 * Same column as onboarding: full width of the auth frame, 24px side inset.
 * Padding uses --safe-top / --safe-bottom (not env() in the class). Commas
 * inside env() break Tailwind arbitrary-value parsing and drop the padding.
 */
export const authShellClass = cn(
  "mx-auto flex min-h-dvh w-full flex-col items-stretch",
  "bg-white px-6",
  "pb-[max(1.5rem,var(--safe-bottom))]",
  "pt-[calc(max(var(--safe-top),47px)+1.75rem)]"
);

/**
 * Forgot-password / OTP / reset stack.
 * Figma frames include ~47px status bar; back arrow sits below it.
 * Floor at 47px for browsers that report 0, then add 20px so the arrow
 * never sits under the iOS/Android status bar on a real phone.
 */
export const authStackShellClass = cn(
  "mx-auto flex min-h-dvh w-full flex-col items-stretch bg-white px-6",
  authGeistClass,
  "pb-[max(68px,calc(var(--safe-bottom)+2rem))]",
  "pt-[calc(max(var(--safe-top),47px)+1.25rem)]"
);

export const authStackHeaderClass = "mt-6 w-full text-left";

export const authStackHeadingClass = "text-tabr-ink-heading-2 w-full";

export const authStackSubtitleClass = cn(
  "text-tabr-ink-paragraph-small mt-2 w-full"
);

export const authBackBtnClass = cn(
  "-ml-2 flex h-11 w-11 items-center justify-center",
  "text-[#15131A] transition-transform duration-150 active:scale-95"
);

/** Identical box for Google / inputs / primary CTAs. */
export const authControlBoxClass = cn(
  "box-border h-[52px] w-full min-w-0 shrink-0 rounded-full"
);

export const authStackCtaClass = (enabled: boolean) =>
  cn(
    authControlBoxClass,
    "flex items-center justify-center text-[16px] font-semibold leading-none text-white",
    "transition-[transform,background-color] duration-150 disabled:opacity-100",
    enabled
      ? "bg-[#8B5CF6] hover:bg-[#7C4AED] active:scale-[0.98]"
      : "cursor-not-allowed bg-[#C5ADFA]"
  );

export const authLogoWrapClass = "flex w-full justify-center";

/** Logo → title breathing room (Figma) */
export const authHeaderClass = "mt-8 w-full text-center";

export const authHeadingClass = cn(
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]",
  "text-[1.875rem] font-semibold leading-[1.2] tracking-[-0.03em] text-[#0A0A0A]"
);

export const authSubtitleClass =
  "mt-2.5 text-base font-normal leading-6 text-[#8E8E93]";

/** Space between header block and first form control */
export const authBodyClass = "mt-8 flex w-full flex-1 flex-col gap-4";

export const authLabelClass =
  "mb-2 block text-sm font-medium text-[#15131A]";

export const authFieldClass = cn(
  authControlBoxClass,
  "border bg-white px-4 text-[16px] font-normal leading-none text-[#0A0A0A]",
  "placeholder:font-normal placeholder:text-[#C7C7CC]",
  "appearance-none outline-none",
  "focus:border-[#9367F9] focus:outline-none focus:ring-2 focus:ring-[#9367F9]/20"
);

export const authFieldBorder = (error?: boolean) =>
  error ? "border-[#F43F5E]" : "border-[#E0E0E0]";

/** Setup/currency variant — same width/height, slightly squarer radius from setup Figma */
export const authFieldClassRounded = cn(
  authControlBoxClass,
  "rounded-2xl border bg-white px-4 text-[16px] font-normal leading-none text-[#0A0A0A]",
  "placeholder:font-normal placeholder:text-[#C7C7CC]",
  "appearance-none outline-none",
  "focus:border-[#9367F9] focus:outline-none focus:ring-2 focus:ring-[#9367F9]/20"
);

export const authGoogleBtnClass = cn(
  authControlBoxClass,
  "flex items-center justify-center gap-3 bg-[#F3F4F6]",
  "text-[16px] font-semibold leading-none text-[#0A0A0A]",
  "transition-[transform,background-color] duration-150",
  "active:scale-[0.98] disabled:opacity-70"
);

export const authPrimaryBtnClass = (enabled: boolean) =>
  cn(
    authControlBoxClass,
    "flex items-center justify-center bg-[#9367F9]",
    "text-[16px] font-semibold leading-none text-white",
    "transition-[transform,background-color] duration-150",
    enabled ? "hover:bg-[#8254F0] active:scale-[0.98]" : "cursor-not-allowed"
  );

export const authOrDividerClass =
  "flex w-full min-w-0 items-center gap-3";

export const authLinkClass = "font-medium text-[#9367F9]";

export const authMutedClass = "text-[#8E8E93]";

export const authErrorClass = "mt-1.5 text-[0.8125rem] text-[#F43F5E]";

export const authFooterClass =
  "mt-auto pt-6 text-center text-base text-[#8E8E93]";
