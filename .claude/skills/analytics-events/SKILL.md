---
name: analytics-events
description: プロダクトの計測イベントを設計するスキル。「イベント設計」「計測設計」「アナリティクス」「GA4」「PostHog」「Firebase Analytics」「トラッキング」「計測ポイント」「analytics-events」などのキーワードでトリガする。app-flow-designer の導線と story-map の成功条件から、計測すべきイベント・発火ポイント・プロパティを設計し docs/analytics/events.md に出力する。GA4 / PostHog / Firebase Analytics 向けの計測コード例も提示する（実配線は案内）。イベントに PII を含めない設計を privacy-check と連携し、experiment-plan の成功指標の計測基盤になる。
allowed-tools: [Bash, Read, Write, Edit]
---

# analytics-events

## このスキルが解決すること

「あとで効果測定したいが何も計測していなかった」を防ぐ。導線と成功条件から**計測イベントを先に設計**し、命名とプロパティを統一する。

1. **イベント設計**: 何を / どこで / どんなプロパティで計測するか
2. **命名統一**: 一貫した命名規則（後から分析しやすい）
3. **プロバイダ実装例**: GA4 / PostHog / Firebase Analytics

## 起動方法

### slash command
`/analytics-events [design|ga4|posthog|firebase]` で起動。

### 自律起動
「イベント設計して」「計測ポイントを決めたい」「GA入れる前に設計」などで自動起動。

## イベント設計（docs/analytics/events.md）

`app-flow` の主導線 + `story-map` の成功条件から、KPI に効くイベントを選ぶ。命名は [event-naming.md](./references/event-naming.md)。

```markdown
| イベント | 発火ポイント | プロパティ | 対応KPI |
|---|---|---|---|
| sign_up | 登録完了 | method(email/google) | 登録率 |
| create_item | 作成完了 | item_type | アクティベーション |
| share | 共有実行 | channel | バイラル |
```

プロバイダ別の送信コードは [providers.md](./references/providers.md)。

## やってはいけないこと

- **イベントに PII を入れる**（メール/氏名/住所）→ ID 化（privacy-check と連携）
- 命名がバラバラ（`signup` と `sign_up` 混在）→ 規則に統一
- 何でも計測してノイズ化 → KPI に効くものに絞る

## 周辺

- `app-flow-designer` / `spec-writer`: 計測対象の導線・成功条件
- `experiment-plan`: A/B の成功指標をこのイベントで測る
- `privacy-check`: PII 非混入の確認
- `observability-setup`: 行動ログ/監視と計測の住み分け
