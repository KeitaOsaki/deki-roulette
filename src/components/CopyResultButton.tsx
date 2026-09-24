import { useCallback, useEffect, useRef, useState } from "react";
import { COPY_FEEDBACK_MS } from "../config";
import type { T } from "../i18n";

type Props<R> = {
  /** null のあいだはボタンを出さない。枠の高さは保つのでレイアウトは動かない。 */
  result: R | null;
  toText: (result: R) => string;
  t: T;
};

export default function CopyResultButton<R>({ result, toText, t }: Props<R>) {
  // コピー済みかどうかは「どの結果をコピーしたか」から導く。フラグにすると
  // 結果が変わるたびに effect で消して回ることになる。
  const [copiedResult, setCopiedResult] = useState<R | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copied = result !== null && copiedResult === result;

  const handleCopy = useCallback(async () => {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(toText(result));
    } catch {
      return;
    }
    setCopiedResult(result);
    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setCopiedResult(null),
      COPY_FEEDBACK_MS
    );
  }, [result, toText]);

  return (
    <div className="flex h-8 items-center">
      {result !== null ? (
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-ink-700 bg-ink-800 px-4 py-1.5 text-xs font-bold text-muted transition-colors hover:border-ivory/40 hover:text-ivory"
        >
          {copied ? t.copied : t.copyResult}
        </button>
      ) : null}
    </div>
  );
}
