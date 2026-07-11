import { MobileShell } from "@/components/layout/MobileShell";
import { PendingInviteResolver } from "@/features/trips/useResolvePendingInvite";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileShell>
      <PendingInviteResolver />
      {children}
    </MobileShell>
  );
}
