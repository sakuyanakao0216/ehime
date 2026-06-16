---
name: project-scaffold
description: 新規プロジェクトに Next.js 16 + Tailwind CSS v4 + shadcn/ui の最小スタックを展開する。空の repo / プロト初日 / 「とりあえず動く画面が欲しい」局面で起動する。`vercel-aiagent-coding-skill-starter` テンプレを base にして clone するか、現プロジェクトに不足ファイルだけ追加するかを自動判定する。「scaffold」「Next.js を入れて」「プロト雛形」「project-scaffold」「/project-init」「テンプレで始める」などのキーワードでトリガする。`project-bootstrap` (Vercel 連携や Secrets 設定) の **後段**として動く、または単独で実行される。
allowed-tools: [Bash, Read, Write, Edit]
---

# project-scaffold

## このスキルが解決すること

新規プロト立ち上げ時に毎回手作業で:
- Next.js init
- Tailwind v4 (`@import 'tailwindcss'` 方式) のセットアップ
- shadcn/ui (`new-york` / `neutral`) の init + 基本コンポーネント追加
- `tsconfig.json` の strict 設定
- `.gitignore` / `.nvmrc` / `.npmrc`

これらを 1 つずつ調べながら設定すると 30-60 分かかる。このスキルは starter テンプレからの clone or 不足ファイル補完で **5 分以内**に動く状態にする。

## 起動方法

### slash command

`/project-init` で起動。

### 自律起動

「scaffold して」「Next.js セットアップ」「shadcn 入れて」「テンプレから」などの発話で自動起動。

## 動作モード

スキル起動時に以下を判定して 2 モードを使い分ける:

### モード A: 空 repo / package.json なし

→ `vercel-aiagent-coding-skill-starter` を **degit** で展開:

```bash
npx degit dentsu-fde/vercel-aiagent-coding-skill-starter .
# または: gh repo clone dentsu-fde/vercel-aiagent-coding-skill-starter .
```

> 注: starter が GitHub Template として有効化されている (`gh repo edit --template=true` 済) ため、`gh repo create --template` の方が望ましい。状況により degit / gh template / 手動 clone を選択。

### モード B: 既存プロジェクトに不足分追加

`package.json` などが既にある場合は、不足しているファイル/設定だけを追加:

- `tailwindcss` 系依存
- `app/globals.css` の `@import "tailwindcss"` + `@theme inline`
- `components.json` (shadcn 設定)
- `tsconfig.json` の strict
- `.nvmrc` / `.npmrc`

上書きする前に必ず diff をユーザに見せて承認を取る。

## 手順 (モード A)

1. `git status` でカレント repo の状態を確認 (untracked / modified が無いか)
2. ある場合はユーザに stash or commit を促す
3. `npx degit dentsu-fde/vercel-aiagent-coding-skill-starter .` (または `gh repo create --template`)
4. `pnpm install --frozen-lockfile`
5. `pnpm dev` で `localhost:3000` を起動 (Web sandbox 環境ではスキップ)
6. 完了後、ユーザに次のアクション (`/doctor`, `/docs-runbook init`, `vercel link` 等) を提案

## 手順 (モード B)

1. 既存 `package.json` の依存を読み、足りないものをリスト化
2. 不足設定ファイルは starter リポジトリの該当ファイルを取得して配置する:
   - `npx degit dentsu-fde/vercel-aiagent-coding-skill-starter /tmp/scaffold-starter` で一時展開し、不足ファイルだけコピー
   - または `gh api repos/dentsu-fde/vercel-aiagent-coding-skill-starter/contents/<path> --jq .content | base64 -d` で単一ファイル取得
   - API (Route Handler / Server Action) の雛形が要る場合は [references/api-patterns.md](./references/api-patterns.md) の内容を基に生成する
3. `pnpm install` で依存解決
4. 起動確認

## 既存ファイル衝突時

- `app/globals.css` などが既に存在する場合は **上書きしない**
- 差分を表示し、ユーザ承認後に Edit でマージ
- 完全に同名ファイルは `.proposal` 拡張子で並べて出力

## 周辺 Plugin

- `project-bootstrap`: GitHub repo 作成 + Vercel project + Secrets を行う前段
- `shadcn-ui`: scaffold 後の個別コンポーネント追加
- `firebase-backend`: DB / 認証 / 本格バックエンドが要るとき
- `settings-doctor`: `.claude/settings.json` の最終検証
- `docs-runbook`: マニュアル雛形生成

## 参考

- [references/api-patterns.md](./references/api-patterns.md): Next.js ネイティブの API (Route Handler / Server Action) パターン = バックエンド T1。DB/認証が要るなら `firebase-backend`、階層判断は [docs/comparison/backend-strategy.md](../_docs/comparison/backend-strategy.md)
