---
name: release-pr
description: develop から main へのリリース PR を作る。含まれる PR を一覧にし、変更を本番への影響の有無で分けて要約した本文を付ける。develop に差分が無い、develop の CI が通っていない、本番に影響する変更が無い場合は、作る前に止めて知らせる。ユーザーが「リリース PR を作って」「develop から main への PR」「本番に出したい」「リリースして」と依頼したときに使う。
---

# develop → main のリリース PR を作る

`main` を更新する PR だけが、Workers Builds による本番デプロイを起こす。
**このスキルがやるのは PR の作成（または本文の更新）だけ。マージはしない。**
マージはユーザーの操作で、「Create a merge commit」を使う（squash・rebase は `develop` と `main` の履歴がずれる）。

必要な情報は `git log` と `gh` だけで取れるので、作業ツリーは触らない。

## 1. 作る前に確認する

```bash
git fetch origin --quiet --prune                                           # origin/develop が古いと差分を取り違える
git log --oneline origin/main..origin/develop | head                       # 空なら出すものが無い
gh pr list --base main --head develop --state open --json number,url       # 既存のリリース PR
SHA=$(git rev-parse origin/develop)
gh api repos/{owner}/{repo}/commits/$SHA/check-runs --jq '[.check_runs[]|"\(.name)=\(.conclusion // .status)"]'
```

次のどれかなら**作らずに止めて**、理由を報告する。

| 状態 | 対応 |
| --- | --- |
| 差分が無い | 「出すものが無い」と報告する |
| `check` が success でない（未実行・失敗） | 報告して止める。実行中なら待つ。`develop` の CI は push で動く |
| open のリリース PR がある | 新規作成せず、§5 の手順で本文を更新する |

## 2. 含まれる PR を集める

`develop` は PR を merge commit で取り込むので、first-parent をたどると 1 行が 1 PR になる。
PR のブランチ内にある `Merge branch 'main' into ...` は first-parent に出ない。

```bash
git log --first-parent --format='%h%x09%s' origin/main..origin/develop
NUMS=$(git log --first-parent --format='%s' origin/main..origin/develop \
  | grep -oE 'Merge pull request #[0-9]+|\(#[0-9]+\)$' | grep -oE '[0-9]+' | sort -un)
git log --first-parent --format='%h %s' origin/main..origin/develop \
  | grep -vE 'Merge pull request #[0-9]+|\(#[0-9]+\)$'                    # PR を経ていないコミット
```

- 最後のコマンドで出たコミットは、`develop` への直接 push（想定外）。本文の「PR を経ていないコミット」に載せ、ユーザーにも知らせる。
- PR ごとの情報は、zsh でも動くよう `for` ではなく `while read` で回す（zsh は `$NUMS` を改行で分割しない）。

```bash
printf '%s\n' "$NUMS" | while read -r n; do
  gh pr view "$n" --json number,title,url,author,additions,deletions,files \
    --jq '"#\(.number) \(.title) | bot=\(.author.is_bot) | +\(.additions)/-\(.deletions) | \([.files[].path]|join(" "))"'
done
```

Dependabot の PR は `author.is_bot` が true で、login は `app/dependabot`。

## 3. 変更を読んで要約する

**タイトルだけで要約しない。** PR の本文と差分（`gh pr view <N> --json body`、`gh pr diff <N>`）を読む。

| 区分 | 判定するファイル |
| --- | --- |
| アプリ | `src/`、`public/`、`*.html`、`scripts/`、`vite.config.ts`、`tailwind.config.ts`、`wrangler.jsonc` |
| 依存 | `package.json`、`package-lock.json`。Dependabot のタイトルが `build(deps)` なら実行時依存、`build(deps-dev)` なら開発用 |
| CI・文書・開発環境 | `.github/`、`.claude/`、`README.md`、`CLAUDE.md`、`LICENSE` |

- 依存は `from → to` を表にする。**major の更新と、PR 本文に「Security fixes」「GHSA」があるものは強調する。**
- PR のタイトルに `【#N】` があれば、その Issue を「関連 Issue」に載せる。

## 4. 本番への影響を判定する

```bash
git diff --name-only origin/main...origin/develop \
  | grep -vE '^(\.claude/|\.github/|README\.md$|CLAUDE\.md$|LICENSE$)' || echo "(本番に影響するファイルなし)"
```

何も出なければ、デプロイは走るが**成果物は変わらない見込み**。作る前に、ユーザーに「今リリースする意味があるか」を確かめる。
ユーザーが出すと決めたら、本文の「成果物」に「変わらない見込み」と書く。

## 5. PR を作る

タイトルは `【Issueなし】リリース <YYYY-MM-DD>: <主な変更を一言>`。head が `develop` なので Issue 番号は付かない。
本文は一時ファイルに書き、`--body-file` で渡す（日本語・バッククォート・表を含むため）。

```markdown
## 概要

<今回本番に出るものを 1〜3 文で。画面や挙動が変わるのか、依存・基盤だけなのか>

## 本番への影響

- **画面・挙動**: <変わる点。無ければ「なし」>
- **依存関係**: <実行時依存か開発用か。major・セキュリティ修正があれば明記。無ければ「なし」>
- **ビルド・配信**: <設定やワークフローの変更。無ければ「なし」>
- **成果物**: <変わる見込みか。CI・文書・スキルだけなら「変わらない見込み」>

## 含まれる PR

| PR | 区分 | 内容 |
|---|---|---|
| #N | アプリ／依存／CI・文書 | <1 行> |

関連 Issue: <【#N】があれば。無ければこの行は省く>

## 変更のまとめ

### アプリ
<該当が無い区分は節ごと省く>

### 依存関係

### CI・文書・開発環境

## PR を経ていないコミット

<§2 で出たときだけ。無ければ節ごと省く>

## 確認

- `develop` の CI: 成功（<run へのリンク>）
- この PR の CI とガード（`Release guard / develop-only`）: 作成後に確認する

## マージ時の注意

- **「Create a merge commit」でマージする**（squash・rebase は `develop` と `main` の履歴がずれる）
- マージすると本番デプロイが走る

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

```bash
gh pr create --base main --head develop --title "<タイトル>" --body-file <scratchpad>/release-pr-body.md
```

### 既存のリリース PR を更新するとき

`gh pr edit` は Projects (classic) の廃止エラーで失敗することがある。REST で本文を差し替える。

```bash
python3 -I -c 'import json,sys; json.dump({"body": open(sys.argv[1]).read()}, open(sys.argv[2],"w"))' \
  <scratchpad>/release-pr-body.md <scratchpad>/release-pr-body.json
gh api -X PATCH repos/{owner}/{repo}/pulls/<N> --input <scratchpad>/release-pr-body.json --jq .html_url
```

## 6. 報告する

- PR の URL、含まれる PR の件数、本番への影響の有無
- `develop` の CI の結果と、ガード `develop-only` がこの PR で通ること
- **マージはしていないこと**と、マージすると本番デプロイが走ること
- マージ後に確かめたいと頼まれたら、`main` の先頭コミットに `Workers Builds: deki-roulette` のチェックが付いて成功したかを見る

```bash
gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/check-runs --jq '.check_runs[]|"\(.app.slug): \(.name) = \(.conclusion // .status)"'
```
