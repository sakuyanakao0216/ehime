# Core Web Vitals チェックリスト

指標ごとに 閾値 → 典型原因 → Next.js での対処 をまとめる。判定はすべて p75（75 パーセンタイル）基準。

## 閾値（Google の基準）

| 指標 | 良好 | 要改善 | 不良 |
|---|---|---|---|
| LCP（最大コンテンツ表示） | ≤ 2.5s | 2.5〜4.0s | > 4.0s |
| CLS（レイアウトずれ） | ≤ 0.1 | 0.1〜0.25 | > 0.25 |
| INP（操作への反応） | ≤ 200ms | 200〜500ms | > 500ms |

## LCP

| 典型原因 | Next.js での対処 |
|---|---|
| ヒーロー画像が重い/遅延読み込み | `next/image` + ファーストビューの画像に `priority` |
| サーバー応答が遅い | データ取得を Server Component に寄せる / fetch のキャッシュ / Suspense でストリーミング |
| Web フォントの読み込み待ち | `next/font`（self-host + `display: swap` 相当が標準） |
| 巨大なクライアント JS が描画を阻害 | 下記「バンドル」参照 |

## CLS

| 典型原因 | Next.js での対処 |
|---|---|
| サイズ未指定の画像 | `next/image`（width/height or fill 必須でずれない） |
| フォント切替でテキストが動く | `next/font` でフォールバックのメトリクス調整 |
| 後から挿入されるバナー/埋め込み | 領域を先に確保（固定の高さ・スケルトン） |
| 動的コンテンツの差し込み | ローディング状態に同サイズのプレースホルダ |

## INP

| 典型原因 | Next.js での対処 |
|---|---|
| クライアントバンドル肥大 | `'use client'` を葉に近づける / 重い処理は Server Component へ |
| 重いコンポーネントの即時読み込み | `next/dynamic` でモーダル・エディタ・チャート等を遅延 |
| 巨大な依存（チャート・エディタ等） | bundle-analyzer で特定し軽量代替 or dynamic import |
| 入力ごとの重い再レンダー | 状態の分割 / メモ化（測ってから） |

## 計測コマンド

```bash
# ラボ計測（開発中の点検）
npx lighthouse http://localhost:3000 --view
# 本番相当で測る場合は production build で
pnpm build && pnpm start
```

```bash
# バンドル分析
pnpm add -D @next/bundle-analyzer
```

```js
// next.config.js（withBundleAnalyzer でラップ、ANALYZE=true pnpm build で起動）
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)
```

- dev サーバーでの Lighthouse は実態より悪く出る。**必ず production build で計測**
- 実ユーザー計測（フィールド）は Vercel Speed Insights（observability-setup）。ラボとフィールドで数値が違うのは正常

## 出力フォーマット

```
## perf-check レポート（docs/review/perf.md）
計測: / (LCP 4.2s / CLS 0.18 / INP 150ms) @ production build

### 致命的
- [LCP] ヒーロー画像 1.8MB・<img> 直書き → next/image + priority + 圧縮
### 重要
- [CLS] フォント切替でずれ → next/font に統一
- [bundle] chart ライブラリ全量 import → next/dynamic で遅延
### 望ましい
- [boundary] page.tsx 全体が 'use client' → データ取得を Server に分離
```

> Lighthouse のスコア算出やオプションはバージョンで変わる。詳細フラグは `npx lighthouse --help` か公式で確認すること。
