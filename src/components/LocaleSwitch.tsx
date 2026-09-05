import { memo } from "react";
import { LOCALES, translations, type Locale } from "../i18n";

type Props = {
  locale: Locale;
  onChange: (next: Locale) => void;
};

function LocaleSwitch({ locale, onChange }: Props) {
  return (
    <div className="flex shrink-0 gap-1 rounded-full border border-ink-700 bg-ink-800 p-1">
      {LOCALES.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            lang={loc}
            aria-pressed={active}
            onClick={() => onChange(loc)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              active
                ? "bg-ivory text-ink-900"
                : "text-muted hover:text-ivory"
            }`}
          >
            {translations[loc].localeName}
          </button>
        );
      })}
    </div>
  );
}

export default memo(LocaleSwitch);
