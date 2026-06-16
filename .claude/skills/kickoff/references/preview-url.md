# プレビュー URL の取得 (push 後に必ず出力)

作業ブランチ (CLI/ローカルは `dev`、Claude Web はセッションの `claude/<slug>` 自動ブランチ) を push したら、
Vercel の Preview デプロイ URL を取得してユーザーに提示する。
**既定は「Draft PR を作って PR から URL を拾う」経路**(どの環境でも確実)。`.vercel/project.json` があれば MCP 直接経路も使える。

## 前提

- repo が **Vercel に import 済み (GitHub 連携 ON)** であること。これがあれば push / PR で Preview が自動生成される
- `.vercel/project.json` は `vercel link` 実行時だけ生成され **gitignore 済**。クローン直後・クラウド環境には無いので、無いことを前提に PR 経路を既定とする

## 経路 A: Vercel MCP (`.vercel/project.json` がある場合のみ)

1. `.vercel/project.json` を Read → `projectId` 取得。無ければ `list_projects` で特定
2. `list_deployments`(projectId, ブランチ/最新) で当該デプロイを探す
3. `get_deployment`(deploymentId) で `url` (Preview URL) と state を取得
4. `READY` になったら URL を提示。`BUILDING` なら「ビルド中」を伝え、必要なら少し待って再取得

## 経路 B: gh CLI — Draft PR から取得 (既定・どの環境でも確実)

1. 作業ブランチを push する (`main` 以外)
2. **Draft PR を作成**: `gh pr create --draft --fill`(タイトル/本文が曖昧なら利用者に一言確認)
3. Vercel 連携がそのブランチの Preview を自動ビルドし PR に貼る → 下記で URL を拾う

push 済みブランチに PR がある前提:

```bash
# PR のチェックから Vercel の Preview URL を拾う
gh pr view --json statusCheckRollup \
  -q '.statusCheckRollup[] | select(.context | test("[Vv]ercel")) | .targetUrl'
# または PR 一覧/詳細から
gh pr checks
```

- Vercel は PR にデプロイ status / コメントを付けるので、その `targetUrl` / コメント内 URL を抽出する
- PR が未作成なら、まず Draft PR を作る (`gh pr create --draft`) と Preview と Toolbar が紐づく

## 出力例

```
## プレビュー: https://<project>-<hash>-<scope>.vercel.app  (state: READY)
```

state が READY でない場合はその旨も伝える (例: `BUILDING — 数十秒後に再取得します`)。

## vercel link で MCP 直接経路を使いたい場合 (任意)

`vercel link` を実行すると `.vercel/project.json` が生成され、MCP の projectId 解決ができるようになる。
ただし **`vercel login` やチーム/プロジェクト選択など対話入力が必要**。これらは勝手に進めず、
**利用者に「`vercel login` / リンク先プロジェクトの選択をしてください」と入力を依頼する**。

## 注意

- `main` には直接 push しない (Preview ではなく本番デプロイになる)
- ブランチ名は環境依存 (CLI/ローカル=`dev`、Claude Web=`claude/<slug>`)。どちらでも PR からプレビューは取れる
- URL が取れない場合は「Vercel import / PR 作成 / デプロイ完了」のどれが未了かを切り分けて報告する
