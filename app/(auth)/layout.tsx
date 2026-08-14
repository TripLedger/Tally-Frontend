import type { ReactNode } from "react";

/**
 * Auth route shell — full-width on mobile; centered 430px column on large screens.
 * Individual screens own light/dark backgrounds.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-white lg:flex lg:justify-center lg:bg-[#050508]">
      <div className="min-h-dvh w-full lg:max-w-[430px] lg:bg-white">
        {children}
      </div>
    </div>
  );
}
