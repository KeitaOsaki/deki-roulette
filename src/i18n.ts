export type Locale = "ja" | "en";

export const translations = {
  ja: {
    localeName: "日本語",
    localeSuggestion: "日本語版はこちら",
    title: "ルーレット",
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
    defaultItems: ["ラーメン", "カレー", "寿司", "焼肉"],
  },
  en: {
    localeName: "English",
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
    needMoreItems: "Add at least 2 items to spin",
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
    defaultItems: ["Pizza", "Burger", "Sushi", "Tacos"],
  },
} as const;

export type T = (typeof translations)[Locale];

export const LOCALES = ["ja", "en"] as const satisfies readonly Locale[];

export const LOCALE_PATHS = {
  ja: "/",
  en: "/en/",
} as const satisfies Record<Locale, string>;

/** 表示言語は URL だけで決まる。クローラが見た HTML と画面が食い違わないための約束。 */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

export function preferredLocale(languages: readonly string[]): Locale {
  return languages.some((lang) => lang.toLowerCase().startsWith("ja"))
    ? "ja"
    : "en";
}
