import type { LocaleCode } from "./types";

export const APP_LANGUAGES: { id: LocaleCode; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "pt", label: "Português" },
  { id: "de", label: "Deutsch" },
  { id: "it", label: "Italiano" },
  { id: "zh", label: "中文" },
  { id: "ja", label: "日本語" },
  { id: "ko", label: "한국어" },
  { id: "ar", label: "العربية" },
  { id: "hi", label: "हिन्दी" },
  { id: "id", label: "Bahasa Indonesia" },
  { id: "tr", label: "Türkçe" },
  { id: "ru", label: "Русский" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";

export function localeFromStoredLanguage(value?: string | null): LocaleCode {
  const trimmed = value?.trim();
  if (!trimmed) return DEFAULT_LOCALE;
  const byLabel = APP_LANGUAGES.find(
    (lang) => lang.label.toLowerCase() === trimmed.toLowerCase()
  );
  if (byLabel) return byLabel.id;
  const byId = APP_LANGUAGES.find((lang) => lang.id === trimmed.toLowerCase());
  return byId?.id ?? DEFAULT_LOCALE;
}

export function labelForLocale(code: LocaleCode): string {
  return (
    APP_LANGUAGES.find((lang) => lang.id === code)?.label ??
    APP_LANGUAGES[0].label
  );
}

export function isRtlLocale(code: LocaleCode): boolean {
  return code === "ar";
}
