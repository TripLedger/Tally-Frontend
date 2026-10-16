import type { ReactNode } from "react";

export default function JoinLayout({ children }: { children: ReactNode }) {
  return <div className="phone-shell mobile-frame">{children}</div>;
}
