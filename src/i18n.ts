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
    editAriaLabel: (label: string) => `${label} を編集`,
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
    defaultItems: ["ラーメン", "寿司", "焼肉"],
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
    guideNavLabel: "使い方ガイド",
    footerNavLabel: "サイト内リンク",
    guideTitle: "使い方ガイド",
    guideMetaTitle: "使い方ガイド｜ルーレットと順番決めの操作手順｜デキレーレット",
    guideMetaDescription:
      "ルーレットと順番決めの使い方を、実際の画面のスクリーンショットとアニメーションで順に説明します。項目の追加、スピンと並べ替え、結果のコピーまで。",
    guideLead:
      "ルーレットと順番決めの操作手順を、実際の画面とアニメーションで説明します。登録もインストールも要りません。スマホでも PC でも、同じ手順で使えます。",
    guideOpenRoulette: "ルーレットを開く",
    guideOpenOrder: "順番決めを開く",
    guideSections: [
      {
        id: "roulette",
        title: "ルーレットの使い方",
        intro:
          "複数の候補から 1 つを選ぶときに使います。幹事を 1 人決める、ランチのお店を 1 軒決める、といった場面に向いています。",
        steps: [
          {
            title: "項目を追加する",
            body: [
              "入力欄に候補を書いて「追加」を押すと、リストとルーレットに加わります。Enter キーでも追加できます。",
              "項目は 2 個から 24 個まで、1 項目あたり 20 文字までです。最初から「ラーメン」「寿司」「焼肉」の 3 つが入っているので、そのまま試せます。",
            ],
            media: "roulette-add",
            alt: "入力欄に「うどん」と書いて「追加」を押すと、項目のリストが 3 つから 4 つに増える様子",
          },
          {
            title: "スピンする",
            body: [
              "「スピン」を押すとルーレットが回り、数秒かけてゆっくり止まります。止まった位置の項目が、結果として大きく表示されます。",
              "回っている間は、項目の追加・編集・削除はできません。やり直したいときは、止まってからもう一度スピンを押してください。",
            ],
            media: "roulette-spin",
            alt: "スピンを押すとルーレットが回り、止まると結果が表示される様子",
          },
          {
            title: "結果をコピーして共有する",
            body: [
              "結果の下の「結果をコピー」を押すと、結果と候補の一覧がテキストとしてクリップボードに入ります。チャットやメモにそのまま貼り付けて共有できます。",
              "コピーされるのは、このボタンを押したときだけです。",
            ],
            media: "roulette-copy",
            alt: "結果の下の「結果をコピー」を押すと、表示が「コピーしました」に変わる画面",
          },
        ],
      },
      {
        id: "order",
        title: "順番決めの使い方",
        intro:
          "全員の並び順をまとめて決めるときに使います。発表の順番、席順、当番表づくりに向いています。",
        steps: [
          {
            title: "項目を追加する",
            body: [
              "ルーレットと同じく、入力欄に書いて「追加」を押します。項目は 2 個から 24 個までです。",
              "最初から「A チーム」から「D チーム」までの 4 つが入っています。人の名前やチーム名に書き換えて使ってください。",
            ],
            media: "order-add",
            alt: "入力欄に「E チーム」と書いて追加すると、リストの項目が 4 つから 5 つに増える様子",
          },
          {
            title: "並べ替える",
            body: [
              "「並べ替え」を押すと、1 位から順に 1 件ずつ現れます。すべて出そろうまで、項目の追加や編集はできません。",
              "もう一度押すと、新しい並びに引き直します。何度でもやり直せます。",
            ],
            media: "order-shuffle",
            alt: "並べ替えを押すと、結果の欄に 1 位から順に項目が 1 件ずつ現れる様子",
          },
          {
            title: "結果をコピーして共有する",
            body: [
              "「結果をコピー」を押すと、順位つきの結果がテキストとしてクリップボードに入ります。",
              "グループのチャットに貼り付ければ、全員が同じ順番を見られます。",
            ],
            media: "order-copy",
            alt: "順位つきの結果の下で「結果をコピー」を押すと、表示が「コピーしました」に変わる画面",
          },
        ],
      },
    ],
    guideTipsTitle: "知っておくと便利なこと",
    guideTips: [
      "項目の直し方: 各項目の鉛筆のボタンで書き換え、右端のボタンで削除できます。",
      "ルーレットと順番決めの使い分け: 1 つだけ選ぶならルーレット、全員を並べるなら順番決めです。",
      "入力した内容の扱い: 項目も結果もブラウザの中だけで処理します。サーバへは送らず、ページを閉じたり再読み込みしたりすると消えます。",
      "動きが苦手なとき: 端末の「視差効果を減らす」などの設定に従って、演出を抑えます。順番決めの結果は 1 件ずつではなく、一度に表示されます。",
      "英語版: ページの右上の言語切り替えから、同じページの英語版に移れます。",
    ],
    guideFaqTitle: "よくある質問",
    guideFaq: [
      {
        q: "無料で使えますか。登録は必要ですか。",
        a: "無料です。会員登録もアプリのインストールも要りません。ブラウザでページを開けば使えます。",
      },
      {
        q: "項目はいくつまで入れられますか。",
        a: "ルーレットも順番決めも、2 個から 24 個までです。1 項目あたり 20 文字まで入力できます。",
      },
      {
        q: "スマートフォンでも使えますか。",
        a: "使えます。画面の幅に合わせて表示が変わり、タッチ操作に対応しています。",
      },
      {
        q: "不具合や要望はどこに伝えればよいですか。",
        a: "GitHub の Issue で受け付けています。端末とブラウザの種類、どの画面で何をしたかを書いていただけると、原因を調べやすくなります。",
      },
    ],
    guideIssuesLabel: "GitHub Issues を開く",
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
    editAriaLabel: (label: string) => `Edit ${label}`,
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
    defaultItems: ["Pizza", "Burger", "Sushi"],
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
    guideNavLabel: "Usage guide",
    footerNavLabel: "Site links",
    guideTitle: "Usage Guide",
    guideMetaTitle: "Usage Guide｜Roulette and Random Order, Step by Step｜Roulette",
    guideMetaDescription:
      "How to use the roulette and the random order tool, shown with real screenshots and animations: adding items, spinning and shuffling, and copying the result.",
    guideLead:
      "Here is how the roulette and the random order tool work, shown on the real screens. There is nothing to sign up for or install, and the steps are the same on a phone and on a computer.",
    guideOpenRoulette: "Open the roulette",
    guideOpenOrder: "Open the random order tool",
    guideSections: [
      {
        id: "roulette",
        title: "Using the roulette",
        intro:
          "Use it to pick one item out of several, such as one organizer or one place to eat.",
        steps: [
          {
            title: "Add items",
            body: [
              "Type a candidate into the field and press “Add”. It joins both the list and the wheel. The Enter key works too.",
              "You can have 2 to 24 items, with up to 20 characters each. Three items (ramen, sushi and yakiniku) are already in the list, so you can try it right away.",
            ],
            media: "roulette-add",
            alt: "Typing “Udon” and pressing Add grows the list of items from three to four",
          },
          {
            title: "Spin",
            body: [
              "Press “Spin” and the wheel turns, slowing to a stop over a few seconds. The item where it stops is shown large as the result.",
              "While the wheel is turning, items cannot be added, edited or removed. To go again, wait for it to stop and press Spin once more.",
            ],
            media: "roulette-spin",
            alt: "Pressing Spin turns the wheel, and the result appears when it stops",
          },
          {
            title: "Copy and share the result",
            body: [
              "Press “Copy result” under the result and the result and the list of candidates go to your clipboard as text. Paste it straight into a chat or a note.",
              "Nothing is copied unless you press this button.",
            ],
            media: "roulette-copy",
            alt: "Pressing Copy result under the result changes the label to Copied",
          },
        ],
      },
      {
        id: "order",
        title: "Using the random order tool",
        intro:
          "Use it to arrange everyone at once, for a running order, seating or a chore chart.",
        steps: [
          {
            title: "Add items",
            body: [
              "As with the roulette, type into the field and press “Add”. You can have 2 to 24 items.",
              "Four items, Team A to Team D, are already there. Replace them with names or teams of your own.",
            ],
            media: "order-add",
            alt: "Typing “Team E” and pressing Add grows the list from four items to five",
          },
          {
            title: "Shuffle",
            body: [
              "Press “Shuffle” and the items appear one by one from first place. Items cannot be added or edited until they have all appeared.",
              "Press it again to draw a new order, as many times as you like.",
            ],
            media: "order-shuffle",
            alt: "Pressing Shuffle makes the items appear one by one in the result area, starting from first place",
          },
          {
            title: "Copy and share the result",
            body: [
              "Press “Copy result” and the ranked result goes to your clipboard as text.",
              "Paste it into the group chat so that everyone sees the same order.",
            ],
            media: "order-copy",
            alt: "Pressing Copy result under the ranked result changes the label to Copied",
          },
        ],
      },
    ],
    guideTipsTitle: "Good to know",
    guideTips: [
      "Fixing items: the pencil button next to an item edits it, and the button at the right end removes it.",
      "Roulette or random order: use the roulette to pick one, and the random order tool to arrange everyone.",
      "What happens to your input: items and results are processed only in your browser. Nothing is sent to a server, and everything disappears when you close or reload the page.",
      "If you find motion uncomfortable: the tools tone down their animation when your device has a setting such as “reduce motion” turned on. On the random order tool, the results then appear all at once.",
      "Japanese version: use the language switch at the top right of any page to move to the same page in the other language.",
    ],
    guideFaqTitle: "Frequently asked questions",
    guideFaq: [
      {
        q: "Is it free? Do I need to sign up?",
        a: "It is free. There is no registration and nothing to install. Open the page in a browser and it works.",
      },
      {
        q: "How many items can I enter?",
        a: "Both tools accept 2 to 24 items, with up to 20 characters each.",
      },
      {
        q: "Does it work on a phone?",
        a: "Yes. The layout adapts to the width of the screen and works with touch.",
      },
      {
        q: "Where do I report a problem or make a request?",
        a: "Through GitHub Issues. Telling us your device, your browser, and what you did on which screen helps us find the cause.",
      },
    ],
    guideIssuesLabel: "Open GitHub Issues",
  },
} as const;

export type T = (typeof translations)[Locale];

export const LOCALES = ["ja", "en"] as const satisfies readonly Locale[];

export const PAGES = ["roulette", "order", "privacy", "guide"] as const;

export type Page = (typeof PAGES)[number];

/** 言語とページから URL への唯一の対応表。リンク先はすべてここから引く。 */
export const PAGE_PATHS = {
  roulette: { ja: "/", en: "/en/" },
  order: { ja: "/order/", en: "/en/order/" },
  privacy: { ja: "/privacy/", en: "/en/privacy/" },
  guide: { ja: "/guide/", en: "/en/guide/" },
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
