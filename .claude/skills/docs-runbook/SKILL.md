---
name: docs-runbook
description: プロジェクトに「Git フローのドキュメントが無い」「デプロイ手順が暗黙知」「rollback 方法が分からない」「新メンバ向け onboarding が無い」「troubleshooting がバラバラ」といった状況で起動する運用ドキュメント雛形生成スキル。`docs/manuals/` 配下に Git flow / Deploy guide / Rollback / Secrets / Troubleshooting の Markdown 雛形を一括生成し、リポジトリの実情 (Vercel / GitHub / pnpm / Next.js などの検出結果) に応じて内容を差し込む。「マニュアル整備」「ランブック作って」「デプロイガイド」「Git フロー書いて」「onboarding ドキュメント」「/docs-runbook」などのキーワードでトリガする。
allowed-tools: [Bash, Read, Write, Edit]
---

# docs-runbook

## このスキルが解決すること

「マニュアル類が無い / バラバラ」というのは、プロト案件・小規模チーム・引き継ぎ局面で必ず出てくる。だが個別に書くと毎回 30 分以上かかり、結果として書かれない。このスキルは:

1. リポジトリの実情を **自動検出**: `package.json` / `vercel.json` / `.github/workflows/` / `.mcp.json` / `next.config.mjs` から技術スタックを推定
2. `docs/manuals/` 配下に **5 ファイルを一括生成**: `git-flow.md` / `deploy-guide.md` / `rollback.md` / `secrets.md` / `troubleshooting.md`
3. 検出結果に基づき **プレースホルダを差し込み**: Vercel project があれば deploy-guide.md に Vercel 固有手順、`.github/workflows/` があればその概要

## 起動方法

### slash command

`/docs-runbook init` で 5 ファイル全部生成。
`/docs-runbook git-flow` 等で個別生成も可能。

### 自律起動

「マニュアル整備」「Git フロー書いて」「デプロイガイド作って」「rollback 手順」「troubleshooting まとめて」などの発話で自動起動。

## 生成するファイルと内容

| ファイル | 主な見出し |
|---|---|
| `git-flow.md` | branch 命名 / Draft PR / main 直 push 禁止 / Auto-fix を活かす branch 戦略 |
| `deploy-guide.md` | Vercel project 初期設定 / Production Branch / Preview / 本番昇格 |
| `rollback.md` | Vercel Instant Rollback / git revert / `deploy-preflight` の dry-run |
| `secrets.md` | GITHUB_TOKEN の最小スコープ / Vercel env / `.env` 取扱 |
| `troubleshooting.md` | 既知ハマりどころ (settings-doctor との連携) |

雛形は [templates/](./templates/) 配下。

## 手順

1. `git rev-parse --show-toplevel` でリポジトリルートを取得
2. Read で `package.json`, `vercel.json`, `next.config.mjs` を読み、検出結果をメモ
3. `docs/manuals/` を mkdir
4. templates/ から各 .md を Write で出力。プレースホルダ (`{{PROJECT_NAME}}`, `{{VERCEL_PROJECT}}`) を置換
5. 生成後、`docs/manuals/README.md` の index に各ファイルへのリンクを追加 (Edit)

## 既存ファイル衝突時の挙動

`docs/manuals/<file>.md` が既に存在する場合は **上書きしない**。代わりに `<file>.md.proposal` として出力し、差分をユーザに提示。

## 参考

- [templates/](./templates/) — Markdown 雛形
- `settings-doctor` Plugin — `troubleshooting.md` の典型 3 失敗パターンを引用
