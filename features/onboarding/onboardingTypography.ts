import type { CSSProperties } from "react";

/** Figma token: heading 2 — onboarding headlines */
export const onboardingHeading2Style: CSSProperties = {
  color: "#FFF",
  fontFamily: "var(--font-geist-sans), Geist, system-ui, sans-serif",
  fontSize: "var(--heading-2-font-size, 30px)",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "var(--heading-2-line-height, 30px)",
  letterSpacing: "var(--heading-2-letter-spacing, -1px)",
};

export const ONBOARDING_HEADLINE_WIDTH_PX = 224;
export const ONBOARDING_HEADLINE_HEIGHT_PX = 60;

/** Figma token: paragraph small/regular — onboarding body copy */
export const onboardingParagraphSmallStyle: CSSProperties = {
  alignSelf: "stretch",
  color: "var(--whites-500, #FFF)",
  fontFamily: "var(--font-definitions-font-family-body)",
  fontSize: "var(--paragraph-small-font-size, 14px)",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "var(--paragraph-small-line-height, 20px)",
  letterSpacing: "var(--paragraph-small-letter-spacing, 0)",
};
