# API コントラクト テンプレート

`docs/design/api-contract.md` の雛形。型は `data-modeler` の型を参照する。

```markdown
# API Contract

## エンドポイント一覧
| メソッド | パス | 認証 | role | 概要 |
|---|---|---|---|---|
| GET | /api/orders | 必要 | member | 自分の注文一覧 |
| POST | /api/orders | 必要 | member | 注文作成 |
| POST | /api/webhook/stripe | 署名検証 | — | 決済 Webhook |

## 詳細

### POST /api/orders
- 認証: 必要（401 if 未認証）、role: member
- 入力 (zod):
  ```ts
  z.object({
    items: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })).min(1),
  })
  ```
- 出力 (200): `{ id: string, total: number, status: '申請中' }`
- エラー:
  | status | 条件 |
  |---|---|
  | 400 | 入力スキーマ不正 |
  | 401 | 未認証 |
  | 403 | 権限なし（auth-rules） |
  | 413 | 入力過大（AI/長文系。ai-feature と整合） |
```

## 指針

- 入力は必ず zod スキーマで（実装で `safeParse` → 400）
- 出力は data-modeler の型のサブセットで明示
- エラーは「ステータス + 機械可読な code + 人間向け message」を基本形に
- 外部 API 連携は「呼び先 / 認証 / タイムアウト / リトライ / 失敗時の振る舞い」を書く
- 重い/長時間の処理は同期 API にせず T3(GCP) へ（[backend-strategy](../../_docs/comparison/backend-strategy.md)）

> Next.js / 各 SDK の API は更新がある。実装時に最新ドキュメントで確認すること。
