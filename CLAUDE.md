# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # 開発サーバ起動 (http://localhost:5173)
npm run build     # 本番ビルド (tsc + vite build)
npm run preview   # ビルド結果のプレビュー (http://localhost:4173)
npm run lint      # ESLint 実行
```

テストは未設定。

## アーキテクチャ

**出来レーレット** — ルーレットの結果をユーザが事前に指定できるアプリ。画面は 1 つだが、言語ごとに静的 HTML を持つ Vite の MPA 構成。

- `src/config.ts` — スライス色・スピン時間・項目数上限などのドメイン定数。
- `src/types.ts` — `Item` 型。
- `index.html` / `en/index.html` — 日本語版・英語版のエントリ。言語別のメタタグはここに書き分ける。
- `src/i18n.ts` — 日英の文言テーブル、`Locale` 型、ロケールと URL の対応。
- `src/hooks/useRoulette.ts` — 項目・ターゲット・回転・結果のステートとスピンロジック。
- `src/hooks/useLongPress.ts` — 長押しでのみ発火するハンドラ束。
- `src/hooks/useLocaleSuggestion.ts` — ブラウザの言語と表示中の言語のずれの検出。
- `src/hooks/useReducedMotion.ts` — `prefers-reduced-motion` の購読。
- `src/App.tsx` — フックとコンポーネントの組み立てのみ。
- `src/components/RouletteWheel.tsx` — SVG 描画。回転は CSS `transform` トランジション。
- `src/components/ItemList.tsx` — 項目の追加・削除・ターゲット指定 UI と、印の表示制御。
- `src/components/LocaleSwitch.tsx` — 言語別 URL へのリンク。
- `src/components/LocaleNotice.tsx` — 別言語版への誘導リンク。

### スピンの仕組み

`useRoulette` の `spin()` が核心ロジック。`targetId` が設定されていればその項目のスライス角に収まるよう回転角を計算し、見た目はランダムでも結果を確定させる。完了検知はホイールの `transitionend`、`SPIN_FALLBACK_MS` のタイマーはバックグラウンドタブ等で発火しない場合の保険。

### ステルス前提の UI

人に画面を見せながら回す用途を前提に、結果を仕込めることが画面上から分からないよう作ってある。以下は仕様であって、削ったり戻したりしない。

- 画面・タブタイトル・meta には「デキレーレット」「当たり」「必ず」等の示唆する語を置かない。表向きは単なる「ルーレット」。
- ターゲット指定は項目の長押し（`LONG_PRESS_MS`）のみ。専用ボタンやツールチップは置かない。単純クリックでは何も起きない。キーボードは OS のキーリピート（`KeyboardEvent.repeat`）を拾う。
- 指定中の印はカラードットを塗りからリングに変えるだけ。リストにポインタ／フォーカスがある間と指定直後 `TARGET_HINT_MS` の間しか出さず、スピン中と結果表示中は必ず伏せる。
- 隠し操作の説明はフッターの折りたたみ内にのみ置き、スピン開始で自動的に閉じる。

### 言語別 URL

日本語版が `/`、英語版が `/en/`。それぞれ独立した静的 HTML（`index.html` / `en/index.html`）で、`vite.config.ts` の `build.rollupOptions.input` に両方を並べてある。JS バンドルは共通。

- 表示言語は URL だけで決まる（`localeFromPath`）。`navigator.language` は表示の決定に使わない。焼き込んだ HTML と画面が食い違わないため。
- 言語切替はステートの切替ではなく `<a href>` での遷移。行き先は `LOCALE_PATHS` が唯一の定義。
- ブラウザの言語が表示中の言語と違うときは、もう一方の言語版へのリンクを最上部に出すだけにする。自動リダイレクトはしない。共有された URL の言語を上書きしてしまう。
- 誘導リンクは閲覧者ごとに変わるので、マウント後に描画する（静的 HTML には出さない）。
- 両ページが自分自身への `canonical` と、`ja` / `en` / `x-default` の `hreflang` を持つ。`x-default` は `/` に向ける。
- 言語を増やすときに触るのは、`i18n.ts` の `LOCALES` / `LOCALE_PATHS` / `translations`、エントリ HTML の追加、`vite.config.ts` の `input`、両ページの `hreflang`、`public/sitemap.xml`。

### デザイントークン

配色・書体・アニメーションは `tailwind.config.ts` の `theme.extend` に集約。金色 `gold` は結果表示とフォーカスリング、`flare` はスピン操作専用。指定中の印には専用色を使わず、スライス色をそのまま流用する。

### SEO とメタ情報

公開 URL は `https://roulette.basekeita.com/`。canonical・OGP・sitemap の絶対 URL はこれに揃える。

検索に載せたい語と、画面に出してはいけない語を分けてある。

- `<title>` と `<h1>` は画面共有に映るので一般語のみ（「ルーレット」「無料」「アプリ」）。
- ブランド語「デキレーレット」は `meta[name=description]` と JSON-LD の `alternateName` にだけ置く。どちらもクローラしか読まないので画面には出ない。
- `public/og.png` は Slack 等のリンク展開で映る可能性があるため、盤面だけの中立な絵にしてある。再生成する場合も仕込みを示唆する要素を入れない。
- `public/robots.txt` / `public/sitemap.xml` はビルド時に `dist/` へコピーされる。sitemap は各 `<url>` に `xhtml:link` で言語の対応関係を書く。
- JSON-LD は `<script type="application/ld+json">`。データブロックなので CSP の `script-src` には引っかからない。

### セキュリティヘッダ

`public/_headers` に CSP と各種セキュリティヘッダを定義。ビルド時に `dist/_headers` へコピーされ、Cloudflare の静的アセット配信が適用する。外部スクリプトを追加する場合は `script-src` / `connect-src` の更新が必要。

### パスエイリアス

`vite.config.ts` で `@` → `./src` のエイリアスが設定されている。

### デプロイ

`main` ブランチへの push で Cloudflare Pages が自動ビルド＆デプロイ（Connect to Git で連携）。
