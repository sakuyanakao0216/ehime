---
name: deploy-preflight
description: デプロイ前のプレフライトチェックを実行するスキル。「デプロイ前確認」「リリースチェック」「/deploy-check」「/ship」「デプロイしていい?」「公開前確認」「本番デプロイ準備」などのキーワードでトリガする。TypeScript 型 / ESLint / build / シークレット漏洩 / ドキュメント更新 / console.log 残存 / TODO 棚卸し / 画像アセット重複 / 本番モードでの `ignoreBuildErrors` 警告 / smoke test / 公開範囲 (デモ保護) を順に確認し、致命的問題があればデプロイを止める。すべてパスしたら Vercel に本番デプロイする選択肢を提示する。
allowed-tools: [Bash, Read]
---

# deploy-preflight

## このスキルが解決すること

「`pnpm dev` で動いてたから大丈夫だろう」でデプロイすると、本番で:
- TypeScript エラーが build を落とす
- `console.log` が大量に出てパフォーマンス低下
- うっかり `.env` を commit していた
- TODO コメントが本番に流入
- `next.config.mjs` で `ignoreBuildErrors: true` のまま本番昇格
- 客限定で見せるつもりのデモが全世界公開のまま URL が出回る

を踏む。このスキルは決まったチェックを毎回確実に走らせ、人間が判断できる状態にする。

## 起動方法

### slash command

`/deploy-check` (旧 `/ship` も別名として有効) で起動。引数で `--dry-run` (チェックのみ、デプロイしない) を渡せる。

### 自律起動

「デプロイ前確認」「リリースしていい?」「公開前にチェック」などの発話で起動。

## チェック項目 (順序固定)

| # | 項目 | 致命度 | コマンド |
|---|---|---|---|
| 1 | TypeScript 型 | 致命的 | `pnpm typecheck` (or `tsc --noEmit`) |
| 2 | ESLint | 警告許容 | `pnpm lint` |
| 3 | build (Next.js) | 致命的 | `pnpm build` |
| 4 | シークレット漏洩 | 致命的 | scripts/scan-secrets.mjs |
| 5 | console.log 残存 | 警告 | scripts/scan-console.mjs |
| 6 | TODO/FIXME 棚卸し | 情報 | grep |
| 7 | 画像アセット重複 | 警告 | scripts/scan-duplicate-images.mjs |
| 8 | next.config.mjs 危険設定 | 致命的 (本番昇格時) | scripts/scan-prod-config.mjs |
| 9 | smoke test (主要画面が開くか) | 致命的 | `pnpm test:smoke` (`smoke-test` プラグインが導入する) |
| 10 | 公開範囲 (デモ保護) | 警告 | scripts/scan-demo-protection.mjs |

各スクリプトは Node builtin のみで動作 (依存ゼロ)。項目 9 は `smoke-test` プラグインが `package.json` に `test:smoke` を用意している場合のみ実行する (未導入ならスキップし、導入を提案)。

### 項目 10: 公開範囲 (デモ保護)

「客には見せたいが世界には公開したくない」プロトが全世界公開のままデプロイされるのを防ぐ。スクリプトは middleware にサイト全体ゲート (Basic 認証等) があるかだけを機械判定し、見つからなければ warning を出す — Vercel Deployment Protection はダッシュボード設定のためローカルから検出できない。warning が出たら、(1) 意図的な全世界公開である / (2) Vercel Deployment Protection を設定済み / (3) これから保護を入れる、のどれかをユーザーに確認する。手段の選び方とコード例は [references/deployment-protection.md](./references/deployment-protection.md) を参照 (保護有効時は項目 9 の smoke test 側にバイパス設定が必要な点も同ドキュメントに記載)。

## 致命的問題が出た場合

- 該当箇所と修正方針を表示
- ユーザに「ここで止まる」「無視して進める」を確認
- 「無視して進める」を選んだ場合は `.preflight-override.json` に override 履歴を残す (監査用)

## 全部 green になったら

以下を選択肢として提示:

1. `vercel deploy --prod` で本番デプロイ
2. `git push` で Vercel 連携経由デプロイ
3. Draft PR を Ready に昇格 → main にマージ
4. デプロイは見送り (チェックだけしたかった)

## hooks/pre-deploy.sh との連携

このプラグインは `hooks/pre-deploy.sh` も同梱する。Vercel CLI の `vercel deploy --prod` を Bash で呼ぶ直前に hook として走らせる運用も可能。

## push ガード hook (hooks/preflight-guard.mjs)

このプラグインは PreToolUse hook (`hooks/hooks.json`) を同梱する。Bash で `git push` を含むコマンドを実行しようとしたとき、`/deploy-check` が全項目 pass 時に書き込む `.claude/preflight-pass` の内容が現在の HEAD と一致しなければ、「deploy-preflight 未実行のまま push しようとしています」と確認 (ask) を挟む。判定不能・エラー時は何もせず通す fail-open 設計で、push を機械的にブロックはしない。無効化したい場合はプラグイン自体を disable するか、`/hooks` でこの PreToolUse hook を外す。

## 周辺 Plugin

- `smoke-test`: 項目 9 の `test:smoke` を導入。ピッチ直前にデモ破損を検知
- `vercel-toolbar-loop`: Toolbar コメント解消後に `/deploy-check` で最終チェック
- `design-review`: デザイン品質チェック (本スキルは品質より「動くか」を見る)
- `settings-doctor`: settings.json が壊れていないか
