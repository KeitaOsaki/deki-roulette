import { useEffect, useRef, type CSSProperties } from "react";
import { ADSENSE_CLIENT } from "../config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

/** StrictMode の effect 二重実行でも同じ枠へ二度 push しないための記録。
 *  二度目の push は「空きの ins がない」エラーになる。 */
const requested = new WeakSet<Element>();

// <head> に直接書かず、広告枠を持つページだけで読む。
// プライバシーポリシーでは Google のスクリプトも Cookie も走らせないため。
function loadScript() {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = SCRIPT_SRC;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

type Props = {
  slot: string;
  style: CSSProperties;
  /** レスポンシブ枠のときだけ渡す。固定サイズの枠では style の幅と高さが使われる。 */
  responsive?: boolean;
};

export default function AdUnit({ slot, style, responsive = false }: Props) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    loadScript();

    // display:none の枠を push すると幅 0 で失敗し、その枠は二度と埋まらない。
    // ブレークポイントで隠している枠は、表示されてから埋める。
    const observer = new ResizeObserver(() => {
      if (el.offsetWidth === 0) return;
      observer.disconnect();
      if (requested.has(el)) return;
      requested.add(el);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={style}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={responsive ? "auto" : undefined}
      data-full-width-responsive={responsive ? "true" : undefined}
      data-adtest={import.meta.env.DEV ? "on" : undefined}
    />
  );
}
