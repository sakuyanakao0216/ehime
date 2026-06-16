# shadcn/ui 公式 Block 早見

Block は複数コンポーネントを組んだ完成パーツ。`pnpm dlx shadcn@latest add <block-id>` で追加でき、プロトの初速が出る。

## Dashboard / Sidebar
| block | 内容 |
|---|---|
| `sidebar-01` 〜 `sidebar-16` | 様々な構成の sidebar + レイアウト一式。`sidebar-07` (collapsible icon) が汎用的 |
| `dashboard-01` | sidebar + ヘッダ + カード + チャート + テーブルの一式 |

ダッシュボードは `dashboard-01` を入れて中身を差し替えるのが最速。

## 認証
| block | 内容 |
|---|---|
| `login-01` 〜 `login-05` | card ベースのログイン。`login-03` (画面分割) はピッチ映えする |

`firebase-backend` の Auth と組むと実際にログインできる画面になる。

## 使い方の指針

- **まず block で骨格、次に個別コンポーネントで調整**。ゼロから積むより速い
- block は `app/` にページ、`components/` にパーツを生成する。生成後はファイル構成を確認
- block 追加で入った `components/ui/*` は直接編集せず派生で
- 利用可能な block ID は更新される。最新は shadcn/ui 公式の Blocks ページで確認すること

## 典型の組み合わせ

| 作りたいもの | block + 追加 |
|---|---|
| 管理ダッシュボード | `dashboard-01` + `data-table` 差し替え |
| SaaS ログイン | `login-03` + `firebase-backend` の Auth 配線 |
| 設定画面 | `sidebar-07` + `tabs` + `form` ([patterns.md](./patterns.md)) |

詳しい組み合わせは [patterns.md](./patterns.md)、個別部品は [components.md](./components.md)。
