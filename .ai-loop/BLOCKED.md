# BLOCKED (#29)

## 必要なこと
AC1 の randomBelow のユニットテストを `src/shuffle.test.ts` に新しい describe として足したい（テスト計画・/goal の指示どおり）。
しかし `src/shuffle.test.ts` は `.ai-loop/protected_tests` に載っていて、編集できない。

## 試したこと
- 実装は済んでいる（コミット 6e149d7）。randomBelow の export、pickTargetIndex、spin() での利用、README.md / CLAUDE.md の追記。
- pickTargetIndex のテスト（AC2）は `src/hooks/useRoulette.test.ts` にあり、実装前に 5 ケースとも落ちたことを PROGRESS.md に記録済み。
- `src/shuffle.test.ts` は保護対象なので編集していない。

## 選択肢
1. `src/shuffle.test.ts` を protected_tests から外す。既存ケースは変えず、新しい describe("randomBelow") だけを足す（推奨）。
2. randomBelow のテストを新規ファイル（例 `src/randomBelow.test.ts`）に置く。allowed_paths にその追加が要る。

## 影響する既存テスト
- `src/shuffle.test.ts` の既存ケース（shuffle / arrange の全ケース）は変えない。
