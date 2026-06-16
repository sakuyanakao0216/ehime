# Secrets — {{PROJECT_NAME}}

トークン・API キーの管理方針。**1 つも repo に commit しない**を絶対ルールにする。

## 種類と置き場所

| 種類 | 置き場所 |
|---|---|
| ローカル開発用 | `.env.local` (gitignore 済み) |
| Vercel Preview / Production | Vercel Project Settings → Environment Variables |
| AI assistant session 用 | claude.ai/code の Secrets / `gh secret set` |
| MCP server 認証 (例: GITHUB_TOKEN) | `.mcp.json` には **`${GITHUB_TOKEN}` プレースホルダのみ**書き、値は環境変数 |

## GITHUB_TOKEN の最小スコープ

このリポジトリで MCP / Auto-fix を使う場合の必要スコープ:

- `repo` — Private repo に触る場合
- `read:org` — Team membership 確認
- `workflow` — Actions の trigger 用

期限は **90 日**を上限に設定。期限切れ前に `gh auth refresh` か新規発行。

## Vercel env

- `Production` / `Preview` / `Development` を分けて登録
- センシティブな値は **Sensitive** チェックを入れる (一度入力すると後で値を読み戻せない)
- 取得: `vercel env pull` で `.env.local` に同期 (Production の値は `--environment=production` で別途)

## やってはいけないこと

- `.env*` を `git add` する (`.gitignore` で予防)
- Slack / GitHub Issue に値を貼る
- AI assistant への入力に生トークンを貼る (プレースホルダで参照させる)
- 共有 PC の `~/.bash_history` / `~/.zsh_history` に残るような `export TOKEN=xxx` の打ち方

## 漏れた時の対応

1. **即座にトークン revoke** (GitHub: Settings → Developer settings → Tokens)
2. 漏洩経路を特定 (commit / log / Slack / スクショ)
3. git 履歴に入った場合は `BFG` or `git filter-repo` で**履歴ごと削除** + force-push
4. 影響範囲を関係者に共有 (隠さない)
