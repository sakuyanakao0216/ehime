---
name: vercel-toolbar-loop
description: Vercel Preview URL 上の Toolbar コメント (💬) を起点に、Vercel MCP でコメントを取得し、コメントに紐付いた React コンポーネントを `context.selector` / `context.path` / `frameworkContext` から特定し、視覚的修正 (色・余白等) / 文言修正 / 機能追加要望 / バグ報告 に分類して、自動修正可能なものは差分提示・承認後に commit/push して `change_toolbar_thread_resolve_status(resolved: true)` でスレッドを解決済みにする一連のループ。「Toolbar コメント直して」「Vercel フィードバック反映」「/toolbar-pull」「プレビューデプロイのコメント対応」「Toolbar スレッド処理」などのキーワードでトリガする。Claude Web では CIモニタリングの Auto-fix から自動再開して起動されるが、他サーフェス (CLI / VS Code / Codex 全般) では手動起動になる。
---

# vercel-toolbar-loop

## このスキルが解決すること

Vercel Preview の Toolbar コメント (💬) は便利だが、放っておくと溜まる。手動で対応するなら:
- コメント本文をブラウザで読む
- 該当箇所をコードベースから探す
- 修正して commit / push
- Toolbar に戻ってスレッドを resolved にマーク

を 1 コメントごとに繰り返す。このスキルは Vercel MCP の 6 ツール (`list_toolbar_threads` / `get_toolbar_thread` / `reply_to_toolbar_thread` / `edit_toolbar_message` / `add_toolbar_reaction` / `change_toolbar_thread_resolve_status`) を使って一気通貫で処理する。

## サーフェス別の起動方式

| サーフェス | 起動方式 |
|---|---|
| **Claude Web** | CIモニタリングの Auto-fix が `Preview Comments` check の failure を検知し session を自動再起動 → このスキルが起動 (Draft PR 必須) |
| Claude App / CLI / VS Code | 「Toolbar 直して」「`/toolbar-pull`」発話で **手動起動** |
| Codex 全般 | 「Toolbar 直して」「`/toolbar-pull`」発話で **手動起動** (Vercel MCP は Codex でも接続可能) |

Auto-fix の発火条件詳細: [docs/runbooks/auto-fix-conditions.md](../_docs/runbooks/auto-fix-conditions.md)

## 起動方法

### slash command

`/toolbar-pull` で起動。

### 自律起動

「Toolbar 直して」「Vercel コメント対応」「プレビューのフィードバック反映」など。

## 前提

Vercel MCP が接続済みであること。確認方法:
1. `/mcp` で `vercel` の行が `✓ Connected`
2. または system context に `mcp__<uuid>__list_toolbar_threads` 等の約 19 ツールが存在

未接続なら「Vercel MCP の OAuth が必要」と通知し、`/mcp` で Authenticate を促す (CLI なら通る、Web で組織アカウントだと "Host not in allowlist" のことがある — [docs/runbooks/vercel-mcp-oauth.md](../_docs/runbooks/vercel-mcp-oauth.md))。

## 手順

1. `.vercel/project.json` を Read → `orgId` / `projectId` を取得
2. なければ `list_teams` → `list_projects` で取得 (`references/team-project-discovery.md` 参照)
3. `list_toolbar_threads(status: "unresolved")` で未解決コメント一覧
4. 各 thread を `get_toolbar_thread(threadId)` で詳細取得
5. コメント内の `context.selector` / `context.path` / `frameworkContext` から対象を特定
   - `context.path` (例: `/dashboard`) → ファイルパス候補を `app/`, `components/` から探索
   - `context.selector` (CSS selector) → 該当 JSX 要素を grep で絞り込み
   - `frameworkContext.componentName` → コンポーネント名から `components/<name>.tsx` を読み込み
6. コメント本文を **4 分類** ([references/comment-categories.md](./references/comment-categories.md)):
   - 視覚的修正 (色・余白・タイポ) — 自動修正可
   - 文言修正 — 自動修正可
   - 機能追加要望 — 別タスクに分割提案 (即修正は提案しない)
   - バグ報告 — 再現を確認したうえで修正
7. 自動修正可のものは Edit で差分を作り、ユーザに提示
8. 承認後:
   - `git add` / `git commit -m "fix: <thread title>"` / `git push`
   - `change_toolbar_thread_resolve_status(threadId, resolved: true)` でスレッドを解決済みに
   - 任意で `reply_to_toolbar_thread(threadId, "対応しました: <commit sha>")` で返信
9. 別タスクに分割したものはユーザに整理して提示し、Issue 化を提案

## 失敗時のリカバリ

- MCP 未接続: 「Toolbar コメントの本文を貼ってください」と促す手動モードに降りる
- コンポーネント特定失敗: 候補ファイルを 3 件挙げて「どこですか」とユーザに聞く
- commit/push 失敗: pre-commit hook のエラーを表示してユーザに修正を委ねる (--no-verify は使わない)

## 周辺 Plugin / 参考

- `deploy-preflight`: Toolbar 対応後にデプロイ前チェック
- `design-review`: 視覚的コメントの修正後にデザイン品質を 8 軸で再評価
- [docs/runbooks/auto-fix-conditions.md](../_docs/runbooks/auto-fix-conditions.md)
- [docs/runbooks/vercel-mcp-oauth.md](../_docs/runbooks/vercel-mcp-oauth.md)
