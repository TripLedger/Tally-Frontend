"use client";

import { StickyHeader } from "@/components/layout/StickyHeader";
import { useUser, useHomeCurrency } from "@/store";
import { Avatar } from "@/components/ui/Avatar";

export default function ProfilePage() {
  const user = useUser();
  const homeCurrency = useHomeCurrency();

  return (
    <>
      <StickyHeader title="Profile" />
      <div className="px-4 py-6">
        <div className="flex flex-col items-center py-8">
          <Avatar
            name={user?.displayName ?? "Guest"}
            src={user?.avatarUrl}
            size="lg"
          />
          <h2 className="mt-4 text-lg font-semibold text-text-primary">
            {user?.displayName ?? "Not signed in"}
          </h2>
          {user?.email && (
            <p className="mt-1 text-sm text-text-secondary">{user.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-card border border-border-glass bg-background-card px-4 py-3">
            <p className="text-xs text-text-disabled">Home currency</p>
            <p className="mt-0.5 font-medium text-text-primary">
              {homeCurrency}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
