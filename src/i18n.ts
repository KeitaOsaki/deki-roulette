export type Locale = "ja" | "en";

export const translations = {
  ja: {
    localeName: "日本語",
    localeSwitchLabel: "言語",
    localeSuggestion: "日本語版はこちら",
    title: "デキレーレット",
    tagline: "迷ったら、まわす。",
    spin: "スピン",
    spinning: "スピン中…",
    resultPlaceholder: "スピンすると、ここに結果が出ます",
    resultAnnounce: (label: string) => `結果は ${label} です`,
    itemListTitle: "項目",
    addPlaceholder: "項目を入力",
    addButton: "追加",
    emptyList: "まずは項目を追加してください",
    needMoreItems: "項目をあと少なくとも 2 つ追加してください",
    atCapacity: (max: number) => `項目は ${max} 個までです`,
    itemCount: (count: number, max: number) => `${count} / ${max}`,
    removeAriaLabel: (label: string) => `${label} を削除`,
    helpTitle: "使い方",
    helpBasic:
      "項目を追加してスピンを押すだけです。項目は 2 個から 24 個まで登録できます。",
    helpAimTitle: "結果を決めておきたいとき",
    helpAim:
      "項目を 0.6 秒ほど長押しすると、その項目が次のスピンで選ばれます。もう一度長押しすると解除されます。キーボードの場合は項目にフォーカスして Enter を押しっぱなしにしてください。",
    helpAimStealth:
      "指定した印は、リストにカーソルを乗せている間だけ出ます。スピン中と結果表示中は消え、この説明もスピンを押すと自動で閉じます。",
    helpAimRandom: "何も指定しなければ、結果は本当にランダムです。",
    useCasesTitle: "こんなときに",
    useCases:
      "飲み会の幹事決め、ランチのお店選び、発表の順番決め、掃除当番、罰ゲーム、じゃんけんやあみだくじの代わりに。登録もインストールも不要で、スマホからも PC からも無料で使えます。",
    noticeTitle: "注意事項",
    notice:
      "本サービスの利用により生じたいかなる損害についても責任を負いません。",
    orderNavLabel: "順番決め",
    rouletteNavLabel: "ルーレット",
    orderTitle: "順番決め",
    orderTagline: "並び順は、ひと振りで。",
    orderShuffle: "並べ替え",
    orderShuffling: "並べ替え中…",
    orderResultPlaceholder: "並べ替えると、ここに順番が出ます",
    orderResultTitle: "結果",
    orderRankAriaLabel: (rank: number) => `${rank} 番目`,
    orderCopy: "結果をコピー",
    orderCopied: "コピーしました",
    orderMarkFirst: "先頭",
    orderMarkLast: "末尾",
    orderHelpBasic:
      "項目を追加して並べ替えを押すだけです。項目は 2 個から 24 個まで登録できます。",
    orderHelpAimTitle: "位置を決めておきたいとき",
    orderHelpAim:
      "項目を 0.6 秒ほど長押しすると、先頭 → 末尾 → 解除の順に切り替わります。先頭と末尾はそれぞれ 1 項目までで、別の項目に付け替えると前の指定は外れます。キーボードの場合は項目にフォーカスして Enter を押しっぱなしにしてください。",
    orderHelpAimStealth:
      "指定した印は、リストにカーソルを乗せている間だけ出ます。並べ替え中と結果表示中は消え、この説明も並べ替えを押すと自動で閉じます。",
    orderHelpAimRandom:
      "指定した項目以外の並びは常にランダムです。何も指定しなければ、順番は本当にランダムです。",
    orderUseCases:
      "発表やプレゼンの順番決め、幹事の持ち回り、掃除当番の割り当て、チーム内のレビュー担当、席替え、くじ引きの代わりに。登録もインストールも不要で、スマホからも PC からも無料で使えます。",
    orderDefaultItems: ["A チーム", "B チーム", "C チーム", "D チーム"],
    defaultItems: ["ラーメン", "カレー", "寿司", "焼肉"],
  },
  en: {
    localeName: "English",
    localeSwitchLabel: "Language",
    localeSuggestion: "View this page in English",
    title: "Roulette",
    tagline: "Can't decide? Spin.",
    spin: "Spin",
    spinning: "Spinning…",
    resultPlaceholder: "Spin the wheel to see the result",
    resultAnnounce: (label: string) => `The result is ${label}`,
    itemListTitle: "Items",
    addPlaceholder: "Add an item",
    addButton: "Add",
    emptyList: "Add an item to get started",
    needMoreItems: "Add at least 2 items",
    atCapacity: (max: number) => `You can add up to ${max} items`,
    itemCount: (count: number, max: number) => `${count} / ${max}`,
    removeAriaLabel: (label: string) => `Remove ${label}`,
    helpTitle: "How to use",
    helpBasic:
      "Add your options and press Spin. You can register between 2 and 24 items.",
    helpAimTitle: "When the result is already decided",
    helpAim:
      "Press and hold an item for about 0.6 seconds and it will be the one the next spin lands on. Hold again to clear it. With a keyboard, focus the item and hold Enter.",
    helpAimStealth:
      "The mark only appears while your cursor is over the list. It disappears while spinning and while the result is up, and this section closes itself the moment you press Spin.",
    helpAimRandom: "With nothing marked, the result really is random.",
    useCasesTitle: "Good for",
    useCases:
      "Picking who organizes the party, choosing where to have lunch, setting the running order, assigning chores, forfeits, or standing in for a coin toss. No sign-up, no install — free on phone and desktop.",
    noticeTitle: "Disclaimer",
    notice:
      "We are not responsible for any damages arising from the use of this service.",
    orderNavLabel: "Random order",
    rouletteNavLabel: "Roulette",
    orderTitle: "Random Order",
    orderTagline: "One shuffle settles the running order.",
    orderShuffle: "Shuffle",
    orderShuffling: "Shuffling…",
    orderResultPlaceholder: "Shuffle to see the running order",
    orderResultTitle: "Result",
    orderRankAriaLabel: (rank: number) => `Position ${rank}`,
    orderCopy: "Copy result",
    orderCopied: "Copied",
    orderMarkFirst: "First",
    orderMarkLast: "Last",
    orderHelpBasic:
      "Add your entries and press Shuffle. You can register between 2 and 24 items.",
    orderHelpAimTitle: "When a position is already decided",
    orderHelpAim:
      "Press and hold an item for about 0.6 seconds to cycle it through first, last, and off. Only one item can hold each position, so marking another one clears the previous mark. With a keyboard, focus the item and hold Enter.",
    orderHelpAimStealth:
      "The mark only appears while your cursor is over the list. It disappears while shuffling and while the result is up, and this section closes itself the moment you press Shuffle.",
    orderHelpAimRandom:
      "Everything you have not marked is always shuffled at random. With nothing marked, the order really is random.",
    orderUseCases:
      "Setting the running order for talks and demos, rotating who hosts, assigning chores or reviews, rearranging seats, or standing in for drawing lots. No sign-up, no install — free on phone and desktop.",
    orderDefaultItems: ["Team A", "Team B", "Team C", "Team D"],
    defaultItems: ["Pizza", "Burger", "Sushi", "Tacos"],
  },
} as const;

export type T = (typeof translations)[Locale];

export const LOCALES = ["ja", "en"] as const satisfies readonly Locale[];

export const PAGES = ["roulette", "order"] as const;

export type Page = (typeof PAGES)[number];

/** 言語とページから URL への唯一の対応表。リンク先はすべてここから引く。 */
export const PAGE_PATHS = {
  roulette: { ja: "/", en: "/en/" },
  order: { ja: "/order/", en: "/en/order/" },
} as const satisfies Record<Page, Record<Locale, string>>;

/** 表示言語は URL だけで決まる。クローラが見た HTML と画面が食い違わないための約束。 */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

/** 表示するページも同じく URL だけで決まる。 */
export function pageFromPath(pathname: string): Page {
  return /^\/(en\/)?order\/?$/.test(pathname) ? "order" : "roulette";
}

/** `navigator.languages` は優先度順なので、先に見つかった対応言語を採る。
 *  含まれるかだけを見ると、第 2 言語が第 1 言語を追い越す。 */
export function preferredLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const lower = tag.toLowerCase();
    const match = LOCALES.find(
      (loc) => lower === loc || lower.startsWith(`${loc}-`)
    );
    if (match !== undefined) return match;
  }
  return "en";
}
