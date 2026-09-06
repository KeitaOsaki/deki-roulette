import { memo } from "react";
import {
  LOCALES,
  PAGE_PATHS,
  translations,
  type Locale,
  type Page,
} from "../i18n";

type Props = {
  locale: Locale;
  page: Page;
};

function LocaleSwitch({ locale, page }: Props) {
  return (
    <nav
      aria-label={translations[locale].localeSwitchLabel}
      className="flex shrink-0 gap-1 rounded-full border border-ink-700 bg-ink-800 p-1"
    >
      {LOCALES.map((loc) => {
        const active = loc === locale;
        return (
          <a
            key={loc}
            href={PAGE_PATHS[page][loc]}
            hrefLang={loc}
            lang={loc}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              active
                ? "bg-ivory text-ink-900"
                : "text-muted hover:text-ivory"
            }`}
          >
            {translations[loc].localeName}
          </a>
        );
      })}
    </nav>
  );
}

export default memo(LocaleSwitch);
