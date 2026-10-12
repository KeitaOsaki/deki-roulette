export type GuideMedia = {
  /** アニメーション WebP か、静止画のスクリーンショットか。 */
  animated: boolean;
  /** 読み込み前に枠の高さを確保して、レイアウトがずれないようにするための実寸。 */
  width: number;
  height: number;
};

/** 使い方ガイドに載せるスクリーンショットとアニメーション。実体は
 *  `public/guide/media/<言語>-<キー>.webp`。アニメーションには、動きを減らす設定の
 *  利用者に出す最後のコマの静止画 `<言語>-<キー>-still.webp` が付く。 */
export const GUIDE_MEDIA = {
  "roulette-add": { animated: true, width: 576, height: 458 },
  "roulette-spin": { animated: true, width: 576, height: 851 },
  "roulette-copy": { animated: false, width: 576, height: 851 },
  "order-add": { animated: true, width: 576, height: 521 },
  "order-shuffle": { animated: true, width: 576, height: 523 },
  "order-copy": { animated: false, width: 576, height: 523 },
} as const satisfies Record<string, GuideMedia>;

export type GuideMediaKey = keyof typeof GUIDE_MEDIA;

export const guideMediaPath = (key: GuideMediaKey, locale: string, still = false) =>
  `/guide/media/${locale}-${key}${still ? "-still" : ""}.webp`;
