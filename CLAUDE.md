# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev       # 開発サーバ起動 (http://localhost:5173)
pnpm run build     # 本番ビルド (tsc + クライアント + SSR バンドル + プリレンダ)
pnpm run preview   # build してから wrangler dev で配信 (http://localhost:8787)
pnpm run lint      # ESLint 実行
pnpm test          # Vitest を 1 回実行 (CI と同じ)
pnpm run test:watch # Vitest をウォッチモードで起動
pnpm run deploy    # build してから wrangler deploy
```

`deploy` は手元から本番を直接更新する。リリースは `main` へのマージ（Workers Builds）で出すので、通常は使わない。

Node.js は 22.13 以上の偶数系（ESLint 10 の `engines` が 22.13 未満を、Vitest 5 の `engines` が 23 と 25 を外している）。CI は 24。

テストは Vitest。`src/` 配下の `*.test.ts(x)` だけを対象にする。Node 環境で走らせる純粋なロジック
(`shuffle.ts` / `items.ts`) の検証が中心で、DOM を使う検証は未導入。
テストのファイルも `tsc -b` と ESLint の対象になる。`vitest` は `import` で明示し、グローバルには置かない。

パッケージマネージャは pnpm。版は `package.json` の `packageManager` で固定し、CI は `pnpm/action-setup` がそこから読む。
依存のライフサイクルスクリプトは `pnpm-workspace.yaml` の `allowBuilds` で依存ごとに許可を決める。現状は esbuild / workerd とも `false`
（postinstall なしでバイナリは optionalDependencies から入る）。pnpm 11 は許可が未決の依存があると `pnpm install` を失敗させるので、
依存を足して `ERR_PNPM_IGNORED_BUILDS` が出たら、スクリプトが要るか確かめてから `true` / `false` を書く。

## アーキテクチャ

**出来レーレット** — 結果をユーザが事前に指定できる抽選アプリ。ルーレット (`/`) と順番決め (`/order/`) の 2 画面、プライバシーポリシー (`/privacy/`)、使い方ガイド (`/guide/`) を、言語 × ページごとの静的 HTML で配る Vite の MPA 構成。

- `src/config.ts` — スライス色・スピン時間・項目数上限などのドメイン定数。
- `src/types.ts` — `Item` 型と、リストの行に出す印の `Mark` 型。
- `src/items.ts` — 項目の ID 生成とラベル正規化。両画面で共有する。
- `src/shuffle.ts` — Fisher-Yates と、指定された項目を先頭・末尾へ移す `arrange`。
- `index.html` / `en/index.html` / `order/index.html` / `en/order/index.html` / `privacy/index.html` / `en/privacy/index.html` — ツール画面と規約のエントリ。ページ別・言語別のメタタグはここに書き分ける。
- `guide/index.html` / `en/guide/index.html` — 使い方ガイドのエントリ。`<title>`・description は `routes.ts` の `routeMeta` と一致させ、`routes.test.ts` が食い違いを落とす。
- `src/routes.ts` — 静的に配る全ページ (`ROUTES`) の唯一の定義。`vite.config.ts` の `input`、プリレンダ、エントリ HTML の検査がここから組み立てる。
- `src/guideMedia.ts` — 使い方ガイドに載せる画像・アニメーションの一覧と実寸。実体は `public/guide/media/`。
- `src/i18n.ts` — 日英の文言テーブル、`Locale` / `Page` 型、言語とページから URL への対応。
- `src/hooks/useRoulette.ts` — 項目・ターゲット・回転・結果のステートとスピンロジック。
- `src/hooks/useOrder.ts` — 項目・先頭末尾の指定・並べ替え結果のステートと演出時間の計算。
- `src/hooks/useLongPress.ts` — 長押しでのみ発火するハンドラ束。
- `src/hooks/useLocaleSuggestion.ts` — ブラウザの言語と表示中の言語のずれの検出。
- `src/hooks/useReducedMotion.ts` — `prefers-reduced-motion` の購読。
- `src/App.tsx` — `page` prop で表示するページを選ぶだけ。
- `src/pages/RoulettePage.tsx` / `src/pages/OrderPage.tsx` — 各画面の組み立て。表示言語は `locale` prop で受け取る。
- `src/pages/PrivacyPage.tsx` / `GuidePage.tsx` — 読ませる文章のページ。`PageFrame` は使わず `ContentFrame` で組む。本文は `i18n.ts` の `privacySections` / `guideSections`。`GuidePage` は手順ごとに文章と画像を並べる。
- `src/components/ContentFrame.tsx` — 上記ページの枠。見出し・戻りリンク・言語切替・サイト内リンクのフッター。
- `src/main.tsx` — クライアントの入り口。`#root` の中身の有無で hydrate と初回描画を選ぶ。
- `src/entry-server.tsx` — プリレンダ用に `App` を文字列へ描画する。
- `scripts/prerender.mjs` — ビルド後に各エントリ HTML の `#root` へ描画結果を差し込む。対象は `entry-server.tsx` の `renderAll()` が `ROUTES` から返す。
- `src/index.css` — Tailwind のディレクティブ、フォーカスリング、広告枠 (`ins.adsbygoogle`) の配色と未充填時の非表示、`prefers-reduced-motion` でのアニメーション抑制。`.no-callout` は隠しジェスチャを置く要素が iOS Safari の長押しメニューを出さないためのもの。
- `src/components/PageFrame.tsx` — 両画面で共通の枠。ヘッダ・言語切替・もう一方のページへの導線・フッターの折りたたみとプライバシーポリシーへのリンク。
- `src/components/RouletteWheel.tsx` — SVG 描画。回転は CSS `transform` トランジション。
- `src/components/OrderResult.tsx` — 順位付きの結果。1 件ずつ現れる遅延をここで掛ける。
- `src/components/CopyResultButton.tsx` — 結果をクリップボードへ書き込むボタンと「コピーしました」の表示。両画面で共有する。
- `src/components/ItemList.tsx` — 項目の追加・編集・削除・隠しジェスチャの受け口と、印の表示制御。編集は ✎ ボタンから行をその場で入力欄に切り替える（ラベルの単純クリックは何もしない仕様を保つため）。両画面で共有する。
- `src/components/LocaleSwitch.tsx` — 同じページの別言語 URL へのリンク。
- `src/components/LocaleNotice.tsx` — 別言語版への誘導リンク。
- `src/components/AdUnit.tsx` — AdSense の手動広告ユニット 1 枠。スクリプトの読み込みもここで行う。

### スピンの仕組み

`useRoulette` の `spin()` が核心ロジック。`targetId` が設定されていればその項目のスライス角に収まるよう回転角を計算し、見た目はランダムでも結果を確定させる。指定がないときの当たり選びは `randomBelow`（`crypto.getRandomValues`）で、演出用の角度は `Math.random`。完了検知はホイールの `transitionend`、`SPIN_FALLBACK_MS` のタイマーはバックグラウンドタブ等で発火しない場合の保険。

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

- `pnpm run build` は クライアントビルド → SSR バンドル (`dist-ssr/`) → `scripts/prerender.mjs` の順。焼き込む対象は `src/routes.ts` の `ROUTES`。
- `BUILD_TARGET=ssr` のときと Vitest の実行中は `vite.config.ts` が `cloudflare()` を外す。どちらも Node で実行するため。
- 表示言語とページを `window.location.pathname` から読むと SSR で落ちるので、`App` は `locale` と `page` を prop で受け取る。
  URL が唯一のソースである点は変わらない (`main.tsx` が `localeFromPath` / `pageFromPath` を呼ぶ)。
- 焼き込むのは画面に出ている文言だけ。ステルス仕様のとおり `details` は閉じたまま、
  指定中の印 (`aria-pressed`) も出力に含まれない。
- 誘導リンク (`LocaleNotice`) は閲覧者ごとに変わるので、静的 HTML には出さずマウント後に描画する。
- ブラウザ API を初回描画で触るフックを足すときは、SSR 側の初期値を用意する
  (`useReducedMotion` の `getServerSnapshot` が例)。

### ページと言語別 URL

ルーレットが `/` と `/en/`、順番決めが `/order/` と `/en/order/`、プライバシーポリシーが `/privacy/` と `/en/privacy/`、使い方ガイドが `/guide/` と `/en/guide/`。すべて独立した静的 HTML で、`ROUTES` から `vite.config.ts` の `build.rollupOptions.input` を組む。JS バンドルは共通で、react-router は入れない。

- 未知のパスは `wrangler.jsonc` の `assets.not_found_handling: "404-page"` で 404 を返す。配るのは `public/404.html`（日本語）と `public/en/404.html`（英語。`/en/` 配下の未知パスにはこちらが最寄りとして選ばれる）。React・スクリプトを使わず、同一オリジンの CSS（`public/404.css`）だけを読む静的 HTML で、`noindex`、sitemap には載せない。隠し操作を示唆する語は置かない。
- `/app/privacy/` は iOS アプリ用のプライバシーポリシーで、`public/app/privacy/index.html` をそのまま配る。React・プリレンダ・`vite.config.ts` の `input` のどれも通らず、`noindex` で sitemap にも載せない。内容はアプリの実態（通信なし・解析なし・広告なし）で、Web 版の `privacySections` とは別に保つ。
- 表示言語もページも URL だけで決まる（`localeFromPath` / `pageFromPath`）。`navigator.language` は表示の決定に使わない。焼き込んだ HTML と画面が食い違わないため。
- 言語切替とページ間の移動はステートの切替ではなく `<a href>` での遷移。行き先は `PAGE_PATHS` が唯一の定義。言語を切り替えても同じページに留まる。
- ブラウザの言語が表示中の言語と違うときは、もう一方の言語版へのリンクを最上部に出すだけにする。自動リダイレクトはしない。共有された URL の言語を上書きしてしまう。
- 誘導リンクは閲覧者ごとに変わるので、マウント後に描画する（静的 HTML には出さない）。
- どのページも自分自身への `canonical` と、`ja` / `en` / `x-default` の `hreflang` を持つ。`x-default` は同じページの日本語版に向ける。
- 言語を増やすときに触るのは、`i18n.ts` の `LOCALES` / `PAGE_PATHS` / `translations`、エントリ HTML の追加、各ページの `hreflang`、`public/sitemap.xml`。ページを増やすときも同じ箇所に加えて `i18n.ts` の `PAGES` / `pageFromPath` を触る。`input` とプリレンダは `ROUTES` から自動で決まる。
- 使い方ガイドの画像は、実画面を Playwright で撮ったスクリーンショット（WebP）と、同じ画面の操作を録画して作ったアニメーション WebP。`<img>` で出し、動画タグは使わない。言語ごとに `public/guide/media/<言語>-<キー>.webp` を置く。アニメーションには最後のコマの静止画 `<言語>-<キー>-still.webp` を添え、`prefers-reduced-motion` のときは `<picture>` で静止画に切り替える。画面の見た目を変えたら撮り直す。`routes.test.ts` がファイルの抜けを落とす。
- 撮影する画面に隠し操作の痕跡（印・長押し）を映さない。ガイドの本文・代替テキストにも、隠し操作を示唆する語は書かない。`routes.test.ts` の禁止語検査が見張る。

### デザイントークン

配色・書体・アニメーションは `tailwind.config.ts` の `theme.extend` に集約。金色 `gold` は結果表示（順番決めは 1 位）とフォーカスリング、`flare` はスピン・並べ替えの操作専用。指定中の印には専用色を使わず、スライス色をそのまま流用する。`reveal` は両画面で使い回し、キーフレームは足さない。

### SEO とメタ情報

公開 URL は `https://roulette.basekeita.com/`。canonical・OGP・sitemap の絶対 URL はこれに揃える。

検索に載せたい語と、画面に出してはいけない語を分けてある。

- 日本語版の `<title>` / `og:title` / `twitter:title` は「デキレーレット｜無料で使えるインチキルーレットアプリ」、
  `<h1>` はブランド名だけの「デキレーレット」。
- 順番決めの `<title>` は日本語版が「順番決め｜無料のランダム並べ替えツール｜デキレーレット」、`<h1>` は「順番決め」。
- 英語版の `<title>` / `<h1>` は一般語のみ（「Roulette」「Random Order」「Free」）。ブラウザのタブバーは画面共有に映るので、英語版の title を一般語にしている。ブランド語は `meta[name=description]` と JSON-LD の `alternateName` にだけ置く。
- どちらの言語でも、隠し操作の手順（長押し）はフッターの折りたたみの外にも meta にもプライバシーポリシーにも書かない。
- プライバシーポリシーは実装の実態に合わせる。Cookie・ブラウザの保存領域・外部送信・アクセス解析を増減したら `privacySections` と制定日の表記も直す。Cloudflare の Bot Fight Mode・チャレンジ・レート制限ルールなどを有効にすると Cloudflare が Cookie を付けるようになるので、その場合も直す。
- アクセス解析は Cloudflare Web Analytics。ビーコンの `<script>` は全エントリ HTML に直書きしてあり、CSP の `script-src` / `connect-src` にある `cloudflareinsights` はそのため。Cookie もブラウザの保存領域も使わない。
- `public/og.png` は Slack 等のリンク展開で映る可能性があるため、盤面だけの中立な絵にしてある。再生成する場合も仕込みを示唆する要素を入れない。
- `public/robots.txt` / `public/sitemap.xml` / `public/ads.txt` はビルド時に `dist/` へコピーされる。sitemap は `ROUTES` の全 URL を載せ、各 `<url>` に `xhtml:link` で言語の対応関係を書く。
- JSON-LD は `<script type="application/ld+json">`。データブロックなので CSP の `script-src` には引っかからない。

### 広告

Google AdSense の手動ユニットを `PageFrame` に 2 枠置く。フッターの直前のレスポンシブ枠と、`xl` 以上でだけ出す左余白の 160×600 の縦長枠。

- プライバシーポリシーには広告を出さない。`PrivacyPage` は `PageFrame` を使わないので枠がなく、スクリプトも読まない。
- `adsbygoogle.js` はエントリ HTML の `<head>` に書かず、`AdUnit` がマウント後に差し込む。広告枠のあるページだけで読むため。
- 自動広告（アンカー・モバイル全画面を含む）は AdSense 管理画面でオフにしておく。挿入位置を制御できず、プリレンダした `#root` の中へ入ると hydration が崩れる。ページ間の移動で全画面広告が出るのもステルス前提の使い方を邪魔する。
- パブリッシャー ID と広告ユニット ID は `src/config.ts` の `ADSENSE_CLIENT` / `AD_SLOTS`。`AD_SLOTS` が `null` の枠は描画せず、すべて `null` なら広告リクエストは一切飛ばない。`public/ads.txt` と、ツール画面・使い方ガイドのエントリ HTML の `meta[name=google-adsense-account]`（サイト所有の確認用）の ID もこれと揃える。
- `AD_SLOTS` に ID を入れて広告を出すと Google が Cookie を使い、閲覧者の情報を受け取る。今の `privacySections` は広告を出していない実態（Cookie なし、提供先は Cloudflare のみ）を書いているので、広告を出す変更と同じ PR で「Cookie とブラウザへの保存」「第三者への提供」と制定日を直す。
- 非表示の枠（`display:none`）へ push すると失敗してその枠は埋まらなくなるので、`AdUnit` は幅が付いてから push する。

### セキュリティヘッダ

`public/_headers` に CSP と各種セキュリティヘッダを定義。ビルド時に `dist/_headers` へコピーされ、Cloudflare の静的アセット配信が適用する。外部スクリプトを追加する場合は `script-src` / `connect-src` の更新が必要。AdSense のため `script-src` / `frame-src` / `connect-src` に Google の広告ドメインを並べ、広告画像の配信元は固定できないので `img-src` は `https:` を許可している。

`style-src` は `'self'` だけで、`<style>` 要素の注入は許さない。React の `style` 属性（スライスの色や回転など）のために `style-src-attr 'unsafe-inline'` だけを足してある。そのため `public/` 配下を含む HTML には `<style>` 要素も `style=` 属性も書かない。CSS は外部ファイルに置く（`/app/privacy/` は `style.css`）。`src/csp.test.ts` と `src/static-html.test.ts` がこれを守る。

#### HTTPS 専用化

`basekeita.com` ゾーン全体を HTTPS 専用にしてある。リポジトリの外（Cloudflare ダッシュボード）にある設定が半分を占めるので、変えるときは次を崩さない。

- HSTS は Cloudflare の SSL/TLS → エッジ証明書で、max-age 12 か月とサブドメインを含めるをオンに、プリロードをオフにしている。apex の転送応答はこのリポジトリの配信物を通らないので、`_headers` だけでは付かない。
- `_headers` の HSTS はゾーンの設定と同じ値（`max-age=31536000; includeSubDomains`）にしておく。ゾーンの値で置き換わるので、応答のヘッダは 1 本になる。値を変えるときは両方を直す。
- apex からの転送は Redirect Rule「root to roulette」（`http.host in {"basekeita.com" "www.basekeita.com"} and ssl`）。`ssl` を外すと HTTP が `https://roulette.basekeita.com/` へ直接飛び、apex の HTTPS 応答を通らないので、ブラウザが apex の HSTS を受け取れない。
- `includeSubDomains` のため、`*.basekeita.com` のホストは 2 階層目以降（`a.b.basekeita.com`）も含めて、すべて HTTPS で応答しなければならない。サブドメインを足す前に、HTTPS で応答することを確かめる。
- `preload` は付けない。付けると hstspreload.org の申請の対象になるが、Chrome や Safari は HTTP の移動を自動で HTTPS に上げるので、申請で足される利点は小さく、載ると外すのに数か月かかる。ゾーンの HSTS のプリロードも、`_headers` の `preload` も、オフのままにする。

### パスエイリアス

`vite.config.ts` で `@` → `./src` のエイリアスが設定されている。

### デプロイ

ホスティングは Cloudflare Workers の静的アセット配信。`wrangler.jsonc` は Worker のコードを持たない、アセットだけの Worker を定める。
`pnpm run build` が `dist/` に成果物と `dist/wrangler.json` を出し、`.wrangler/deploy/config.json`（生成物で git 管理外）が wrangler をそこへ向ける。
このため `wrangler dev` / `wrangler deploy` にも Workers Builds にも出力先の指定は要らない（Workers Builds に出力ディレクトリの設定は無い）。

既定ブランチは `develop`。PR は `develop` へ出し、`develop` へのマージではデプロイされない。

`develop` → `main` の PR をマージすると、Cloudflare の Workers Builds が自動でビルド＆デプロイする
（Connect to Git で連携）。ビルドコマンドは `pnpm run build`、デプロイコマンドは `wrangler deploy`。本番ブランチは `main` で、プレビュービルドは無効。
Workers Builds の pnpm は既定が 10.x なので、ビルド変数 `PNPM_VERSION` を `packageManager` と同じ版にしておく。
リリース PR は merge commit でマージする。squash にすると `develop` と `main` の履歴がずれ、次のリリースで差分が重複する。
merge commit は `main` にしか無いので、`main` への push で `Sync develop`（`.github/workflows/sync-develop.yml`）が `develop` を `main` へ fast-forward する。
`GITHUB_TOKEN` の push なので `develop` の CI は走らない（木は直前の CI 済みの `develop` と同じ）。
`develop` が先に進んでいて fast-forward できないときはジョブが失敗するので、手元で `develop` に `origin/main` をマージする。

`main` は直接 push と削除ができず、PR が必須（ルールセット `main-protect`）。
head が `develop` 以外の PR は `Release guard`（`.github/workflows/release-guard.yml` のジョブ `develop-only`）が失敗させ、
このチェックは `main` の必須チェックになっている。
`develop` は削除できない（`develop-protect`）。リリース PR の head が `develop` で、マージ後のブランチ自動削除に巻き込まれるため。

### CI と依存更新

`.github/workflows/ci.yml` は PR と `develop` への push で `lint` / `test` / `build` を matrix で並列に走らせる（Node 24、`pnpm install --frozen-lockfile`）。
型検査だけのジョブは無く、`build` の先頭の `tsc -b` が兼ねる。1 つ落ちても残りは止めない（`fail-fast: false`）。

Dependabot は npm と GitHub Actions を毎週月曜（JST）に見る。`tailwindcss` のメジャー更新は無視する設定で、外す条件は `.github/dependabot.yml` のコメントにある。

リリース PR の作成は `release-pr`、Dependabot の PR の精査は `dependabot-triage` のスキルが担う（`.claude/skills/`）。
