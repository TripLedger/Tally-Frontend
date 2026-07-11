"use client";

import { StickyHeader } from "@/components/layout/StickyHeader";

export default function AddExpensePage() {
  return (
    <>
      <StickyHeader title="Add expense" backHref="/dashboard" />
      <div className="px-4 py-6">
        <p className="text-sm text-text-secondary">
          Choose how to log this expense — scan a receipt or enter it
          manually.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <div className="rounded-card border border-border-glass bg-background-card p-6 text-center">
            <p className="font-semibold text-text-primary">Scan receipt</p>
            <p className="mt-1 text-sm text-text-secondary">
              Snap a photo and let AI fill in the details
            </p>
          </div>
          <div className="rounded-card border border-border-glass bg-background-card p-6 text-center">
            <p className="font-semibold text-text-primary">Enter manually</p>
            <p className="mt-1 text-sm text-text-secondary">
              Amount, payer, and split in under 10 seconds
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
