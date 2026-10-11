import { useSyncExternalStore } from "react";
import { preferredLocale, type Locale } from "../i18n";

function subscribe(onChange: () => void) {
  window.addEventListener("languagechange", onChange);
  return () => window.removeEventListener("languagechange", onChange);
}

function getSnapshot(): Locale {
  const languages =
    navigator.languages?.length > 0
      ? navigator.languages
      : [navigator.language];
  return preferredLocale(languages);
}

/** ブラウザの言語が今のページと違うときだけ、対応する言語版を提案する。
 *  自動リダイレクトはしない。共有された URL の言語を上書きしてしまうため。 */
export function useLocaleSuggestion(locale: Locale): Locale | null {
  // 閲覧者ごとに変わる内容なので、サーバ側は null を返して静的 HTML には出さない
  const preferred = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return preferred === locale ? null : preferred;
}
