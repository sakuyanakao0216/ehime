---
name: cost-guard
description: 課金の見積と上限・アラートを設定するスキル。「コスト」「課金」「料金見積」「いくらかかる」「予算」「課金事故」「上限設定」「請求アラート」「トークン代」「AI のコスト」「Spend Management」「予算アラート」「/cost-guard」などのキーワードでトリガする。AI Gateway / Vercel / Firebase (GCP) の課金構造を整理し、AI 機能のトークン単価 × 想定呼び出し回数の概算、Vercel Spend Management、GCP/Firebase の予算アラート、AI Gateway の支出上限を設定する。「プロトを公開したまま放置して課金事故」の防止が主目的で、公開後の運用（体験フロー⑪）や AI 機能を入れた直後・放置予定のプロジェクトを畳む前に起動する。結果は docs/ops/cost.md に出力する。
allowed-tools: [Bash, Read, Write, Edit]
---

# cost-guard

## このスキルが解決すること

プロトは「公開して見せたら放置」が普通。そこに AI 機能・無限ループ・bot アクセスが重なると**気づかぬうちに課金が走る**。先に見積り、上限とアラートを仕掛けておく。

1. **概算**: AI トークン単価 × 想定呼び出し回数 + Vercel/Firebase 従量分
2. **上限**: 超えたら止まる/止める設定（Spend Management・AI Gateway の支出上限）
3. **アラート**: 上限の手前で気づく通知（予算アラートは通知のみで止まらない点に注意）

## 起動方法

### slash command
`/cost-guard [estimate|ai|vercel|firebase]` で起動。

### 自律起動
「これいくらかかる?」「課金が怖い」「予算アラート設定して」「公開したまま放置しても大丈夫?」などで自動起動。

## 点検と設定（[cost-checklist.md](./references/cost-checklist.md)）

| サービス | 主な課金源 | 守り |
|---|---|---|
| AI Gateway | トークン従量（モデル単価 × 入出力トークン） | クレジット/支出上限・使用量ダッシュボード |
| Vercel | Function 実行・帯域・画像最適化 | Spend Management（通知 + 自動停止） |
| Firebase (GCP) | Firestore 読み書き・Storage・Functions | Cloud Billing 予算アラート（**通知のみ**） |

概算 → 各サービスの上限/アラート設定 → `docs/ops/cost.md` に「月額見込み・設定済みの守り・放置時に止める手順」を記録する。

## 実コストの見方（「いくら使ったか」を見る場所）

| 見たいもの | 場所 | 前提 |
|---|---|---|
| 請求額・モデル別実コスト・残高 | Vercel ダッシュボード → AI Gateway → **Observability**（リクエスト別 model / tokens / cost / provider） | なし（コード不要） |
| **機能別**の内訳（どの route が食っているか） | Vercel ダッシュボード → **Logs** で `ai_usage` を検索 | `ai-feature` の `logAiUsage` 配線（starter 同梱 `lib/ai-usage.ts`） |

詳細手順は [cost-checklist.md](./references/cost-checklist.md) の「実コストの見方」。配線がまだなら ai-feature のパターンに従い `onFinish` / `usage` を追加する。

## やってはいけないこと

- AI 機能を**上限なし**で公開（プロンプト1つで単価が変わる。まず概算）
- GCP の予算アラートを「上限」と誤解する（通知のみ。超過しても止まらない）
- レート制限なしの AI エンドポイントを公開（ai-feature / ai-safety-check と連携）
- 概算だけして設定しない（見積りは守りではない）

## 周辺

- `ai-feature`: AI 呼び出しの実装側（モデル選定・呼び出し回数がコストを決める）
- `ai-safety-check`: 乱用対策（レート制限）はコスト防衛でもある
- `observability-setup`: 使用量の急増をアラートで検知
- `docs-runbook`: プロジェクトを畳む/止める手順の記録先
