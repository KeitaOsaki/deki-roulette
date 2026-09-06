import { useMemo } from "react";
import ItemList from "../components/ItemList";
import PageFrame from "../components/PageFrame";
import RouletteWheel from "../components/RouletteWheel";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRoulette } from "../hooks/useRoulette";
import { makeItems } from "../items";
import { translations, type Locale } from "../i18n";
import type { Marks } from "../types";

type Props = {
  locale: Locale;
};

export default function RoulettePage({ locale }: Props) {
  const reducedMotion = useReducedMotion();
  const t = translations[locale];

  const roulette = useRoulette(
    () => makeItems(translations[locale].defaultItems),
    reducedMotion
  );

  const marks = useMemo<Marks>(
    () => (roulette.targetId === null ? {} : { [roulette.targetId]: "target" }),
    [roulette.targetId]
  );

  return (
    <PageFrame
      locale={locale}
      page="roulette"
      title={t.title}
      tagline={t.tagline}
      busy={roulette.spinning}
      t={t}
      useCases={t.useCases}
      help={
        <>
          <p>{t.helpBasic}</p>
          <h3 className="pt-2 font-bold text-ivory">{t.helpAimTitle}</h3>
          <p>{t.helpAim}</p>
          <p>{t.helpAimStealth}</p>
          <p>{t.helpAimRandom}</p>
        </>
      }
    >
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
          marks={marks}
          busy={roulette.spinning}
          concealMarks={roulette.spinning}
          atCapacity={roulette.atCapacity}
          t={t}
          onAdd={roulette.addItem}
          onRemove={roulette.removeItem}
          onLongPress={roulette.toggleTarget}
        />
      </div>
    </PageFrame>
  );
}
