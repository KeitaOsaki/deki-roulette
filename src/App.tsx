import { useState } from "react";
import ItemList from "./components/ItemList";
import LocaleNotice from "./components/LocaleNotice";
import LocaleSwitch from "./components/LocaleSwitch";
import RouletteWheel from "./components/RouletteWheel";
import { useLocaleSuggestion } from "./hooks/useLocaleSuggestion";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { makeItems, useRoulette } from "./hooks/useRoulette";
import { localeFromPath, translations } from "./i18n";

const SUMMARY_CLASS =
  "flex cursor-pointer list-none items-center gap-2 text-base font-bold text-ivory before:text-muted before:transition-transform before:content-['▸'] group-open:before:rotate-90 [&::-webkit-details-marker]:hidden";

export default function App() {
  const locale = localeFromPath(window.location.pathname);
  const suggestedLocale = useLocaleSuggestion(locale);
  const reducedMotion = useReducedMotion();
  const t = translations[locale];
  const [helpOpen, setHelpOpen] = useState(false);

  const roulette = useRoulette(
    () => makeItems(translations[locale].defaultItems),
    reducedMotion
  );

  return (
    <div className="min-h-screen bg-ink-900 font-sans text-ivory">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 py-10 sm:px-8">
        {suggestedLocale !== null ? (
          <LocaleNotice locale={suggestedLocale} />
        ) : null}

        <header className="mb-12 flex flex-col-reverse gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-[2.1rem] font-black leading-none tracking-[-0.035em] sm:text-[2.6rem]">
              {t.title}
            </h1>
            <p className="mt-2.5 text-balance text-sm text-muted">{t.tagline}</p>
          </div>
          <div className="flex justify-end">
            <LocaleSwitch locale={locale} />
          </div>
        </header>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex flex-col items-center gap-6">
            <RouletteWheel
              items={roulette.items}
              rotation={roulette.rotation}
              spinning={roulette.spinning}
              onSpinEnd={roulette.finishSpin}
            />

            <div
              role="status"
              aria-live="polite"
              className="flex h-14 items-center justify-center text-center"
            >
              {roulette.result !== null ? (
                <span className="animate-reveal rounded-2xl border border-gold/60 bg-gold/10 px-6 py-3 text-xl font-black text-gold">
                  {roulette.result}
                </span>
              ) : (
                <span className="text-xs text-muted">
                  {roulette.spinning ? t.spinning : t.resultPlaceholder}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={roulette.spin}
              disabled={!roulette.canSpin}
              aria-busy={roulette.spinning}
              className="rounded-full bg-flare px-12 py-3.5 text-lg font-black tracking-wide text-ink-900 shadow-[0_8px_28px_-8px_#FF4E63] transition-transform hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-muted disabled:shadow-none"
            >
              {roulette.spinning ? t.spinning : t.spin}
            </button>
          </div>

          <ItemList
            items={roulette.items}
            targetId={roulette.targetId}
            spinning={roulette.spinning}
            atCapacity={roulette.atCapacity}
            t={t}
            onAdd={roulette.addItem}
            onRemove={roulette.removeItem}
            onToggleTarget={roulette.toggleTarget}
          />
        </div>

        <footer className="mt-16 border-t border-ink-700 pt-8 text-sm leading-relaxed text-muted sm:mt-24">
          {/* スピンした瞬間に畳む。人前で回すときに開きっぱなしを踏まないための保険 */}
          <details
            className="group"
            open={helpOpen && !roulette.spinning}
            onToggle={(e) => setHelpOpen(e.currentTarget.open)}
          >
            <summary className={SUMMARY_CLASS}>{t.helpTitle}</summary>
            <div className="mt-3 max-w-[62ch] space-y-2.5 pl-5">
              <p>{t.helpBasic}</p>
              <h3 className="pt-2 font-bold text-ivory">{t.helpAimTitle}</h3>
              <p>{t.helpAim}</p>
              <p>{t.helpAimStealth}</p>
              <p>{t.helpAimRandom}</p>
            </div>
          </details>

          <details className="group mt-5">
            <summary className={SUMMARY_CLASS}>{t.useCasesTitle}</summary>
            <p className="mt-3 max-w-[62ch] pl-5">{t.useCases}</p>
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
