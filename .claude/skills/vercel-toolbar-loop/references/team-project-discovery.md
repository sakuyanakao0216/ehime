# Team / Project の特定（Vercel MCP）

Toolbar コメントを取得するには、対象の `orgId`(team) と `projectId` が要る。`.vercel/project.json` があればそれが正。無いときの探索手順。

## 優先順位

1. **`.vercel/project.json` を Read**（`vercel link` 済みなら存在）
   ```json
   { "orgId": "team_xxx", "projectId": "prj_xxx" }
   ```
   これがあれば探索不要。

2. **無ければ MCP で探索**
   - `list_teams` → team 一覧。1 つなら確定、複数ならユーザーに確認
   - `list_projects(teamId)` → project 一覧
   - リポジトリ名 / `package.json` の `name` と project 名を突き合わせて推定
   - 複数候補が残るときは推測で進めず**ユーザーに確認**

3. **確定後**: 以降の `list_toolbar_threads` / `get_toolbar_thread` 等に `teamId` / `projectId` を渡す

## 取り違え防止

- 複数 team / 複数 project に同名がある環境では、推測で進めない
- 確定した `orgId` / `projectId` は、可能なら `vercel link` を促して `.vercel/project.json` に固定する（次回から探索不要）
- Preview デプロイのコメントは特定の deployment に紐づく。対象ブランチ / URL が合っているか確認

## 関連

- コメントの分類は [comment-categories.md](./comment-categories.md)
- MCP ツール名は Vercel MCP の更新で変わりうる。最新のツール一覧で確認すること
