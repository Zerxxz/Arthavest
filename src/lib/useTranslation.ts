"use client";

import { useAppStore } from "@/lib/store";
import { translate, type Language } from "@/lib/i18n";

/**
 * Hook to access translation function + current language.
 * Reads language from Zustand store (persisted to localStorage via store init).
 *
 * Usage:
 *   const { t, lang, setLang } = useTranslation();
 *   t("nav.marketplace")                    // → "Marketplace" / "Marketplace" / "市场"
 *   t("market.subtitle", { count: 6 })      // → "6 verified MSMEs · ..."
 *   setLang("zh")
 */
export function useTranslation() {
  const lang = useAppStore((s) => s.language);
  const setLang = useAppStore((s) => s.setLanguage);

  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(lang, key, vars);

  return { t, lang, setLang };
}
