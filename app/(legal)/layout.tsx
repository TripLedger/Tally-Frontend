import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-frame min-h-dvh bg-[#0A0A0F] safe-x">{children}</div>
  );
}
