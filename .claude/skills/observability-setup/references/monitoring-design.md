# 監視設計

`docs/ops/observability.md` の雛形。

```markdown
# Observability

## 監視項目
| 項目 | 指標 | 閾値/アラート |
|---|---|---|
| エラー率 | 5xx / 未処理例外 | 5分で N 件超で通知 |
| LCP | p75 | 2.5s 超で要改善 |
| 主要操作の成功率 | sign_up / create 成功率 | 急落で通知 |
| 関数エラー | Route Handler / Functions | 失敗連続で通知 |
| AI 使用量 | `ai_usage` ログの日次トークン量 | 前日比 N 倍 / 想定の N 倍で通知 |

## ログ方針
- レベル: error / warn / info（debug は本番で出さない）
- **PII を出さない**（privacy-check）。ユーザーは匿名 ID
- 構造化ログ（JSON）でフィルタしやすく

## アラート
- 通知先（Slack / メール）と担当
- 閾値は最初は緩め → ノイズを見て調整
```

## 設計の指針

- プロトは「落ちたら気づける」最低限から。全部盛りにしない
- エラー率・主要操作の成功率・LCP の 3 つを優先
- AI 使用量は `ai-feature` が配線する `ai_usage` 構造化ログ（starter の `lib/ai-usage.ts`）が前提。急増は乱用かバグ（無限ループ）のシグナルで、コスト事故の早期検知になる（上限・請求の確認は `cost-guard`）
- 行動分析（コンバージョン等）は `analytics-events`、ここは「健全性」を見る
- ログ保持期間は `privacy-check` の保存期間方針と整合
