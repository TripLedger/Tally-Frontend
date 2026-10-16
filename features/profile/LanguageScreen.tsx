"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { AuthBackButton } from "@/features/auth";
import { APP_LANGUAGES, type LocaleCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAddToast, useAuthStore, useUser } from "@/store";
import { useLocale, useSetLocale, useT } from "@/store/localeStore";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5921B5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA]";

/**
 * Language picker — persists to localStorage (+ user mock) for API later.
 */
export function LanguageScreen() {
  const router = useRouter();
  const user = useUser();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const addToast = useAddToast();
  const t = useT();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const [saving, setSaving] = useState(false);

  const onSelect = async (next: LocaleCode, label: string) => {
    if (saving || next === locale) return;
    const previous = locale;
    setSaving(true);
    try {
      setLocale(next);
      const ok = await updateProfile({ language: label });
      if (!ok) {
        setLocale(previous);
        addToast({ message: t.language.failed, variant: "error" });
        return;
      }
      addToast({
        message: t.language.updated,
        variant: "success",
        duration: 2000,
      });
      router.push("/profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full flex-col",
        "bg-[var(--new-bg,#FAFAFA)]",
        "px-5 xs:px-6",
        "pb-[max(2rem,calc(var(--safe-bottom)+1.5rem))]",
        "pt-[calc(max(var(--safe-top),47px)+1rem)]"
      )}
    >
      <div className="flex shrink-0 items-center">
        <AuthBackButton href="/profile" label={t.common.back} />
      </div>

      <h1 className="mt-4 text-tabr-ink-heading-2">{t.language.title}</h1>
      <p className="text-tabr-ink-paragraph-small mt-2">{t.language.subtitle}</p>

      <section
        className={cn(
          "mt-6 overflow-hidden rounded-[20px] bg-white",
          "shadow-[0_2px_16px_rgba(21,19,26,0.05)]"
        )}
        aria-label={t.language.title}
      >
        {APP_LANGUAGES.map((lang, index) => {
          const active = lang.id === locale;
          return (
            <div key={lang.id}>
              {index > 0 ? (
                <div className="mx-4 h-px bg-[#F0EEF5]" aria-hidden />
              ) : null}
              <button
                type="button"
                disabled={saving}
                onClick={() => void onSelect(lang.id, lang.label)}
                className={cn(
                  "flex min-h-[52px] w-full items-center gap-3 px-4 py-3.5 text-left",
                  "transition-colors hover:bg-[#FAFAFA] active:bg-[#F5F5F7]",
                  "disabled:opacity-60",
                  focusRing
                )}
              >
                <span className="min-w-0 flex-1 text-[15px] font-medium leading-5 text-[#15131A]">
                  {lang.label}
                </span>
                {active ? (
                  <Check
                    className="h-5 w-5 shrink-0 text-[#5921B5]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                ) : null}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
