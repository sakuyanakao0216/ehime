---
name: api-contract
description: API の入出力仕様を設計するスキル。「API仕様」「APIコントラクト」「エンドポイント設計」「Route Handler の仕様」「Server Action の入出力」「リクエスト/レスポンス定義」「I/Oスキーマ」「api-contract」などのキーワードでトリガする。app-flow-designer / data-modeler を入力に、Route Handler / Server Action / Cloud Functions / 外部API連携 の メソッド・パス・入力(zod)・出力・エラー・認証要否 を docs/design/api-contract.md に定義する。これは設計であり、実装パターンは project-scaffold の api-patterns、AI 系は ai-feature、DB/Admin 系は firebase-backend が担う。型は data-modeler と共有する。
allowed-tools: [Bash, Read, Write, Edit]
---

# api-contract

## このスキルが解決すること

フロント実装とサーバー実装が別々に進むと、入出力の食い違いで手戻りする。**API の契約**（入出力・エラー・認証）を先に固め、両者の共通の正にする。

1. **エンドポイント定義**: メソッド / パス / 認証要否
2. **I/O スキーマ**: 入力・出力を zod で（型は data-modeler と共有）
3. **エラー契約**: ステータスとエラー形

## 起動方法

### slash command
`/api-contract [route|action|function|external]` で起動。

### 自律起動
「API仕様を定義」「このエンドポイントの入出力」「外部API連携の仕様」などで自動起動。

## 出力（docs/design/api-contract.md）

```markdown
### POST /api/orders  （認証: 必要 / role: member）
- 入力 (zod): { items: {productId: string, qty: number}[] }
- 出力: { id: string, total: number, status: '申請中' }
- エラー: 400 入力不正 / 401 未認証 / 403 権限なし / 413 入力過大
```

テンプレは [references/contract-template.md](./references/contract-template.md)。

## 設計 vs 実装の分離

| 役割 | 担当 |
|---|---|
| **契約**（I/O・エラー・認証） | このスキル（api-contract） |
| 実装パターン（Route Handler/Server Action） | `project-scaffold` の api-patterns |
| AI エンドポイント実装 | `ai-feature` |
| DB/Admin/Webhook 実装 | `firebase-backend` |

## やってはいけないこと

- 入力検証（zod 等）を契約に書かず実装任せにする
- エラー時の形（ステータス/ボディ）を未定義のままにする
- 認証/権限要否を曖昧にする（`auth-rules` と必ず整合）
- AI/ユーザー入力系で入力長上限を契約に書かない（`ai-feature` のセキュリティと整合）

## 周辺

- `data-modeler`: I/O の型の源
- `app-flow-designer`: どの操作がどの API を呼ぶか
- `project-scaffold`(api-patterns) / `ai-feature` / `firebase-backend`: 契約の実装側
