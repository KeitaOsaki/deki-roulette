import { useState, type ReactNode } from "react";
import { useLocaleSuggestion } from "../hooks/useLocaleSuggestion";
import { PAGE_PATHS, type Locale, type Page, type T } from "../i18n";
import LocaleNotice from "./LocaleNotice";
import LocaleSwitch from "./LocaleSwitch";

const SUMMARY_CLASS =
  "flex cursor-pointer list-none items-center gap-2 text-base font-bold text-ivory before:text-muted before:transition-transform before:content-['▸'] group-open:before:rotate-90 [&::-webkit-details-marker]:hidden";

type Props = {
  locale: Locale;
  page: Page;
  title: string;
  tagline: string;
  /** 演出中。開いたままの説明を畳む。 */
  busy: boolean;
  t: T;
  help: ReactNode;
  useCases: string;
  children: ReactNode;
};

export default function PageFrame({
  locale,
  page,
  title,
  tagline,
  busy,
  t,
  help,
  useCases,
  children,
}: Props) {
  const suggestedLocale = useLocaleSuggestion(locale);
  const [helpOpen, setHelpOpen] = useState(false);

  const other: Page = page === "order" ? "roulette" : "order";
  const otherLabel = page === "order" ? t.rouletteNavLabel : t.orderNavLabel;

  return (
    <div className="min-h-screen bg-ink-900 font-sans text-ivory">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 py-10 sm:px-8">
        {suggestedLocale !== null ? (
          <LocaleNotice locale={suggestedLocale} page={page} />
        ) : null}

        <header className="mb-12 flex flex-col-reverse gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-[2.1rem] font-black leading-none tracking-[-0.035em] sm:text-[2.6rem]">
              {title}
            </h1>
            <p className="mt-2.5 text-balance text-sm text-muted">{tagline}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <a
              href={PAGE_PATHS[other][locale]}
              className="rounded-full border border-ink-700 bg-ink-800 px-3.5 py-[0.4375rem] text-xs font-bold text-muted transition-colors hover:border-ivory/40 hover:text-ivory"
            >
              {otherLabel}
              <span aria-hidden="true"> →</span>
            </a>
            <LocaleSwitch locale={locale} page={page} />
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-ink-700 pt-8 text-sm leading-relaxed text-muted sm:mt-24">
          {/* 開始した瞬間に畳む。人前で回すときに開きっぱなしを踏まないための保険 */}
          <details
            className="group"
            open={helpOpen && !busy}
            onToggle={(e) => setHelpOpen(e.currentTarget.open)}
          >
            <summary className={SUMMARY_CLASS}>{t.helpTitle}</summary>
            <div className="mt-3 max-w-[62ch] space-y-2.5 pl-5">{help}</div>
          </details>

          <details className="group mt-5">
            <summary className={SUMMARY_CLASS}>{t.useCasesTitle}</summary>
            <p className="mt-3 max-w-[62ch] pl-5">{useCases}</p>
          </details>

          <details className="group mt-5">
            <summary className={SUMMARY_CLASS}>{t.noticeTitle}</summary>
            <p className="mt-3 max-w-[62ch] pl-5">{t.notice}</p>
          </details>

          <p className="mt-10 pb-2 text-xs text-muted">&copy; 2026 basekeita</p>
        </footer>
      </div>
    </div>
  );
}
