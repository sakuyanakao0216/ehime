# Firestore モデリング（設計）

読み取りパターン駆動で設計する。RDB の正規化をそのまま持ち込まない。実装は `firebase-backend/references/firestore-patterns.md`。

## 設計の出力例（docs/design/data-model.md 内）

```markdown
## コレクション
### users/{userId}
| field | 型 | 必須 | 説明 |
|---|---|---|---|
| name | string | ✓ | 表示名 |
| email | string | ✓ | ログイン |
| role | 'admin' \| 'member' | ✓ | 権限（auth-rules と対応） |
| createdAt | Timestamp | ✓ | 作成 |

### orders/{orderId}
| field | 型 | 必須 | 説明 |
|---|---|---|---|
| customerId | string (ref users) | ✓ | 名寄せ ID |
| total | number | ✓ | 金額（format-ja で表示整形） |
| status | '下書き'\|'申請中'\|'承認済' | ✓ | 状態（app-flow の状態遷移と対応） |
| createdAt | Timestamp | ✓ | |
```

## 設計判断

- **非正規化**: 一覧で必要なフィールドはドキュメントに持つ（join しない）
- **サブコレクション**: 親に対し件数が多く、親単体で読みたいとき（`orders/{id}/items`）
- **参照 ID**: `customerId` のような ID で名寄せ（mockdata-ja の ID 一貫性ルールと揃える）
- **インデックス**: 複合クエリ（where + orderBy）には複合インデックスが要る → 設計段階で洗い出す
- **状態 enum**: app-flow の状態遷移の状態名と一致させる

## 型へ

```ts
// lib/types/order.ts （mockdata-ja / firebase-backend と共有）
export type OrderStatus = '下書き' | '申請中' | '承認済'
export interface Order {
  id: string
  customerId: string
  total: number
  status: OrderStatus
  createdAt: Date
}
```

> Firestore の制約（インデックス・クエリ・1MB/doc）は更新がある。実装時に最新ドキュメントで確認すること。
