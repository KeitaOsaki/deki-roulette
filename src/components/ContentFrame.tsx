import type { ReactNode } from "react";
import { useLocaleSuggestion } from "../hooks/useLocaleSuggestion";
import { PAGE_PATHS, translations, type Locale, type Page } from "../i18n";
import LocaleNotice from "./LocaleNotice";
import LocaleSwitch from "./LocaleSwitch";

const PILL_LINK_CLASS =
  "rounded-full border border-ink-700 bg-ink-800 px-3.5 py-[0.4375rem] text-xs font-bold text-muted transition-colors hover:border-ivory/40 hover:text-ivory";

const FOOTER_LINK_CLASS =
  "underline decoration-ink-500 underline-offset-4 transition-colors hover:text-ivory hover:decoration-ivory";

type Props = {
  locale: Locale;
  page: Page;
  title: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
};

/** 規約や使い方のように、読ませる文章を載せるページの枠。 */
export default function ContentFrame({
  locale,
  page,
  title,
  backHref,
  backLabel,
  children,
}: Props) {
  const suggestedLocale = useLocaleSuggestion(locale);
  const t = translations[locale];

  return (
    <div className="min-h-screen bg-ink-900 font-sans text-ivory">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 py-10 sm:px-8">
        {suggestedLocale !== null ? (
          <LocaleNotice locale={suggestedLocale} page={page} />
        ) : null}

        <header className="mb-12 flex flex-col-reverse gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className="shrink-0 text-[2.1rem] font-black leading-none tracking-[-0.035em] sm:text-[2.6rem]">
            {title}
          </h1>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <a href={backHref} className={PILL_LINK_CLASS}>
              <span aria-hidden="true">← </span>
              {backLabel}
            </a>
            <LocaleSwitch locale={locale} page={page} />
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-ink-700 pt-8 sm:mt-24">
          <nav
            aria-label={t.footerNavLabel}
            className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted"
          >
            <a href={PAGE_PATHS.roulette[locale]} className={FOOTER_LINK_CLASS}>
              {t.rouletteNavLabel}
            </a>
            <a href={PAGE_PATHS.order[locale]} className={FOOTER_LINK_CLASS}>
              {t.orderNavLabel}
            </a>
            <a href={PAGE_PATHS.guide[locale]} className={FOOTER_LINK_CLASS}>
              {t.guideNavLabel}
            </a>
            <a href={PAGE_PATHS.privacy[locale]} className={FOOTER_LINK_CLASS}>
              {t.privacyLinkLabel}
            </a>
          </nav>
          <p className="mt-6 pb-2 text-xs text-muted">&copy; 2026 basekeita</p>
        </footer>
      </div>
    </div>
  );
}
