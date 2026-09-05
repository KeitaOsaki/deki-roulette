import { memo } from "react";
import { LOCALE_PATHS, translations, type Locale } from "../i18n";

type Props = {
  /** 提案する言語。今表示しているページの言語ではない。 */
  locale: Locale;
};

function LocaleNotice({ locale }: Props) {
  return (
    <a
      href={LOCALE_PATHS[locale]}
      hrefLang={locale}
      lang={locale}
      className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-800 px-4 py-2.5 text-center text-sm font-bold text-ivory transition-colors hover:border-ivory/40"
    >
      {translations[locale].localeSuggestion}
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default memo(LocaleNotice);
