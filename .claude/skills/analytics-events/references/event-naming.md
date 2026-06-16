# イベント命名規則

## 規則

- **snake_case**、動詞 or 名詞_動詞: `sign_up` / `item_create` / `share`
- 一貫した時制（過去形か原形か）をプロジェクトで統一。GA4 慣習は原形（`sign_up`）
- プロパティも snake_case: `method`, `item_type`, `channel`
- 予約イベント（GA4 の `page_view` 等）と衝突しない命名

## 標準イベント（プロト頻出）

| イベント | 意味 | 主要プロパティ |
|---|---|---|
| `page_view` | 画面表示 | path |
| `sign_up` / `login` | 登録 / ログイン | method |
| `<entity>_create` / `_update` / `_delete` | CRUD | entity_id(ハッシュ), type |
| `search` | 検索 | query_len（生クエリは入れない） |
| `share` | 共有 | channel |
| `error_shown` | エラー表示 | code, screen |

## プロパティ設計

- 値は**低カーディナリティ**を優先（enum 的）。自由文・ID 生値は避ける
- 個人を特定できる値は入れない（[privacy-check] と連携）。ユーザー識別は匿名 ID
- 金額は数値そのまま（表示整形は format-ja、計測は raw）

## ドキュメント化

`docs/analytics/events.md` のイベント表を**正**とし、実装は必ずそこから。新規イベント追加時は表を更新。

> GA4 / 各 SDK の予約語・制限（イベント数/プロパティ数）は更新される。実装時に最新を確認すること。
