# Playwright スモーク

「主要画面が開く・主導線がクリックできる」だけを最小で確認する。

## 導入

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

## playwright.config.ts（スマホ / タブレット / PC の 3 ビューポート）

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'mobile',  use: { ...devices['iPhone 14'] } },          // スマホ (~390)
    { name: 'tablet',  use: { ...devices['iPad (gen 7)'] } },        // タブレット (~810/768)
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },      // PC (1280+)
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

スモークは 3 プロジェクト全てで走り、**各デバイス幅でレイアウトが破綻せず主導線が通るか**を回帰チェックする。特定デバイスだけ流すなら `playwright test --project=mobile`。`design-review` の確認幅（スマホ 375/390/412・タブレット 768/834・PC 1280/1440）と揃える。

## e2e/smoke.spec.ts

`@smoke` タグを付けると `test:smoke` (`--grep @smoke`) で拾われる。

```ts
import { test, expect } from '@playwright/test'

test('@smoke トップが開く', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBeLessThan(400)
  await expect(page.locator('body')).toBeVisible()
})

test('@smoke 主要画面が開く', async ({ page }) => {
  for (const path of ['/dashboard', '/login']) {  // プロジェクトの主要ルートに合わせる
    const res = await page.goto(path)
    expect(res?.status(), `${path} が開けない`).toBeLessThan(400)
  }
})

test('@smoke 主導線: ログイン → ダッシュボード', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('メールアドレス').fill('demo@example.com')
  await page.getByLabel('パスワード').fill('demo-password')
  await page.getByRole('button', { name: 'ログイン' }).click()
  await expect(page).toHaveURL(/dashboard/)
})
```

## コツ

- ロケータは `getByRole` / `getByLabel` を優先 (実装変更に強い)
- 主導線は 1〜3 本に絞る。全網羅は狙わない
- 実 AI / 実 Firebase に繋がず、モックまたは起動確認に留める (壊れやすさを避ける)
- CI では `reuseExistingServer: false` で毎回クリーン起動

> Playwright の API は更新がある。実装時に最新ドキュメントで確認すること。
