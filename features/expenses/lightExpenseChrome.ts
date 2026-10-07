import { cn } from "@/lib/utils";

const geistClass =
  "[font-family:var(--font-geist-sans),Geist,system-ui,sans-serif]";

/** Shared column for the light outing expense flow (Figma). */
export const lightExpenseShellClass = cn(
  "mx-auto flex min-h-dvh w-full flex-col",
  "bg-[var(--new-bg,#FAFAFA)]",
  "px-5 xs:px-6",
  "pb-[max(68px,calc(var(--safe-bottom)+2rem))]",
  "pt-[calc(max(var(--safe-top),47px)+1rem)]",
  geistClass
);

/** Same column, locked to the screen so a bottom CTA stays visible. */
export const lightExpensePinnedShellClass = cn(
  lightExpenseShellClass,
  "h-dvh max-h-dvh min-h-0 overflow-hidden"
);

/**
 * Space under primary CTAs (Send / Continue) — Figma leaves a clear band
 * below the pill, not flush to the home indicator.
 */
export const lightExpenseCtaFooterClass = cn(
  "shrink-0",
  "pb-[max(68px,calc(var(--safe-bottom)+2.5rem))]"
);

/** Success screen — smaller than Send, but still a visible gap under the CTA. */
export const lightExpenseSuccessFooterClass = cn(
  "shrink-0",
  "pb-[max(48px,calc(var(--safe-bottom)+1.5rem))]"
);

export const lightExpenseFocusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";
