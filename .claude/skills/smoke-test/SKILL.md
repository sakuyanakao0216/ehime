---
name: smoke-test
description: プロト向けの最小テストハーネスを導入するスキル。「テスト書いて」「E2E」「Playwright」「スモークテスト」「smoke-test」「デモ壊れてないか確認」「ユニットテスト」「Vitest」「CIでテスト回したい」「主要画面が開くか確認」などのキーワードでトリガする。Playwright で「主要画面が開く・主導線がクリックできる」スモーク E2E と、Vitest で factory / util の最小ユニットを用意し、package.json に test:smoke / test:e2e / test:unit を追加する。網羅率は追わず「ピッチ前にデモが壊れていないか」を最小コストで担保することに振り切る。deploy-preflight のプレフライト (項目 9) から test:smoke が呼ばれる。
allowed-tools: [Bash, Read, Write, Edit]
---

# smoke-test

## このスキルが解決すること

プロトに本格テストは過剰だが、**ピッチ当日に画面が真っ白**は致命傷。このスキルは「網羅率」ではなく「主要導線が生きているか」だけを最小コストで守る:

1. **Playwright スモーク**: トップ / 主要画面が 200 で開き、主導線 (ログイン → ダッシュボード等) がクリックで進む
2. **Vitest 最小ユニット**: `mockdata-ja` の factory や金額計算など壊れると痛い純関数だけ
3. **deploy-preflight 統合**: `test:smoke` をプレフライトから呼び、緑でなければデプロイを止める

## 起動方法

### slash command

`/smoke-test [smoke|unit|all]` で起動。

### 自律起動

「スモークテスト入れて」「E2E書いて」「デモ壊れてないか確認したい」「ユニットテスト」などの発話で自動起動。

## やること

### 1. Playwright スモーク（スマホ / タブレット / PC）
- `pnpm add -D @playwright/test` + `pnpm exec playwright install --with-deps chromium`
- `playwright.config.ts` を生成。**mobile / tablet / desktop の 3 ビューポート**を projects に定義し、各デバイス幅でレイアウト破綻と主導線を回帰チェック (`webServer` で `pnpm dev` 起動、baseURL 設定)
- `e2e/smoke.spec.ts` に `@smoke` タグ付きで主要画面 + 主導線テスト ([references/playwright-smoke.md](./references/playwright-smoke.md))
- 確認幅は `design-review` / `shadcn-ui` の responsive と揃える

### 2. Vitest 最小ユニット
- `pnpm add -D vitest`
- `vitest.config.ts` を生成
- factory / util の最小テスト ([references/vitest-min.md](./references/vitest-min.md))

### 3. scripts 追加
```json
{
  "test:smoke": "playwright test --grep @smoke",
  "test:e2e": "playwright test",
  "test:unit": "vitest run"
}
```

## deploy-preflight との統合

`deploy-preflight` のチェック項目 9 が `pnpm test:smoke` を実行する。`smoke-test` 未導入なら項目 9 はスキップされ、導入が提案される。スモークが赤ならデプロイは致命停止。

## やってはいけないこと

- プロト段階で網羅率 (coverage %) を目標にしてデモ速度を落とす
- 外部 API / 実 AI / 実 Firebase に依存したスモーク (壊れやすい)。スモークはモックか起動確認に留める
- スモークに長いシナリオを詰め込む (主導線 1〜3 本に絞る)

## 周辺

- `deploy-preflight`: スモークをプレフライトに組み込む
- `mockdata-ja`: ユニットテスト対象の factory を提供
- `vercel-toolbar-loop`: 修正後にスモークで回帰確認
