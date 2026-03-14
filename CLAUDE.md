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

**出来レーレット** — ルーレットの結果をユーザが事前に指定できる SPA。

- `src/App.tsx` — 唯一のステート管理層。`items`（項目リスト）、`targetId`（確定当たり項目のID）、`spinning`、`rotation`、`result` を管理する。
- `src/components/RouletteWheel.tsx` — SVG でルーレットを描画。回転は CSS `transform: rotate()` + `cubic-bezier` トランジションで表現。
- `src/components/ItemList.tsx` — 項目の追加・削除・ターゲット指定 UI。

### スピンの仕組み

`App.tsx` の `spin()` 関数が核心ロジック。`targetId` が設定されている場合はその項目のスライス角に収まるよう `rotation` を計算し、見た目はランダムでも結果を確定させる。4.5 秒の CSS トランジション後 (`setTimeout` 4600ms) に `result` を表示。

### パスエイリアス

`vite.config.ts` で `@` → `./src` のエイリアスが設定されている。

### デプロイ

`main` ブランチへの push で Cloudflare Pages が自動ビルド＆デプロイ（Connect to Git で連携）。
