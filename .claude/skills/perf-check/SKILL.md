---
name: perf-check
description: アプリの表示パフォーマンスを点検・改善するスキル。「パフォーマンス」「重い」「遅い」「表示が遅い」「Core Web Vitals」「LCP」「CLS」「INP」「Lighthouse」「バンドルサイズ」「ページ速度」「読み込み遅い」「/perf-check」などのキーワードでトリガする。Core Web Vitals (LCP/CLS/INP) を Lighthouse で計測し、next/image・next/font・dynamic import・Server/Client Component 境界・バンドルサイズ (@next/bundle-analyzer) の観点で原因を特定して改善する。design-review（見た目 8 軸）と相補のパフォーマンス軸で、公開・ピッチ前（体験フロー⑧品質）に「デモ中に重くて待たせる」を潰す。結果は docs/review/perf.md に出力する。
allowed-tools: [Bash, Read, Write, Edit]
---

# perf-check

## このスキルが解決すること

デモ中の「読み込み待ちの沈黙」と「ガタつく画面」はピッチの説得力を直接削る。**Core Web Vitals の 3 指標**で現状を測り、Next.js の定石で潰す。

1. **LCP**: 最大コンテンツの表示まで（画像・フォント・サーバー応答）
2. **CLS**: レイアウトのガタつき（サイズ未指定の画像・後挿入要素）
3. **INP**: 操作への反応（重い JS・過大なクライアントバンドル)

design-review が見た目 8 軸を見るのに対し、ここは**速度・安定性**の軸を担う。

## 起動方法

### slash command
`/perf-check [measure|image|font|bundle|boundary]` で起動。

### 自律起動
「ページが重い」「Lighthouse のスコア上げたい」「バンドルサイズ確認」「公開前にパフォーマンス見て」などで自動起動。

## 点検の流れ（[cwv-checklist.md](./references/cwv-checklist.md)）

| 手順 | 内容 | ツール |
|---|---|---|
| 1. 計測 | 主要ページの LCP/CLS/INP とスコア | `npx lighthouse <url>`（ラボ計測） |
| 2. 画像/フォント | `next/image` / `next/font` の適用漏れ | grep + Read |
| 3. バンドル | 重い依存・クライアント肥大 | `@next/bundle-analyzer` |
| 4. 境界 | `'use client'` の位置が高すぎないか | Read |
| 5. レポート | 指標 / 原因 / 修正案を致命的・重要・望ましいで分類 | `docs/review/perf.md` |

**Lighthouse と Speed Insights の使い分け**: Lighthouse は手元で再現できるラボ計測（開発中の点検向き）。Vercel Speed Insights は実ユーザーの実測（公開後の継続監視向き、observability-setup が担当）。公開前はまず Lighthouse で潰す。

## やってはいけないこと

- 計測せずに「たぶん画像が重い」で手を入れる（先に Lighthouse）
- `<img>` 直書き・サイズ未指定のまま放置（CLS の典型原因）
- ページ全体を `'use client'` にして重いライブラリをクライアントに送る
- スコア 100 を目指して時間を溶かす（プロトは「体感で待たない」が合格線）

## 周辺

- `design-review`: 見た目 8 軸（こちらは速度・安定性の軸で相補）
- `observability-setup`: 公開後の Speed Insights による実測監視
- `deploy-preflight`: 公開前チェックの一環としてここを通す
- `shadcn-ui` / `image-gen`: 重いコンポーネント・画像アセットの発生源
