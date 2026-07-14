import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface LegalDocumentProps {
  title: string;
  children: ReactNode;
}

export function LegalDocument({ title, children }: LegalDocumentProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0A0A0F]">
      <header className="sticky top-0 z-30 border-b border-[#ffffff0f] bg-[#0A0A0F] safe-top">
        <div className="relative mx-auto flex h-14 max-w-[430px] items-center justify-center px-4">
          <Link
            href="/"
            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-[10px] text-[#F8F8FF] transition-colors hover:bg-[#ffffff0a]"
            aria-label="Back to landing"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </Link>
          <h1 className="max-w-[240px] truncate text-center text-[17px] font-semibold leading-none tracking-[-0.01em] text-[#F8F8FF]">
            {title}
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[430px] flex-1 px-6 pb-12 pt-6">
        <p className="text-[13px] font-normal text-[#475569]">
          Last updated: June 2026
        </p>
        <div className="legal-prose">{children}</div>
      </main>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[16px] font-bold leading-snug text-[#F8F8FF]">
        {title}
      </h2>
      <div className="space-y-3 text-[14px] font-normal leading-[1.7] text-[#94A3B8]">
        {children}
      </div>
    </section>
  );
}
