import CopyResultButton from "../components/CopyResultButton";
import ItemList from "../components/ItemList";
import OrderResult from "../components/OrderResult";
import PageFrame from "../components/PageFrame";
import { useOrder } from "../hooks/useOrder";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { makeItems } from "../items";
import { translations, type Locale } from "../i18n";
import type { Item } from "../types";

const orderToText = (ordered: Item[]) =>
  ordered.map((item, i) => `${i + 1}. ${item.label}`).join("\n");

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

          <CopyResultButton
            result={order.revealing ? null : order.ordered}
            toText={orderToText}
            t={t}
          />
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
