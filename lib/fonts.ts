import { Playfair_Display } from "next/font/google";
import { GeistSans } from "geist/font/sans";

/**
 * Single Playfair instance for the app.
 * Use `playfair.className` on headings — more reliable than the CSS variable
 * alone (Next HMR can leave `--font-playfair` unset on `<html>`).
 */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export { GeistSans };
