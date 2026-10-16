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
    bg: "#FAFAFA",
    text: "#0A0A0A",
    ink: "#15131A",
    muted: "#8E8E93",
    secondary: "#716D7D",
    placeholder: "#C7C7CC",
    border: "#E0E0E0",
    googleBg: "#F3F4F6",
    primary: "#5921B5", // var(--primary-500)
    cta: "#5921B5",
    ctaDisabled: "#B39DD9",
    error: "#F43F5E",
    success: "#22C55E",
  },
} as const;

const authGeistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

/**
 * Sign-in / sign-up / setup frame (Figma artboard is 390×844 — do NOT lock that as CSS).
 * Full device width/height via phone-shell; px-16 + gap-16 + New-BG.
 */
export const authShellClass = cn(
  "flex w-full min-h-dvh flex-col items-center gap-4",
  "bg-[var(--New-BG,#FAFAFA)] px-4",
  "pb-[max(1.5rem,var(--safe-bottom))]",
  "pt-[calc(max(var(--safe-top),47px)+1.75rem)]"
);

/**
 * Forgot-password / OTP / reset stack — same responsive shell + New-BG.
 * Status-bar floor keeps the back control below OS chrome.
 */
export const authStackShellClass = cn(
  "flex w-full min-h-dvh flex-col items-stretch gap-4",
  "bg-[var(--New-BG,#FAFAFA)] px-4",
  authGeistClass,
  "pb-[max(68px,calc(var(--safe-bottom)+2rem))]",
  "pt-[calc(max(var(--safe-top),47px)+1.25rem)]"
);

export const authStackHeaderClass = "w-full text-left";

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
      ? "bg-[var(--primary-500,#5921B5)] hover:bg-[#4A1C96] active:scale-[0.98]"
      : "cursor-not-allowed bg-[#B39DD9]"
  );

export const authLogoWrapClass = "flex w-full shrink-0 justify-center";

/** Title block — shell `gap-4` owns spacing from the logo */
export const authHeaderClass = "w-full text-center";

export const authHeadingClass = cn(
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]",
  "text-[1.875rem] font-semibold leading-[1.2] tracking-[-0.03em] text-[#0A0A0A]"
);

export const authSubtitleClass =
  "mt-2.5 text-base font-normal leading-6 text-[#8E8E93]";

/** Form column — shell `gap-4` owns spacing from the header */
export const authBodyClass = "flex w-full flex-1 flex-col gap-4";

export const authLabelClass =
  "mb-2 block text-sm font-medium text-[#15131A]";

export const authFieldClass = cn(
  authControlBoxClass,
  "border bg-white px-4 text-[16px] font-normal leading-none text-[#0A0A0A]",
  "placeholder:font-normal placeholder:text-[#C7C7CC]",
  "appearance-none outline-none",
  "focus:border-[#5921B5] focus:outline-none focus:ring-2 focus:ring-[#5921B5]/20"
);

export const authFieldBorder = (error?: boolean) =>
  error ? "border-[#F43F5E]" : "border-[#E0E0E0]";

/** Setup/currency variant — same width/height, slightly squarer radius from setup Figma */
export const authFieldClassRounded = cn(
  authControlBoxClass,
  "rounded-2xl border bg-white px-4 text-[16px] font-normal leading-none text-[#0A0A0A]",
  "placeholder:font-normal placeholder:text-[#C7C7CC]",
  "appearance-none outline-none",
  "focus:border-[#5921B5] focus:outline-none focus:ring-2 focus:ring-[#5921B5]/20"
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
    "flex items-center justify-center bg-[var(--primary-500,#5921B5)]",
    "text-[16px] font-semibold leading-none text-white",
    "transition-[transform,background-color] duration-150",
    enabled ? "hover:bg-[#4A1C96] active:scale-[0.98]" : "cursor-not-allowed"
  );

export const authOrDividerClass =
  "flex w-full min-w-0 items-center gap-3";

export const authLinkClass = "font-medium text-[var(--primary-500,#5921B5)]";

export const authMutedClass = "text-[#8E8E93]";

export const authErrorClass = "mt-1.5 text-[0.8125rem] text-[#F43F5E]";

/** Switch link under the CTA — form `gap-4` + a little extra so it isn’t tight on the button. */
export const authFooterClass =
  "mt-2 w-full text-center text-base text-[#8E8E93]";
