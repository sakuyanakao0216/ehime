# フォーマットヘルパー実装（Intl ベース）

`lib/format.ts` に集約する。`Intl.*Format` インスタンスはモジュールスコープで 1 度だけ生成（毎回 new しない＝速い）。

```ts
// lib/format.ts
const LOCALE = 'ja-JP'
const TZ = 'Asia/Tokyo'

const jpy = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'JPY' })
const num = new Intl.NumberFormat(LOCALE)
const pct = new Intl.NumberFormat(LOCALE, { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 1 })
const dateLong = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeZone: TZ })
const dateTime = new Intl.DateTimeFormat(LOCALE, {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ,
})
const rel = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })

/** ¥1,234,567 */
export const formatJPY = (n: number) => jpy.format(n)

/** 1,234,567 */
export const formatNumber = (n: number) => num.format(n)

/** 0.123 → 12.3% （比率を渡す） */
export const formatPercent = (ratio: number) => pct.format(ratio)

/** 2026年6月4日 */
export const formatDate = (d: Date | number | string) => dateLong.format(new Date(d))

/** 2026/06/04 13:45 */
export const formatDateTime = (d: Date | number | string) => dateTime.format(new Date(d))

/** 3分前 / 2日後 （基準は now） */
export function formatRelative(d: Date | number | string, base: Date = new Date()) {
  const diffSec = (new Date(d).getTime() - base.getTime()) / 1000
  const table: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ]
  for (const [unit, sec] of table) {
    if (Math.abs(diffSec) >= sec || unit === 'second') {
      return rel.format(Math.round(diffSec / sec), unit)
    }
  }
  return ''
}
```

## 使用例

```tsx
import { formatJPY, formatDate, formatRelative } from '@/lib/format'

<td>{formatJPY(order.total)}</td>           {/* ¥12,800 */}
<span>{formatDate(order.createdAt)}</span>   {/* 2026年6月4日 */}
<time>{formatRelative(comment.postedAt)}</time> {/* 5分前 */}
```

## バリエーション

```ts
// 小数を抑えた金額（千円単位の概算など）
const jpyRound = new Intl.NumberFormat('ja-JP', {
  style: 'currency', currency: 'JPY', maximumFractionDigits: 0,
})

// コンパクト表記（1.2万 / 3.4億）
const compact = new Intl.NumberFormat('ja-JP', { notation: 'compact' })
export const formatCompact = (n: number) => compact.format(n)  // 12000 → 1.2万
```

## 注意

- **日付のみ**を表示するとき、`new Date('2026-06-04')` は UTC 解釈で 1 日ずれることがある。`timeZone: 'Asia/Tokyo'` 指定で吸収するか、日付は文字列のまま保持する設計にする
- `Intl` の出力は実行環境の ICU バージョンに依存して微差が出ることがある。スナップショットテスト（`smoke-test` の Vitest）で固定する場合は注意
- 和暦が要るなら `Intl.DateTimeFormat('ja-JP-u-ca-japanese', ...)`
