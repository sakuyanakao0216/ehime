---
name: design-review
description: UI/UX デザインの品質を 8 軸 (アクセシビリティ / レスポンシブ / タイポグラフィ / 余白 / カラー / インタラクション / 一貫性 / スマホ実機) で精緻にチェックするスキル。「デザインレビュー」「UI レビュー」「アクセシビリティ確認」「コントラスト確認」「レスポンシブ確認」「デザイン品質」「/design-review」「Lighthouse 通る?」などのキーワードでトリガする。WCAG 2.2 AA・8px グリッド・日本語タイポ規約・実機サイズ (スマホ 375/390/412・タブレット 768/834・PC 1280/1440) に基づき、致命的 / 重要 / 望ましい で分類して具体的修正案を添える。Safari 固有の挙動 (overflow / position: sticky 等) もチェック対象。
allowed-tools: [Bash, Read]
---

# design-review

## このスキルが解決すること

ピッチ前に「動くがピッチで通らない」状態を炙る。観点が散らかると見落としが出るので 8 軸で固定。

## 8 軸

| # | 軸 | チェック内容 | 基準 |
|---|---|---|---|
| 1 | アクセシビリティ | コントラスト / alt / aria / focus ring / form label | WCAG 2.2 AA |
| 2 | レスポンシブ | スマホ / タブレット / PC / 大画面の崩れ | 後述の確認幅で表示確認 |
| 3 | タイポグラフィ | font 階層 / 行間 / 文字間 / 和欧混植 | 日本語タイポ規約 |
| 4 | 余白 | 上下左右の間隔 / セクション間 / 内側 padding | 8px グリッド |
| 5 | カラー | トークン使用 / hex 直書きの有無 / dark mode | CSS 変数経由のみ |
| 6 | インタラクション | hover / active / disabled / loading 状態 | 全状態網羅 |
| 7 | 一貫性 | 同種要素のスタイル統一 / 用語の統一 | プロジェクト規約 |
| 8 | **実機（スマホ/タブレット/PC）** | スマホ 375/390/412・タブレット 768/834・PC 1280/1440 で実物確認 | Safari 固有挙動含む |

## レスポンシブ確認幅（軸2・軸8 共通）

| デバイス | 確認幅 (px) | 主な観点 |
|---|---|---|
| スマホ | 375 / 390 / 412 | 縦積み・タップ領域 44px・本文 16px・横スクロール無し |
| タブレット | 768 / 834 | 2 カラム化・sidebar↔drawer の切替点・余白拡大 |
| PC | 1280 / 1440 | 多カラム・最大幅 (`max-w-*` + 中央寄せ)・余白上限 |
| 大画面 | 1536+ | 間延び防止 (コンテナ最大幅) |

`shadcn-ui` の [responsive.md](../shadcn-ui/references/responsive.md) と breakpoint を揃え、`smoke-test` のマルチビューポートで自動回帰も取る。

## 出力フォーマット

```
## design-review レポート (8 軸)

### [致命的] (ピッチ前に必ず直す)
- (1) コントラスト不足: `.muted-foreground` が `#a1a1aa` で背景 `#fafafa` 上で 2.8:1 (要 4.5)
  → `--muted-foreground: #6b7280` に変更を提案

### [重要] (時間があれば直す)
- (4) 余白不一致: Card 間隔が `gap-3` と `gap-4` 混在
- (8) Safari iPhone 15 Pro Max で `position: sticky` ヘッダが ramp する

### [望ましい] (任意)
- (3) タイトル `text-3xl` だが、ピッチでは `text-4xl` が映える
```

## 起動方法

- `/design-review` (明示)
- 「デザインレビューして」「UI 見て」「アクセシビリティ確認」(自律)

## 補助ツール

- Lighthouse CI (`pnpm dlx @lhci/cli`) で自動スコア化
- axe-core for アクセシビリティ自動検証
- Vercel Toolbar の Lighthouse Tab

## 周辺

- `vercel-toolbar-loop`: コメント対応後の品質再確認
- `deploy-preflight`: デプロイ前最終チェック (動作系)
