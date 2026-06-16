# 体験フロー ①〜⑪ 網羅チェック（スポえひめ）

> 2026-06-15。AGENTS.md の体験フロー①構想〜⑪運用に沿って、現状（済/部分/未）と次アクションを整理。
> プロトの現在地を俯瞰し、社会実装(2027)に向けた抜けを把握するための一覧。

## ① 構想  ✅ 済（厚め）
- idea-framing / user-research / competitive-analysis / kpi-design / spec 相当を steering 化。
- 成果物: requirements / user-research / competitive-analysis / insights / concept-v2 / concept-v3。
- 次: ターゲット定義の数値化（ペルソナ別 KPI）、社会実装フェーズの体制（オールえひめ）整理。

## ② 設計  🟡 部分
- 画面・データモデル・IA は design.md＋実装で確定（参加者/募集の分離、3タブ、成立型）。
- 未: api-contract（実API仕様）、data-modeler（正規化スキーマ）、画面遷移図の正式化。
- 次: 実装の暗黙モデルを `api-contract.md` / `data-model.md` に書き起こす。

## ③ 環境  ✅ 済
- Next.js 16 / TS / Tailwind v4 / Biome / pnpm。Vercel 自動デプロイ・PRプレビュー稼働。
- 次: 本番 env（NEXT_PUBLIC_APP_URL 等）と AI Gateway 認証（OIDC）を社会実装時に確定。

## ④ UI 構築  ✅ 済
- Sport Editorial デザインシステム（極太見出し・オレンジ差し色・ヘアライン）。
- shadcn 系 UI を手配置（registry 遮断のため）。レスポンシブ＋モバイル下部ナビ。
- 次: アクセシビリティ点検（コントラスト/フォーカス）、ダークモード検証。

## ⑤ 素材  🟡 部分
- mockdata-ja でモック（市町・種目・指導者・イベント・交流/つながり/コラボ）。
- format-ja 相当は未（日付/通貨整形のユーティリティ未導入。現状は文字列直書き）。
- 未: 画像（image-gen）。現在はアイコン（lucide）＋絵文字なしの構成。
- 次: 実データ連携の差し込み口を明確化。必要なら format-ja / 画像を追加。

## ⑥ コア機能  🟡 部分（プロト動作）
- AI マッチング `/api/match`（generateObject＋ルールベースfallback）。
- 成立型イベント・相談チャット・活動サマリーは**フロントのモック**（永続化なし）。
- 未: firebase-backend（認証/DB）、実チャット、イベント成立の永続化、AIつながり/コラボの実API。
- 次: 社会実装で最優先。`/api/match` を土台に各 AI 機能を route 化、logAiUsage 配線。

## ⑦ AI 品質  🔴 未
- ai-eval（プロンプト評価）/ ai-safety-check（安全・公平性）未実施。
- 論点: 匿名候補の公平な提示、未成年関与の安全配慮、説明可能性（理由提示は有）。
- 次: マッチング/イベント企画プロンプトの評価セットとガードレールを設計。

## ⑧ 品質  🔴 ほぼ未
- design-review/perf-check/privacy-check/pitch-review 未実施。
- privacy: 行動データ（観戦/チェックイン）取得を前提化 → **目的明示・最小収集・同意**設計が必須。
- 次: privacy-check（個人情報・行動ログの扱い）を最優先で。perf/SEO/pitch も通す。

## ⑨ リリース  🟡 部分
- Vercel プレビュー発行は稼働。deploy-preflight / smoke-test / seo-meta は未整備。
- 次: metadata/OGP（seo-meta）、スモークテスト、本番前チェックリスト。

## ⑩ FB循環  🟡 部分
- PR の Vercel プレビュー＋CIモニタリング購読中。vercel-toolbar-loop / analytics-events は未配線。
- 次: analytics-events（イベント閲覧・参加・相談の計測）、Toolbar フィードバック導線。

## ⑪ 運用  🔴 未
- docs-runbook / observability-setup / cost-guard / db-migration 未。
- 次: 社会実装に向け、監視（ai-usage/コスト）・手順書・移行計画を整備。

## 優先度サマリー（プロト→社会実装の橋渡し）

1. **⑧ privacy-check**（行動データ前提なので最優先）
2. **⑥ firebase-backend + 実AI route**（成立/相談/マッチの永続化）
3. **⑦ ai-eval / ai-safety-check**（公平性・安全・説明性）
4. ② api-contract / data-model の明文化
5. ⑨ seo-meta / smoke-test、⑩ analytics-events
