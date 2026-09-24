import { useState, type CSSProperties, type ReactNode } from "react";
import { AD_SLOTS } from "../config";
import { useLocaleSuggestion } from "../hooks/useLocaleSuggestion";
import { PAGE_PATHS, type Locale, type Page, type T } from "../i18n";
import AdUnit from "./AdUnit";
import LocaleNotice from "./LocaleNotice";
import LocaleSwitch from "./LocaleSwitch";

const SUMMARY_CLASS =
  "flex cursor-pointer list-none items-center gap-2 text-base font-bold text-ivory before:text-muted before:transition-transform before:content-['▸'] group-open:before:rotate-90 [&::-webkit-details-marker]:hidden";

const SIDE_AD_STYLE: CSSProperties = { display: "inline-block", width: 160, height: 600 };
const FOOTER_AD_STYLE: CSSProperties = { display: "block" };

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
    // 左右に同じ幅の列を取り、本文の列を画面中央に保ったまま左の余白へ広告を置く
    <div className="min-h-screen bg-ink-900 font-sans text-ivory xl:grid xl:grid-cols-[1fr_minmax(0,48rem)_1fr]">
      {AD_SLOTS.side !== null ? (
        <aside className="hidden pr-6 pt-10 xl:block">
          <div className="sticky top-10 ml-auto w-[160px]">
            <AdUnit slot={AD_SLOTS.side} style={SIDE_AD_STYLE} />
          </div>
        </aside>
      ) : null}

      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 py-10 sm:px-8 xl:col-start-2">
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

        {AD_SLOTS.footer !== null ? (
          <div className="mt-16 sm:mt-24">
            <AdUnit slot={AD_SLOTS.footer} style={FOOTER_AD_STYLE} responsive />
          </div>
        ) : null}

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

          <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-2 text-xs text-muted">
            <p>&copy; 2026 basekeita</p>
            <a
              href={PAGE_PATHS.privacy[locale]}
              className="underline decoration-ink-500 underline-offset-4 transition-colors hover:text-ivory hover:decoration-ivory"
            >
              {t.privacyLinkLabel}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
