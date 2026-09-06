import { useCallback, useEffect, useRef, useState } from "react";
import ItemList from "../components/ItemList";
import OrderResult from "../components/OrderResult";
import PageFrame from "../components/PageFrame";
import { COPY_FEEDBACK_MS } from "../config";
import { useOrder } from "../hooks/useOrder";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { makeItems } from "../items";
import { translations, type Locale } from "../i18n";
import type { Item } from "../types";

type Props = {
  locale: Locale;
};

export default function OrderPage({ locale }: Props) {
  const reducedMotion = useReducedMotion();
  const t = translations[locale];

  const order = useOrder(
    () => makeItems(translations[locale].orderDefaultItems),
    reducedMotion
  );

  // コピー済みかどうかは「どの結果をコピーしたか」から導く。フラグにすると
  // 並べ替え直すたびに effect で消して回ることになる。
  const [copiedResult, setCopiedResult] = useState<Item[] | null>(null);
  const copyTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const { ordered } = order;
  const copied = ordered !== null && copiedResult === ordered;

  const handleCopy = useCallback(async () => {
    if (ordered === null) return;
    const text = ordered
      .map((item, i) => `${i + 1}. ${item.label}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopiedResult(ordered);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(
      () => setCopiedResult(null),
      COPY_FEEDBACK_MS
    );
  }, [ordered]);

  return (
    <PageFrame
      locale={locale}
      page="order"
      title={t.orderTitle}
      tagline={t.orderTagline}
      busy={order.revealing}
      t={t}
      useCases={t.orderUseCases}
      help={
        <>
          <p>{t.orderHelpBasic}</p>
          <h3 className="pt-2 font-bold text-ivory">{t.orderHelpAimTitle}</h3>
          <p>{t.orderHelpAim}</p>
          <p>{t.orderHelpAimStealth}</p>
          <p>{t.orderHelpAimRandom}</p>
        </>
      }
    >
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex w-full flex-col items-center gap-6 sm:max-w-sm">
          <OrderResult
            ordered={order.ordered}
            revealing={order.revealing}
            reducedMotion={reducedMotion}
            t={t}
          />

          <button
            type="button"
            onClick={order.shuffleItems}
            disabled={!order.canShuffle}
            aria-busy={order.revealing}
            className="rounded-full bg-flare px-12 py-3.5 text-lg font-black tracking-wide text-ink-900 shadow-[0_8px_28px_-8px_#FF4E63] transition-transform hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-muted disabled:shadow-none"
          >
            {order.revealing ? t.orderShuffling : t.orderShuffle}
          </button>

          <div className="flex h-8 items-center">
            {order.ordered !== null && !order.revealing ? (
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-ink-700 bg-ink-800 px-4 py-1.5 text-xs font-bold text-muted transition-colors hover:border-ivory/40 hover:text-ivory"
              >
                {copied ? t.orderCopied : t.orderCopy}
              </button>
            ) : null}
          </div>
        </div>

        <ItemList
          items={order.items}
          marks={order.marks}
          busy={order.revealing}
          concealMarks={order.revealing || order.ordered !== null}
          atCapacity={order.atCapacity}
          t={t}
          onAdd={order.addItem}
          onRemove={order.removeItem}
          onLongPress={order.cycleMark}
        />
      </div>
    </PageFrame>
  );
}
