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
    resultCopyText: (label: string, candidates: readonly string[]) =>
      `ルーレットの結果は「${label}」でした！\n候補：${candidates.join("、")}`,
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
    copyResult: "結果をコピー",
    copied: "コピーしました",
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
    privacyLinkLabel: "プライバシーポリシー",
    privacyTitle: "プライバシーポリシー",
    privacyBackLabel: "ルーレットに戻る",
    privacyIntro:
      "デキレーレット（以下「本サービス」）における、利用者の情報の取り扱いを定めます。",
    privacySections: [
      {
        heading: "入力した項目と結果",
        body: [
          "入力した項目や抽選・並べ替えの結果は、お使いのブラウザの中だけで処理します。サーバへの送信や保存はせず、ページを閉じたり再読み込みしたりすると消えます。",
          "ブラウザの言語設定は、別の言語版へのリンクを表示するかどうかの判定にだけ使います。この判定もブラウザの中で行い、結果を送信することはありません。",
        ],
      },
      {
        heading: "アクセス解析",
        body: [
          "利用状況の把握のため、Cloudflare, Inc. の Cloudflare Web Analytics を使っています。閲覧したページ、参照元、ブラウザの種類、国・地域、表示速度などを集計します。Cookie やブラウザへの保存は使わず、利用者を個別に識別・追跡することもありません。",
        ],
        link: {
          label: "Cloudflare のプライバシーポリシー",
          href: "https://www.cloudflare.com/ja-jp/privacypolicy/",
        },
      },
      {
        heading: "配信時の記録",
        body: [
          "本サービスは Cloudflare を通じて配信しています。配信の過程で、IP アドレスやアクセス日時などが Cloudflare によって処理されることがあります。これらは不正アクセスの防止や障害への対応のために使われます。Cloudflare は米国の事業者のため、これらの情報やアクセス解析の情報は日本国外で処理されることがあります。",
        ],
      },
      {
        heading: "Cookie とブラウザへの保存",
        body: [
          "本サービスは Cookie を発行せず、ローカルストレージなどブラウザの保存領域も使いません。",
        ],
      },
      {
        heading: "クリップボード",
        body: [
          "ルーレットと順番決めの「結果をコピー」を押したときに限り、結果のテキストをクリップボードへ書き込みます。クリップボードの内容を読み取ることはありません。",
        ],
      },
      {
        heading: "第三者への提供",
        body: [
          "上記の Cloudflare による処理を除き、取得した情報を第三者に提供することはありません。",
        ],
      },
      {
        heading: "改定",
        body: [
          "このポリシーは必要に応じて改定します。改定後の内容は、このページに掲載した時点から効力を生じます。",
        ],
      },
      {
        heading: "お問い合わせ",
        body: ["このポリシーに関するお問い合わせは、GitHub の Issue で受け付けています。"],
        link: {
          label: "GitHub Issues",
          href: "https://github.com/KeitaOsaki/deki-roulette/issues",
        },
      },
    ],
    privacyEstablished: "2026 年 9 月 24 日 制定",
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
    resultCopyText: (label: string, candidates: readonly string[]) =>
      `The roulette landed on “${label}”!\nOptions: ${candidates.join(", ")}`,
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
    copyResult: "Copy result",
    copied: "Copied",
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
    privacyLinkLabel: "Privacy Policy",
    privacyTitle: "Privacy Policy",
    privacyBackLabel: "Back to Roulette",
    privacyIntro:
      "This policy explains how this service (roulette.basekeita.com) handles information about the people who use it.",
    privacySections: [
      {
        heading: "Items and results",
        body: [
          "The items you enter and the results of each spin or shuffle are processed only inside your browser. Nothing is sent to or stored on a server, and everything is gone once you close or reload the page.",
          "Your browser's language setting is used only to decide whether to show a link to the other language version. That check also happens in your browser, and its result is never sent anywhere.",
        ],
      },
      {
        heading: "Analytics",
        body: [
          "To understand how the service is used, we use Cloudflare Web Analytics, provided by Cloudflare, Inc. It aggregates the pages viewed, referrers, browser type, country or region, and page load performance. It does not use cookies or any browser storage, and it does not identify or track individual visitors.",
        ],
        link: {
          label: "Cloudflare Privacy Policy",
          href: "https://www.cloudflare.com/privacypolicy/",
        },
      },
      {
        heading: "Delivery logs",
        body: [
          "This service is delivered through Cloudflare. In the course of delivery, Cloudflare may process information such as your IP address and the time of access. It is used to prevent abuse and to deal with outages. Because Cloudflare is based in the United States, this information and the analytics data may be processed outside your country.",
        ],
      },
      {
        heading: "Cookies and browser storage",
        body: [
          "This service does not set cookies and does not use local storage or any other browser storage.",
        ],
      },
      {
        heading: "Clipboard",
        body: [
          "Only when you press “Copy result” on the Roulette or Random Order page do we write the result text to your clipboard. We never read from your clipboard.",
        ],
      },
      {
        heading: "Sharing with third parties",
        body: [
          "Apart from the processing by Cloudflare described above, we do not share collected information with third parties.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "We may update this policy as needed. Changes take effect once they are posted on this page.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about this policy can be sent through GitHub Issues."],
        link: {
          label: "GitHub Issues",
          href: "https://github.com/KeitaOsaki/deki-roulette/issues",
        },
      },
    ],
    privacyEstablished: "Effective September 24, 2026",
  },
} as const;

export type T = (typeof translations)[Locale];

export const LOCALES = ["ja", "en"] as const satisfies readonly Locale[];

export const PAGES = ["roulette", "order", "privacy"] as const;

export type Page = (typeof PAGES)[number];

/** 言語とページから URL への唯一の対応表。リンク先はすべてここから引く。 */
export const PAGE_PATHS = {
  roulette: { ja: "/", en: "/en/" },
  order: { ja: "/order/", en: "/en/order/" },
  privacy: { ja: "/privacy/", en: "/en/privacy/" },
} as const satisfies Record<Page, Record<Locale, string>>;

/** 表示言語は URL だけで決まる。クローラが見た HTML と画面が食い違わないための約束。 */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

/** 表示するページも同じく URL だけで決まる。 */
export function pageFromPath(pathname: string): Page {
  const slug = /^\/(?:en\/)?([^/]+)\/?$/.exec(pathname)?.[1];
  return PAGES.find((page) => page !== "roulette" && page === slug) ?? "roulette";
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
