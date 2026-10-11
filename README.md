# 出来レーレット

ユーザが入力した項目から 1 つを選ぶルーレットと、項目をランダムに並べ替えて順番を決めるページからなるアプリケーションです。

## コンセプト

「ルーレットで決めたことにしたい」というシーンで使うツールです。
回す前に当てたい項目を指定しておくと、見た目はランダムに回りながら結果はその項目に止まります。

人に画面を見せながら回す状況を前提にしているため、**仕込めることが画面上から一切分からない**設計になっています。盤面と操作は普通のルーレットそのもので、当たりの指定は隠しジェスチャからのみ行えます。順番決め (`/order/`) も同じ考え方で、先頭と末尾だけを伏せたまま決めておけます。

## 機能

- 項目を自由に追加・編集・削除（2〜24 個、1 項目 20 文字まで）
- 追加した項目を円グラフ状のルーレットに表示
- スピンボタンでルーレットを回転し、結果を表示・テキストとしてコピー
- 項目の長押しで、次のスピンで選ばれる項目を指定
- 順番決め (`/order/`) で項目をランダムに並べ替え、結果を 1 位から順に表示・テキストとしてコピー
- 順番決めでは項目の長押しで先頭・末尾を指定
- 日本語と英語の 2 言語。表示言語は URL で決まり、ブラウザの言語と違うときはもう一方へのリンクを出すだけで自動では切り替えない
- `prefers-reduced-motion` 対応

### ページ

| URL | 内容 |
|---|---|
| `/` `/en/` | ルーレット |
| `/order/` `/en/order/` | 順番決め |
| `/privacy/` `/en/privacy/` | プライバシーポリシー |
| `/app/privacy/` | iOS アプリ用のプライバシーポリシー（`noindex`） |

`/app/privacy/` 以外は React で組み、ビルド時に静的 HTML へ焼き込むので、JS が動く前から本文が HTML に入っています。
`/app/privacy/` は `public/` の静的 HTML をそのまま配ります。実装の構成は [CLAUDE.md](CLAUDE.md) にあります。

### 当たりの指定

項目を 0.6 秒ほど長押しすると、その項目が次のスピンで選ばれます。もう一度長押しで解除。
キーボードの場合は項目にフォーカスして Enter を押しっぱなしにします。単純なクリックやタップでは何も起きません。

指定中の印はカラードットが中抜きのリングに変わるだけで、次の条件でのみ表示されます。

- リストにポインタまたはフォーカスがある間
- 指定した直後の約 1.6 秒間

スピン中と結果表示中は必ず伏せられ、フッターの「使い方」もスピンを押した瞬間に自動的に閉じます。
何も指定しなければ結果は本当にランダムです。

### 順番の指定

順番決めでは、項目を長押しするたびに 先頭 → 末尾 → 解除 と切り替わります。先頭と末尾はそれぞれ 1 項目までで、
別の項目に付け替えると前の指定は外れます。指定した項目以外の並びは常にランダムです（Fisher-Yates、乱数は `crypto.getRandomValues`）。
印の見え方と伏せ方はルーレットと同じで、並べ替え中と結果表示中には出ません。

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | React 19 |
| 言語 | TypeScript 5.7 |
| ビルドツール | Vite 8 |
| スタイリング | Tailwind CSS 3 |
| テスト | Vitest 5 |
| リンタ | ESLint 10 (typescript-eslint) |
| パッケージマネージャ | pnpm 11 |
| CI | GitHub Actions (lint / test / build) |
| ホスティング・デプロイ | Cloudflare Workers の静的アセット配信 (Workers Builds) |
| アクセス解析 | Cloudflare Web Analytics |
| 広告 | Google AdSense（手動ユニット） |

## ローカル起動

### 前提

- Node.js 22.13 以上の偶数系（ESLint 10 が 22.13 未満を、Vitest 5 が 23 と 25 を対象外にしている。CI は 24）
- pnpm 11（`packageManager` に版を固定してある。Corepack か `pnpm/action-setup` で入る）

### 手順

```bash
# 依存関係のインストール
pnpm install

# 開発サーバの起動 (http://localhost:5173)
pnpm run dev
```

### その他のコマンド

```bash
# 本番ビルド（型検査 → クライアント → SSR バンドル → 静的 HTML への焼き込み）
pnpm run build

# ビルドしてから wrangler dev で配信 (http://localhost:8787)
pnpm run preview

# Lint
pnpm run lint

# テスト (Vitest)
pnpm test

# テストをウォッチモードで起動
pnpm run test:watch
```

## デプロイ

公開 URL: https://roulette.basekeita.com/

`develop` → `main` のマージで Cloudflare の Workers Builds が自動的にビルド＆デプロイします。`develop` へのマージではデプロイされません。
設定は `wrangler.jsonc` で、Worker のコードを持たない静的アセットだけの構成です。

| 設定項目 | 値 |
|---|---|
| Build command | `pnpm run build` |
| Deploy command | `npx wrangler deploy` |
| `PNPM_VERSION` (ビルド変数) | `package.json` の `packageManager` と同じ版 |

出力先の指定は要りません。`pnpm run build` が `dist/wrangler.json` と `.wrangler/deploy/config.json` を生成し、wrangler がそこを読んで `dist/` を配信します。

## CI

PR と `develop` への push で、GitHub Actions が lint・test・build を並列に実行します。
`main` へ出せる PR は head が `develop` のものだけで、それ以外は `Release guard` が失敗させます。

## ライセンス

[MIT](LICENSE)
