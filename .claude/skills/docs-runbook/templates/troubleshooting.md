# Troubleshooting — {{PROJECT_NAME}}

既知のハマりどころと回復手順。**まず `/doctor` を走らせる**と多くの settings 問題は自動検出される。

## 症状別 切り分け

### A. `.claude/settings.json` の Plugin / hook / permission が**何故か効かない**

トースト「Settings file failed to parse」が出る、または出ないが挙動が変。

→ **`/doctor` を実行**。`settings-doctor` Plugin が以下を自動検出:

- `$schema` 値の不一致 (`https://json.schemastore.org/claude-code-settings.json` のみ OK)
- `hooks` の 2 段ネスト崩れ (`command` を直書きしている)
- `extraKnownMarketplaces.<id>.source` を文字列で書いている

### B. Vercel Toolbar コメント → 自動修正が動かない

| 症状 | 原因 / 確認 |
|---|---|
| claude.ai/code の CIモニタリングに何も出ない | **Draft PR が未作成**。branch push だけでは発火しない |
| PR の Checks に Vercel Preview Comments が出ない | Vercel project 未作成 / Production Branch 設定間違い |
| Preview Comments が green のまま | Toolbar コメントが投稿されていない or 同期遅延 (1-2 分待つ) |
| Preview Comments が red になるが session が動かない | claude.ai/code で repo の session 未作成 / CIモニタリング のトグルが OFF |
| session 起動するが「Vercel MCP に繋がっていない」 | OAuth 未完了 (`/mcp` で `vercel` の行を Authenticate) |

### C. Vercel MCP OAuth で "Host not in allowlist"

組織アカウントの SSO 環境で発生。代替策:

1. **CLI に切り替える** — `localhost:<port>/callback` は許可済み、組織承認不要
2. **Toolbar コメント本文を手動コピペ** — Web session に貼って「直して」と依頼
3. **組織の OAuth 連携承認**を情報システム部門に申請

個人 Hobby アカウントでは発生しない (実機検証済)。

### D. `pnpm dev` で `localhost:3000` が起動しない

```bash
# (1) port 競合確認
lsof -ti:3000 | xargs -r kill -9

# (2) node version 確認
node -v   # {{NODE_VERSION}} 以上である必要

# (3) lockfile mismatch
rm -rf node_modules
{{PACKAGE_MANAGER}} install --frozen-lockfile
```

### E. Vercel build が通らない

```
> next build
> Failed to compile.
```

- 型エラー: `next.config.mjs` の `typescript.ignoreBuildErrors: true` でプロト期間は回避可。本番前に必ず外す
- 依存欠落: `package.json` に追加したが `pnpm install` し直していない
- 環境変数: Vercel Project Settings に Production / Preview env が登録されているか

## それでも解決しない場合

1. `git log --oneline -20` で直前の変更を確認
2. 動いていた最後の commit に `git switch --detach <sha>` で戻して再現
3. 差分を二分探索
4. それでも分からなければ issue を立てる (タイトルに症状、本文に再現手順 + 環境 + 切り分け済み事項)
