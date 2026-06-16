---
name: observability-setup
description: アプリの監視・ログ・エラー追跡を設計するスキル。「監視設定」「オブザーバビリティ」「エラーログ」「エラー監視」「Sentry」「Crashlytics」「Vercel Logs」「パフォーマンス監視」「行動ログ」「アラート設計」「observability」「error-monitoring」などのキーワードでトリガする。エラーログ・パフォーマンス・ユーザー行動ログ・監視項目を docs/ops/observability.md に設計し、Sentry / Vercel Logs / Firebase Crashlytics の導入手順を提示する（旧 error-monitoring を統合）。ログに PII を出さない方針を privacy-check と、計測イベントを analytics-events と住み分ける。
allowed-tools: [Bash, Read, Write, Edit]
---

# observability-setup

## このスキルが解決すること

公開後「落ちているのに気づかない」「再現できない」を防ぐ。**何を見るか（監視項目）と、どう拾うか（ツール）**を設計する。

1. **エラー追跡**: 例外を捕捉・通知（Sentry / Crashlytics）
2. **パフォーマンス**: Core Web Vitals / レスポンス（Vercel Speed Insights）
3. **行動ログ / 監視項目**: 重要操作の成否、アラート閾値
4. **ログ方針**: 出力レベル・PII 非混入・保持

## 起動方法

### slash command
`/observability [design|sentry|vercel|crashlytics]` で起動。

### 自律起動
「監視を入れたい」「エラー監視」「Sentry 設定」「落ちてないか見たい」などで自動起動。

## 監視設計（docs/ops/observability.md）

[monitoring-design.md](./references/monitoring-design.md) の型で、監視項目・アラート・ログレベルを定義。ツール導入手順は [error-tools.md](./references/error-tools.md)。

| レイヤ | 見るもの | ツール例 |
|---|---|---|
| エラー | 例外・未処理 rejection | Sentry / Crashlytics |
| パフォーマンス | LCP/INP/CLS・レスポンス | Vercel Speed Insights |
| サーバー/関数 | Route Handler / Functions ログ | Vercel Logs / Cloud Logging |
| AI 使用量 | `ai_usage` ログの日次トークン量の急増（乱用・無限ループ検知） | Vercel Logs（`ai-feature` の logAiUsage 配線が前提）/ 請求は cost-guard |
| 行動 | 重要操作の成功率 | analytics-events と連携 |

## やってはいけないこと

- **ログ/エラーに PII を載せる**（privacy-check と連携、マスキング）
- アラート閾値を決めず通知過多 or 無通知にする
- 行動分析（analytics-events）と運用監視を混同する（目的が違う）

## 周辺

- `privacy-check`: ログ/エラーの PII 非混入
- `analytics-events`: プロダクト計測（こちらは運用監視）
- `deploy-preflight`: デプロイ前チェックと運用後監視の連続
- GCP 側は Cloud Logging / Error Reporting（[backend-strategy](../_docs/comparison/backend-strategy.md)）
