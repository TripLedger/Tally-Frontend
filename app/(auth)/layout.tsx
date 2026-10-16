import type { ReactNode } from "react";

/**
 * Auth phone column — same global `.mobile-frame` / `.phone-shell` as the app.
 * Full-bleed on phones; capped + centered from tablet up. Screens paint their own bg.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-[#221C2B] md:bg-[#050508]">
      <div className="phone-shell mobile-frame mobile-frame-auth">{children}</div>
    </div>
  );
}
