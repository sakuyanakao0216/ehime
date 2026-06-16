# Vitest 最小ユニット

壊れると痛い純関数 (金額計算・日付・factory・バリデーション) だけ薄く守る。

## 導入

```bash
pnpm add -D vitest
```

## vitest.config.ts

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
  resolve: {
    alias: { '@': new URL('./', import.meta.url).pathname },
  },
})
```

## 例: mockdata-ja の factory を検証

```ts
// lib/mock/ec/factories.test.ts
import { describe, it, expect } from 'vitest'
import { makeOrder } from './factories'

describe('makeOrder', () => {
  it('必須フィールドが埋まる', () => {
    const o = makeOrder()
    expect(o.id).toBeTruthy()
    expect(o.total).toBeGreaterThanOrEqual(0)
    expect(o.customerId).toMatch(/^cust_/)
  })

  it('seed 指定で再現性がある', () => {
    expect(makeOrder({ seed: 1 })).toEqual(makeOrder({ seed: 1 }))
  })
})
```

## 例: 金額・税計算など純関数

```ts
// lib/pricing.test.ts
import { describe, it, expect } from 'vitest'
import { withTax } from './pricing'

describe('withTax', () => {
  it('10% を加算して丸める', () => {
    expect(withTax(100)).toBe(110)
    expect(withTax(199)).toBe(219)  // 218.9 → 四捨五入
  })
})
```

## 何をテストし、何をしないか

- ✅ 金額・日付・ID・バリデーション・factory の純関数
- ✅ 構造化抽出 (`ai-feature` の zod schema) のパース
- ❌ React コンポーネントの描画詳細 (プロトでは変化が速すぎる)
- ❌ 実 AI / 実 Firebase 呼び出し (E2E スモークでも繋がない)

> Vitest の API は更新がある。実装時に最新ドキュメントで確認すること。
