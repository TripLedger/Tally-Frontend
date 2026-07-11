import type { ReactNode } from "react";

export default function JoinLayout({ children }: { children: ReactNode }) {
  return <div className="mobile-frame min-h-dvh">{children}</div>;
}
