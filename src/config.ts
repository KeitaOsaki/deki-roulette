/** 彩度と明度を揃えた 10 色。ラベルとセパレータを地色（インク）で描くため、
 *  どのスライスも暗色テキストで 4.5:1 を超える明るさに寄せてある。 */
export const SLICE_COLORS = [
  "#FF8080",
  "#FFA366",
  "#F2CE5C",
  "#A3DB6B",
  "#5FD6A8",
  "#5CC9E0",
  "#7BAEF5",
  "#A48CF0",
  "#CE8CEE",
  "#FF85C0",
] as const;

export const SPIN_DURATION_MS = 4500;
export const SPIN_EASING = "cubic-bezier(0.15, 0.85, 0.3, 1)";

/** transitionend が発火しない環境（背景タブ等）向けの保険。 */
export const SPIN_FALLBACK_MS = SPIN_DURATION_MS + 600;
export const REDUCED_MOTION_SPIN_MS = 320;

export const MIN_ITEMS = 2;
export const MAX_ITEMS = 24;
export const MAX_LABEL_LENGTH = 20;

/** 当たり指定の隠しジェスチャ。短すぎると通常のタップで誤爆する。 */
export const LONG_PRESS_MS = 600;

/** 指定直後だけ印を見せる時間。以降はリストに触れない限り痕跡を残さない。 */
export const TARGET_HINT_MS = 1600;

/** 順番の結果を 1 件ずつ出すときの間隔。 */
export const ORDER_REVEAL_STEP_MS = 160;

/** tailwind.config.ts の animation.reveal と同じ長さ。演出の終了時刻の計算に使う。 */
export const REVEAL_ANIM_MS = 360;

/** prefers-reduced-motion のときは 1 件ずつ出さないので、演出はこの時間で終わる。 */
export const REDUCED_MOTION_REVEAL_MS = 200;

/** コピーできたことを伝える表示を出しておく時間。 */
export const COPY_FEEDBACK_MS = 1800;
