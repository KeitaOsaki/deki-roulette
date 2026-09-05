import { useCallback, useEffect, useState } from "react";
import type { Locale } from "../i18n";

function detectLocale(): Locale {
  return navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  // 切替は SPA 内で完結するため、支援技術に言語を伝えるには手動同期が要る
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return { locale, setLocale: useCallback((next: Locale) => setLocale(next), []) };
}

export { detectLocale };
