import { memo } from "react";
import { revealDelayMs } from "../hooks/useOrder";
import type { T } from "../i18n";
import type { Item } from "../types";

type Props = {
  ordered: Item[] | null;
  revealing: boolean;
  reducedMotion: boolean;
  t: T;
};

function OrderResult({ ordered, revealing, reducedMotion, t }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full max-w-sm flex-col justify-center"
    >
      {ordered === null ? (
        <p className="rounded-2xl border border-dashed border-ink-600 px-4 py-10 text-center text-xs text-muted">
          {revealing ? t.orderShuffling : t.orderResultPlaceholder}
        </p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {ordered.map((item, i) => (
            <li
              key={item.id}
              // 1 件ずつ遅らせて出す。全部そろうまで先の順位が読めないようにする。
              style={{ animationDelay: `${revealDelayMs(i, reducedMotion)}ms` }}
              className={`flex animate-reveal items-center gap-3 rounded-xl border px-3 py-2 ${
                i === 0
                  ? "border-gold/60 bg-gold/10 text-gold"
                  : "border-ink-700 bg-ink-800 text-ivory"
              }`}
            >
              <span
                aria-label={t.orderRankAriaLabel(i + 1)}
                className={`w-5 shrink-0 text-right text-sm font-black tabular-nums ${
                  i === 0 ? "text-gold" : "text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0 truncate text-sm font-bold">
                {item.label}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default memo(OrderResult);
