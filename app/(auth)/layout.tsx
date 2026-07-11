import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-frame min-h-dvh safe-x">
      {children}
    </div>
  );
}
