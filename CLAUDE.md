# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # 開発サーバ起動 (http://localhost:5173)
npm run build     # 本番ビルド (tsc + クライアント + SSR バンドル + プリレンダ)
npm run preview   # ビルド結果のプレビュー (http://localhost:4173)
npm run lint      # ESLint 実行
```

テストは未設定。

## アーキテクチャ

**出来レーレット** — 結果をユーザが事前に指定できる抽選アプリ。ルーレット (`/`) と順番決め (`/order/`) の 2 画面とプライバシーポリシー (`/privacy/`) を、言語 × ページごとの静的 HTML で配る Vite の MPA 構成。

- `src/config.ts` — スライス色・スピン時間・項目数上限などのドメイン定数。
- `src/types.ts` — `Item` 型と、リストの行に出す印の `Mark` 型。
- `src/items.ts` — 項目の ID 生成とラベル正規化。両画面で共有する。
- `src/shuffle.ts` — Fisher-Yates と、指定された項目を先頭・末尾へ移す `arrange`。
- `index.html` / `en/index.html` / `order/index.html` / `en/order/index.html` / `privacy/index.html` / `en/privacy/index.html` — 6 つのエントリ。ページ別・言語別のメタタグはここに書き分ける。
- `src/i18n.ts` — 日英の文言テーブル、`Locale` / `Page` 型、言語とページから URL への対応。
- `src/hooks/useRoulette.ts` — 項目・ターゲット・回転・結果のステートとスピンロジック。
- `src/hooks/useOrder.ts` — 項目・先頭末尾の指定・並べ替え結果のステートと演出時間の計算。
- `src/hooks/useLongPress.ts` — 長押しでのみ発火するハンドラ束。
- `src/hooks/useLocaleSuggestion.ts` — ブラウザの言語と表示中の言語のずれの検出。
- `src/hooks/useReducedMotion.ts` — `prefers-reduced-motion` の購読。
- `src/App.tsx` — `page` prop で表示するページを選ぶだけ。
- `src/pages/RoulettePage.tsx` / `src/pages/OrderPage.tsx` — 各画面の組み立て。表示言語は `locale` prop で受け取る。
- `src/pages/PrivacyPage.tsx` — プライバシーポリシー。`PageFrame` は使わず、見出し・ルーレットへの戻りリンク・言語切替だけを持つ。本文は `i18n.ts` の `privacySections`。
- `src/main.tsx` — クライアントの入り口。`#root` の中身の有無で hydrate と初回描画を選ぶ。
- `src/entry-server.tsx` — プリレンダ用に `App` を文字列へ描画する。
- `scripts/prerender.mjs` — ビルド後に各エントリ HTML の `#root` へ描画結果を差し込む。
- `src/components/PageFrame.tsx` — 両画面で共通の枠。ヘッダ・言語切替・もう一方のページへの導線・フッターの折りたたみとプライバシーポリシーへのリンク。
- `src/components/RouletteWheel.tsx` — SVG 描画。回転は CSS `transform` トランジション。
- `src/components/OrderResult.tsx` — 順位付きの結果。1 件ずつ現れる遅延をここで掛ける。
- `src/components/CopyResultButton.tsx` — 結果をクリップボードへ書き込むボタンと「コピーしました」の表示。両画面で共有する。
- `src/components/ItemList.tsx` — 項目の追加・削除・隠しジェスチャの受け口と、印の表示制御。両画面で共有する。
- `src/components/LocaleSwitch.tsx` — 同じページの別言語 URL へのリンク。
- `src/components/LocaleNotice.tsx` — 別言語版への誘導リンク。
- `src/components/AdUnit.tsx` — AdSense の手動広告ユニット 1 枠。スクリプトの読み込みもここで行う。

### スピンの仕組み

`useRoulette` の `spin()` が核心ロジック。`targetId` が設定されていればその項目のスライス角に収まるよう回転角を計算し、見た目はランダムでも結果を確定させる。完了検知はホイールの `transitionend`、`SPIN_FALLBACK_MS` のタイマーはバックグラウンドタブ等で発火しない場合の保険。

### 並べ替えの仕組み

`useOrder` の `shuffleItems()` が `arrange` を呼ぶ。Fisher-Yates で一様にシャッフルしてから、
指定された項目を先頭・末尾と入れ替える。条件を満たすまで引き直す方式は取らない。指定以外の並びに偏りが出る。
乱数は `crypto.getRandomValues`。剰余の偏りを避けるため、範囲を割り切れる上限を超えた値は捨てて引き直す。

結果は `animate-reveal` に `animationDelay` を掛けて 1 件ずつ出す。演出の終了は
`ORDER_REVEAL_STEP_MS` と `REVEAL_ANIM_MS` から計算したタイマーで、`prefers-reduced-motion` のときは
遅延を 0 にして一度に出す。

### ステルス前提の UI

人に画面を見せながら回す用途を前提に、結果を仕込めることが画面上から分からないよう作ってある。以下は仕様であって、削ったり戻したりしない。

- 日本語版のトップはブランド名「デキレーレット」を `<title>` / `<h1>` に出す。英語版の `<title>` / `<h1>` は
  一般語「Roulette」「Random Order」のまま。画面の本文には「当たり」「必ず」等、隠し操作の内容そのものを示唆する語は置かない。
- 指定は項目の長押し（`LONG_PRESS_MS`）のみ。専用ボタンやツールチップは置かない。単純クリックでは何も起きない。キーボードは OS のキーリピート（`KeyboardEvent.repeat`）を拾う。ルーレットは長押しで当たりの指定と解除、順番決めは長押しのたびに 先頭 → 末尾 → 解除 と回す。
- 指定中の印はカラードットを塗りからリングに変えるだけ（末尾指定だけ中心にも点を置く）。リストにポインタ／フォーカスがある間と指定直後 `TARGET_HINT_MS` の間しか出さず、演出中と結果表示中は伏せる（`ItemList` の `concealMarks`）。印を伏せている行は `aria-pressed` も指定先の読み上げも出さない。
- 隠し操作の説明はフッターの折りたたみ内にのみ置き、スピン／並べ替えの開始で自動的に閉じる。

### プリレンダリング

クローラに本文を渡すため、ビルド時に React を静的 HTML へ焼き込んで `#root` に入れてある。
JS が動く前から画面のテキストがすべて HTML にある。

- `npm run build` は クライアントビルド → SSR バンドル (`dist-ssr/`) → `scripts/prerender.mjs` の順。焼き込む対象は `prerender.mjs` の `PAGES`。
- `BUILD_TARGET=ssr` のときは `vite.config.ts` が `cloudflare()` を外す。SSR バンドルは Node で実行するため。
- 表示言語とページを `window.location.pathname` から読むと SSR で落ちるので、`App` は `locale` と `page` を prop で受け取る。
  URL が唯一のソースである点は変わらない (`main.tsx` が `localeFromPath` / `pageFromPath` を呼ぶ)。
- 焼き込むのは画面に出ている文言だけ。ステルス仕様のとおり `details` は閉じたまま、
  指定中の印 (`aria-pressed`) も出力に含まれない。
- 誘導リンク (`LocaleNotice`) は閲覧者ごとに変わるので、静的 HTML には出さずマウント後に描画する。
- ブラウザ API を初回描画で触るフックを足すときは、SSR 側の初期値を用意する
  (`useReducedMotion` の `getServerSnapshot` が例)。

### ページと言語別 URL

ルーレットが `/` と `/en/`、順番決めが `/order/` と `/en/order/`、プライバシーポリシーが `/privacy/` と `/en/privacy/`。6 つとも独立した静的 HTML で、`vite.config.ts` の `build.rollupOptions.input` に並べてある。JS バンドルは共通で、react-router は入れない。

- 表示言語もページも URL だけで決まる（`localeFromPath` / `pageFromPath`）。`navigator.language` は表示の決定に使わない。焼き込んだ HTML と画面が食い違わないため。
- 言語切替とページ間の移動はステートの切替ではなく `<a href>` での遷移。行き先は `PAGE_PATHS` が唯一の定義。言語を切り替えても同じページに留まる。
- ブラウザの言語が表示中の言語と違うときは、もう一方の言語版へのリンクを最上部に出すだけにする。自動リダイレクトはしない。共有された URL の言語を上書きしてしまう。
- 誘導リンクは閲覧者ごとに変わるので、マウント後に描画する（静的 HTML には出さない）。
- どのページも自分自身への `canonical` と、`ja` / `en` / `x-default` の `hreflang` を持つ。`x-default` は同じページの日本語版に向ける。
- 言語を増やすときに触るのは、`i18n.ts` の `LOCALES` / `PAGE_PATHS` / `translations`、エントリ HTML の追加、`vite.config.ts` の `input`、各ページの `hreflang`、`public/sitemap.xml`、`scripts/prerender.mjs` の `PAGES`。ページを増やすときも同じ 6 か所に加えて `i18n.ts` の `PAGES` / `pageFromPath` を触る。

### デザイントークン

配色・書体・アニメーションは `tailwind.config.ts` の `theme.extend` に集約。金色 `gold` は結果表示（順番決めは 1 位）とフォーカスリング、`flare` はスピン・並べ替えの操作専用。指定中の印には専用色を使わず、スライス色をそのまま流用する。`reveal` は両画面で使い回し、キーフレームは足さない。

### SEO とメタ情報

公開 URL は `https://roulette.basekeita.com/`。canonical・OGP・sitemap の絶対 URL はこれに揃える。

検索に載せたい語と、画面に出してはいけない語を分けてある。

- 日本語版の `<title>` / `og:title` / `twitter:title` は「デキレーレット｜無料で使えるインチキルーレットアプリ」、
  `<h1>` はブランド名だけの「デキレーレット」。
- 順番決めの `<title>` は日本語版が「順番決め｜無料のランダム並べ替えツール｜デキレーレット」、`<h1>` は「順番決め」。
- 英語版の `<title>` / `<h1>` は一般語のみ（「Roulette」「Random Order」「Free」）。ブランド語は `meta[name=description]` と JSON-LD の `alternateName` にだけ置く。
- どちらの言語でも、隠し操作の手順（長押し）はフッターの折りたたみの外にも meta にもプライバシーポリシーにも書かない。
- プライバシーポリシーは実装の実態に合わせる。Cookie・ブラウザの保存領域・外部送信・アクセス解析を増減したら `privacySections` と制定日の表記も直す。Cloudflare の Bot Fight Mode・チャレンジ・レート制限ルールなどを有効にすると Cloudflare が Cookie を付けるようになるので、その場合も直す。
- `public/og.png` は Slack 等のリンク展開で映る可能性があるため、盤面だけの中立な絵にしてある。再生成する場合も仕込みを示唆する要素を入れない。
- `public/robots.txt` / `public/sitemap.xml` / `public/ads.txt` はビルド時に `dist/` へコピーされる。sitemap は 6 URL すべてを載せ、各 `<url>` に `xhtml:link` で言語の対応関係を書く。
- JSON-LD は `<script type="application/ld+json">`。データブロックなので CSP の `script-src` には引っかからない。

### 広告

Google AdSense の手動ユニットを `PageFrame` に 2 枠置く。フッターの直前のレスポンシブ枠と、`xl` 以上でだけ出す左余白の 160×600 の縦長枠。

- プライバシーポリシーには広告を出さない。`PrivacyPage` は `PageFrame` を使わないので枠がなく、スクリプトも読まない。
- `adsbygoogle.js` はエントリ HTML の `<head>` に書かず、`AdUnit` がマウント後に差し込む。広告枠のあるページだけで読むため。
- 自動広告（アンカー・モバイル全画面を含む）は AdSense 管理画面でオフにしておく。挿入位置を制御できず、プリレンダした `#root` の中へ入ると hydration が崩れる。ページ間の移動で全画面広告が出るのもステルス前提の使い方を邪魔する。
- パブリッシャー ID と広告ユニット ID は `src/config.ts` の `ADSENSE_CLIENT` / `AD_SLOTS`。`AD_SLOTS` が `null` の枠は描画せず、すべて `null` なら広告リクエストは一切飛ばない。`public/ads.txt` と、広告のある 4 つのエントリ HTML の `meta[name=google-adsense-account]`（サイト所有の確認用）の ID もこれと揃える。
- 非表示の枠（`display:none`）へ push すると失敗してその枠は埋まらなくなるので、`AdUnit` は幅が付いてから push する。

### セキュリティヘッダ

`public/_headers` に CSP と各種セキュリティヘッダを定義。ビルド時に `dist/_headers` へコピーされ、Cloudflare の静的アセット配信が適用する。外部スクリプトを追加する場合は `script-src` / `connect-src` の更新が必要。AdSense のため `script-src` / `frame-src` / `connect-src` に Google の広告ドメインを並べ、広告画像の配信元は固定できないので `img-src` は `https:` を許可している。

### パスエイリアス

`vite.config.ts` で `@` → `./src` のエイリアスが設定されている。

### デプロイ

`main` ブランチへの push で Cloudflare Pages が自動ビルド＆デプロイ（Connect to Git で連携）。
