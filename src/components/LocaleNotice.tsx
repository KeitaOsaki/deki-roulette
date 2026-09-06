import { memo } from "react";
import {
  PAGE_PATHS,
  translations,
  type Locale,
  type Page,
} from "../i18n";

type Props = {
  /** 提案する言語。今表示しているページの言語ではない。 */
  locale: Locale;
  /** 今表示しているページ。言語だけを差し替えた URL に送る。 */
  page: Page;
};

function LocaleNotice({ locale, page }: Props) {
  return (
    <a
      href={PAGE_PATHS[page][locale]}
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
