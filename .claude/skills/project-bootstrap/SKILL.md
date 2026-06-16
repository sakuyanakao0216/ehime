---
name: project-bootstrap
description: 新規エンタープライズプロトを立ち上げる際、`gh repo create --template` でテンプレを展開する、Vercel project を作成する、`.mcp.json` の `${GITHUB_TOKEN}` プレースホルダに値を流す、`.claude/settings.json` を `/doctor` で検証する、までを 1 セッションで一気通貫に実行する起動 wizard。「プロジェクト立ち上げ」「新規プロト」「project-bootstrap」「テンプレから始めて」「初期セットアップ」「Vercel に連携して」などのキーワードでトリガする。`project-scaffold` (Next.js 雛形展開) の **前段**として動き、その後 `/project-init` を呼ぶ役割。
allowed-tools: [Bash, Read, Write, Edit]
---

# project-bootstrap

## このスキルが解決すること

「テンプレリポジトリは作ったが、新規案件のたびに以下を手作業でやっていて時間を食う」:

1. `gh repo create --template <org>/vercel-aiagent-coding-skill-starter` でテンプレ展開
2. `cd && pnpm install`
3. `vercel project add` で新規 Vercel project 作成 → `vercel link` (region / Production Branch / Toolbar Enabled の初期設定)
4. `gh secret set GITHUB_TOKEN`
5. `.mcp.json` の存在確認 + `${GITHUB_TOKEN}` プレースホルダ確認
6. `/doctor` で `.claude/settings.json` を検証
7. 初回 Draft PR を作成

このスキルは上記を **対話的に質問しながら自動実行**する。

## 起動方法

### slash command

`/project-bootstrap` で wizard 開始。

### 自律起動

「新規プロト立ち上げて」「テンプレから案件作って」などの発話。

## wizard の質問

1. **新規 repo 名**: `my-prototype` 等
2. **org/owner**: `gh` のデフォルト or 指定
3. **Visibility**: public / private
4. **テンプレ repo の場所**: デフォルトは `dentsu-fde/vercel-aiagent-coding-skill-starter` (TBD)
5. **Vercel team**: `vercel teams ls` から選択
6. **Production Branch**: デフォルト `main`
7. **GITHUB_TOKEN を登録する?** y/N (登録するなら値を Secrets に隠して受け取る)

## 実行する Bash コマンド (人間確認を挟む)

```bash
# 1. repo 作成
gh repo create <owner>/<repo> --template <org>/vercel-aiagent-coding-skill-starter --<visibility> --clone

# 2. install
cd <repo>
pnpm install

# 3. Vercel project 作成 + リンク (project add → link の順)
vercel project add <repo>
vercel link --yes
# Production Branch 設定は API 経由 or 手動誘導

# 4. secrets
gh secret set GITHUB_TOKEN     # 値は標準入力で受ける

# 5. settings 検証は settings-doctor プラグインの /doctor で行う (下記参照)

# 6. 初回 push + Draft PR
git switch -c chore/bootstrap
git commit --allow-empty -m "chore: bootstrap project"
git push -u origin chore/bootstrap
gh pr create --base main --head chore/bootstrap --draft --title "WIP: bootstrap"
```

手順 5 の settings 検証は、`settings-doctor` プラグインの **`/doctor` コマンド (スキル) を起動**して `.claude/settings.json` を診断する。他プラグインのスクリプトはインストール先パスが環境ごとに異なるため、`node` でパス直書き実行はしない。

## 注意

- このスキルは **複数の破壊的でない外部 API 呼び出し**を行う (repo 作成、Vercel project 作成、secret 設定)。各ステップでユーザに確認を求める
- `gh` / `vercel` / `pnpm` / `node` が必要。事前確認のため最初に `command -v` で全部チェック
- 失敗時のロールバックは「作った repo を `gh repo delete` する」など個別対応。wizard 側で自動ロールバックはしない (確認のため)

## 周辺 Plugin

- `project-scaffold` — bootstrap 後に呼ぶ Next.js 雛形展開
- `settings-doctor` — 最終ステップでの設定検証
- `docs-runbook` — `/docs-runbook init` を bootstrap 完了時に提案
