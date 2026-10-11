---
name: dependabot-triage
description: このリポジトリで開いている Dependabot の PR を一括で精査し、「そのままマージしてよい」「対応すれば入れられる」「見送る」「閉じてよい」に分けて方針を示す。CI の結果だけで判断せず、CI が走っていない PR のローカル検証、PR 同士の重複、脆弱性アラートとの関係まで実測で裏を取る。ユーザーが「dependabot の PR を見て」「マージしていいものをリストアップして」「dependabot の PR どうする」「どれを対応すべきか」と依頼したときに使う。
---

# Dependabot PR のトリアージ

**`mergeStateStatus: CLEAN` と CI 成功だけで OK にしない。**
CLEAN は「ブロックされていない」であって「通る」ではない。裏を取れなかった PR は「未検証」と書く。

このスキルは**読み取りと一時 worktree での検証だけ**をする。
マージ・クローズ・`@dependabot` コメント・push・アラートの dismiss は、ユーザーが頼むまでやらない。

## 0. 準備

```bash
git fetch origin --quiet      # origin/develop が古いと、マージ済みの PR が差分に紛れる
git status -sb | head -3
```

検証は**ユーザーの作業ツリーでやらない。** `npm run dev` が動いていることがあり、
`checkout` / `npm install` / `build` はそれを壊す。スクラッチパッド配下に worktree を作り、最後に必ず消す。

## 1. 一覧を取って仕分ける

```bash
gh pr list --author "app/dependabot" --state open --limit 100 \
  --json number,title,headRefName,createdAt,mergeable,mergeStateStatus,statusCheckRollup
```

| 状態 | 次にやること |
| --- | --- |
| CI 成功 | §2 |
| CI 失敗 | §3 |
| `statusCheckRollup` が空（CI なし） | §4 |
| 同じパッケージを触る PR が複数 | §5 |

## 2. CI が通った PR

CI（`.github/workflows/ci.yml`）は `npm ci` → `npm run lint` → `npm run build`。
`build` は `tsc -b` を先頭に走らせるので型検査も兼ね、SSR バンドルとプリレンダまで通る。

```bash
gh pr diff <N> | grep -E '^diff|^[+-]\s'     # 何のファイルが変わるか
```

- **GitHub Actions の更新**は、ワークフローの SHA ピン留めがタグと一致するか確かめる。
  `.object.type` が `tag` なら annotated タグなので、`git/tags/<sha>` で辿ってコミットを得る。
  ```bash
  gh api repos/<owner>/<action>/git/ref/tags/<tag> --jq '.object.sha + " " + .object.type'
  ```
- **major 更新**は PR 本文のリリースノートで Breaking Changes を読む。
- **`dependencies`（react / react-dom）の更新**はブラウザに届くコードが変わる。CI が通っても
  §4 の末尾にある静的 HTML の確認と、`react-ui-verify` でのブラウザ確認まで行う。
- **lockfile を実測で見る。** 単体の bump が、別の依存の古い版を入れ子に残して重複を作ることがある。
  ```bash
  node -e '
  const p=require("./package-lock.json").packages, names=process.argv.slice(1);
  for (const [k,v] of Object.entries(p))
    if (names.some(n=>k.endsWith("node_modules/"+n)))
      console.log(k.replace(/^node_modules\//,""), v.version, v.dev?"(dev)":"");
  ' <パッケージ名>...
  ```
  `a/node_modules/b` のように入れ子で出る行は重複。

## 3. CI が失敗した PR

```bash
gh run view <run-id> --log-failed | tail -60     # run-id は statusCheckRollup[].detailsUrl に入っている
```

| ログ | 原因 | 方針 |
| --- | --- | --- |
| `ERESOLVE` と peer 制約 | 連動して上げるべき別パッケージがある（`eslint` ↔ `eslint-plugin-react-hooks`、`@vitejs/plugin-react` ↔ `vite` など） | 組を特定する。前提の更新が重いなら見送り |
| lint の新規ルール違反 | コード側の修正が要る | 何件・どのファイルかを数え、修正案を出す |
| build 失敗（`[vite:css]`・`tsc`） | major 更新に伴う設定移行（`tailwindcss` 4 は PostCSS プラグインが別パッケージ） | 移行コストを見積もる。急がないなら見送り |
| タイムアウト・ネットワーク | 一時的 | 再実行 |

失敗 PR は**組み合わせて試す**。単体では落ちる 2 つが、揃えれば通ることがある。§6 の手順で確かめる。

## 4. CI が走っていない PR

CI 導入より前に作られた PR などは checks が空になる。**CI と同じ手順をローカルで再現する。**
次のスクリプトを bash で保存し、リポジトリの直下から実行する。
zsh では `PIPESTATUS` が使えない（小文字の `pipestatus`）。出力は `| tail` に流さず、ファイルへ落として `$?` を取る。

```bash
#!/usr/bin/env bash
# usage: verify.sh <PR 番号> <スクラッチパッド>
set -u
N=$1; S=$2
mkdir -p "$S/wt" "$S/logs"
git fetch origin "pull/$N/head" --quiet || exit 90
git worktree add --detach "$S/wt/pr$N" FETCH_HEAD --quiet || exit 91
cd "$S/wt/pr$N" || exit 92
for step in "npm ci" "npm run lint" "npm run build"; do
  $step >"$S/logs/pr$N.log" 2>&1; rc=$?
  echo "### $step exit=$rc"
  if [ "$rc" -ne 0 ]; then tail -25 "$S/logs/pr$N.log"; break; fi
done
```

- **`npm ci` / `npm install` がネットワークで失敗したら、後続の lint・build の結果は捨てる。**
  古い `node_modules` のまま通ってしまう。インストールが成功してからやり直す。
- CI は Node 24。ローカルが違うなら、報告に「ローカルの Node で確認」と書く。
- ブラウザに届くコードや SSR・プリレンダに関わる依存（`react`・`react-dom`・`vite`・
  `@cloudflare/vite-plugin`・`@vitejs/plugin-react`）を触る PR は、build のあと
  **誘導リンクの文言がプリレンダ HTML に出ていない**ことを確かめる（CLAUDE.md の「プリレンダリング」）。
  ```bash
  grep -n "localeSuggestion" src/i18n.ts      # 日英の文言を控える
  grep -cF -- "<文言>" dist/index.html dist/en/index.html dist/order/index.html \
    dist/en/order/index.html dist/privacy/index.html dist/en/privacy/index.html   # すべて 0
  ```
- 確かめたら worktree を消す（§10）。

## 5. PR 同士の関係

- **`@cloudflare/vite-plugin` と `wrangler` は組で上げる。** `wrangler` の単体 bump は、
  `@cloudflare/vite-plugin` 配下に旧版の `wrangler` を入れ子で残し、`workerd` / `miniflare` / `sharp` も
  二重になる。この 2 つを含むグループ PR（`multi-*` ブランチ）を優先し、単体 bump は見送るか閉じる。
- **グループ PR は、解決後の版が同じになることがある。**
  worktree の `package-lock.json` から版を読んで比べる（§2 のスニペット）。
  同じなら片方を入れれば他方は不要。
- lockfile を触る PR は、1 つ入れるたびに他が競合する。Dependabot が自動で rebase するが、
  **人が編集したブランチは対象外**（§7）。

## 6. 「対応すれば入れられる」PR の解決策を実測する

```bash
git worktree add --detach "$S/wt/try" origin/develop
cd "$S/wt/try" && npm ci
npm install --no-audit --no-fund -D <a>@<ver> <b>@<ver>      # PR の組み合わせを再現
npm run lint; npm run build
```

- 出たエラーは**件数と場所**で報告する（「`path:行` に 1 件」）。
- 「Update branch」（develop の取り込み）が競合するかは実測する。
  `git merge origin/develop` で、`package.json` の隣り合う行や lockfile が競合する。
- マージの順序を決める。**コード修正 → 依存 PR** の順にすると、依存 PR は rebase で追従できる。
  新旧どちらの版でも動くコードなら、順序の制約は付かない。

## 7. Dependabot ブランチとブランチ運用

- Dependabot の PR は既定ブランチの `develop` に出る。**`develop` へのマージはデプロイされない。**
  本番へ出るのは `develop` → `main` のリリース PR（merge commit）だけで、トリアージの対象外。
- base が `develop` 以外の PR は、マージ前に `develop` へ付け替えるか作り直す。`main` へ入れるとそのまま本番に出る。
  `gh pr edit --base` は Projects (classic) の廃止エラーで失敗することがある。
  その場合は `gh api -X PATCH repos/{owner}/{repo}/pulls/<N> -f base=develop` を使う。
- **`develop` と `main` へ直接 push しない。** 修正は Dependabot のブランチへ積むか、別ブランチで PR にする。
  どちらにするかはユーザーに聞く。
- **人が編集したブランチ（「Update branch」のマージコミットを含む）は、Dependabot が管理をやめる。**
  `@dependabot rebase` は断られるので、作り直しは `@dependabot recreate`。
- 修正コミットを Dependabot のブランチへ積むと、その PR は自動 rebase されなくなる。
  **積む場合はそのトレードオフを伝える。**
- push は通常の push。force はしない。push 前に、そのブランチの最終状態で
  `npm ci` → lint → build を通す。push 後は CI の結果まで見る。
- コミットは `commit` スキルの規約（英語の Conventional Commits）に従う。

## 8. セキュリティの観点

- PR 本文の「Security fixes」や GHSA を拾い、**優先度を上げる。**
- 開いているアラートを引く（権限が無ければ 403/404 になる。その旨を報告する）。
  ```bash
  gh api "repos/{owner}/{repo}/dependabot/alerts" --paginate \
    --jq '.[]|select(.state=="open")|[.number,.security_advisory.severity,.dependency.package.name,.security_vulnerability.first_patched_version.identifier]|@tsv'
  ```
- **major を `ignore` で止めると、アラートが開いたまま残ることがある。**
  修正版が major の先にしか無いとき（親が古い major を要求している依存）に起きる。
  誰が要求しているかを `package-lock.json` の逆引きで確かめる。
  ```bash
  node -e '
  const p=require("./package-lock.json").packages;
  for (const [k,v] of Object.entries(p))
    if (v.dependencies && v.dependencies[process.argv[1]])
      console.log(k||"(root)", "->", v.dependencies[process.argv[1]], v.dev?"(dev)":"");
  ' <パッケージ名>
  ```
- 残るアラートについては、dev 依存か（ビルド時のみか）、攻撃者が入力を渡せるかを添え、
  **「許容して dismiss する／移行する／ignore を外す」の選択肢をユーザーに出す。** dismiss は勝手にしない。

## 9. 方針を示す

見送る PR は `.github/dependabot.yml` の `ignore` を提案する。**先に今の `ignore` を読み、重複させない。**
コメントには「外す条件」だけを書く。設定は default ブランチから読まれるので、マージされるまで効かない。
すでに開いている PR が自動で閉じるとは限らないので、残ったら手動で閉じる。

```yaml
    ignore:
      # 6 系は vite 8 が必須。vite を上げるときに外す
      - dependency-name: "@vitejs/plugin-react"
        update-types: ["version-update:semver-major"]
```

`ignore` の対象は止めたい依存だけに絞る。`update-types` だけで全依存の major を止めると、
上げたい PR まで止まる。

### 報告の仕方

次の 4 つに分け、**根拠を 1 行ずつ**付ける。

| 区分 | 書くこと |
| --- | --- |
| マージしてよい | CI 成功／SHA 照合／ローカル実測（CI 未実行ならそう書く）。マージの順序と競合の見込み |
| 対応すれば入れられる | 何を直すか、実測したエラー、マージの順序、Dependabot への指示（§7） |
| 見送る | 理由と、外す条件。`ignore` の案 |
| 閉じてよい | 何に取って代わられたか |

- 判断が要る点（残るアラートなど）は別に立てて、推しを添える
- 検証できなかった PR は「未検証」と書く。ローカルで確かめたものは「CI ではなくローカルで確認」と区別する
- 実際にやる操作（マージ・コメント・`ignore` 追加・コード修正）は、やってよいかを聞いて終える

## 10. 後始末

```bash
git worktree remove --force "$S/wt/pr<N>"     # 検証した PR の分すべて
git worktree prune
git worktree list | grep -c "$S"              # 0 を確認
git status -sb | head -3                      # 作業ツリーが元のままか
```

- 静的サーバなどを立てたなら、**PID で止める。** プロセス名での `pkill` は禁止。
  `npm run dev` は `@cloudflare/vite-plugin` 経由で `workerd` を子プロセスに持つので、
  名前で殺すとユーザーの dev サーバまで巻き添えになる。
  ポートは dev（5173）と preview（4173）を避け、`ss -lptn 'sport = :<port>'` で PID を引き、
  自分が起動したものだけを `kill <pid>` する。
- ローカルのブランチを作ったなら消す（push 済みなら `git branch -d`）。
