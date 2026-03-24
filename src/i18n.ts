export type Locale = "ja" | "en";

export const translations = {
  ja: {
    title: "ルーレット",
    spin: "スピン！",
    spinning: "スピン中…",
    addPlaceholder: "項目を入力...",
    addButton: "追加",
    itemListTitle: "項目リスト",
    itemListHint: "★ でお気に入り項目をマークできます",
    emptyList: "項目を追加してください",
    needMoreItems: "項目を2つ以上追加してください",
    setTargetTitle: "当てたい項目に設定",
    setTargetAriaLabel: (label: string) => `${label}を当たり項目に設定`,
    removeAriaLabel: (label: string) => `${label}を削除`,
    aboutTitle: "このサービスについて",
    aboutHeading: "インチキルーレット",
    aboutBody:
      "項目リストの ★ ボタンを押すと、その項目を「確定当たり」として設定できます。スピン後は必ずその項目が選ばれます。そう、お察しの通りこちらのルーレットはインチキルーレットです。自分の案を押し通したい場合にぜひご利用ください。",
    aboutRandom: "★ を設定しない場合はランダムに選ばれます。",
    aboutApology: "友人などにばれてしまった際は誠心誠意謝罪するか、逃げ切ってください。",
    disclaimerTitle: "注意事項",
    disclaimer: "本サービスの利用により生じたいかなる損害についても責任を負いません。",
    defaultItems: ["ラーメン", "カレー", "寿司", "焼肉"],
  },
  en: {
    title: "Roulette",
    spin: "Spin!",
    spinning: "Spinning…",
    addPlaceholder: "Enter an item...",
    addButton: "Add",
    itemListTitle: "Items",
    itemListHint: "★ marks your guaranteed pick",
    emptyList: "Add some items",
    needMoreItems: "Add at least 2 items",
    setTargetTitle: "Set as guaranteed winner",
    setTargetAriaLabel: (label: string) => `Set ${label} as winner`,
    removeAriaLabel: (label: string) => `Remove ${label}`,
    aboutTitle: "About",
    aboutHeading: "Rigged Roulette",
    aboutBody:
      'Press the ★ button next to any item to mark it as the "guaranteed winner". After spinning, that item will always be chosen. Yes, as you might have guessed, this roulette is rigged. Use it whenever you need to push your own agenda.',
    aboutRandom: "If no ★ is set, the result is truly random.",
    aboutApology:
      "If someone catches on, sincerely apologize — or make a run for it.",
    disclaimerTitle: "Disclaimer",
    disclaimer:
      "We are not responsible for any damages arising from the use of this service.",
    defaultItems: ["Pizza", "Burger", "Sushi", "Tacos"],
  },
} as const;

export type T = (typeof translations)[Locale];
