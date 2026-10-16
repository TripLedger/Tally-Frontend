"use client";

import { AuthBackButton } from "@/features/auth";
import { cn } from "@/lib/utils";
import { useT } from "@/store/localeStore";

const HELP_EMAIL = "tabr.info@gmail.com";

/**
 * Figma — Help centre (Profile).
 */
export function HelpCentreScreen() {
  const t = useT();

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col bg-white",
        "px-5 xs:px-6",
        "pb-[max(2rem,calc(var(--safe-bottom)+1.5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/profile" label={t.common.back} />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">{t.help.title}</h1>

      <p className="mt-8 text-[18px] font-semibold leading-6 tracking-[-0.01em] text-[#15131A]">
        {t.help.heading}
      </p>
      <p className="mt-2 text-[14px] font-normal leading-5 text-[#8E8E93]">
        {t.help.contactPrefix}{" "}
        <a
          href={`mailto:${HELP_EMAIL}`}
          className="font-medium text-[#15131A] underline-offset-2 hover:underline"
        >
          {HELP_EMAIL}
        </a>
      </p>
    </div>
  );
}
