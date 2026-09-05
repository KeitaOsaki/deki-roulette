import { useEffect, useState } from "react";
import { preferredLocale, type Locale } from "../i18n";

/** ブラウザの言語が今のページと違うときだけ、対応する言語版を提案する。
 *  自動リダイレクトはしない。共有された URL の言語を上書きしてしまうため。 */
export function useLocaleSuggestion(locale: Locale): Locale | null {
  // 閲覧者ごとに変わる内容なので、静的 HTML には出さずマウント後に決める
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    const languages =
      navigator.languages?.length > 0
        ? navigator.languages
        : [navigator.language];
    const preferred = preferredLocale(languages);
    setSuggested(preferred === locale ? null : preferred);
  }, [locale]);

  return suggested;
}
