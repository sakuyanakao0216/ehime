# Vercel MCP OAuth — "Host not in allowlist" 対策

Vercel MCP server (`https://mcp.vercel.com`) を Claude Code セッションから使うときの OAuth フローで詰まるケース。原因と回避策。

## 症状

`/mcp` で `vercel` を Authenticate しようとすると:

```
Host not in allowlist
```

エラーが出て OAuth が完了しない。

## 発生条件

- **組織アカウントの SSO 環境**で発生しやすい
- Claude Code **Web (claude.ai/code)** の sandbox host が Vercel 側の OAuth 許可リストに含まれていないため
- 個人 Hobby アカウントでは発生しない (実機検証 2026-05 で確認済)

## 回避策 (4 つ)

### (A) CLI に切り替える (最速)

```bash
claude mcp add --transport http vercel https://mcp.vercel.com --scope project
```

CLI の OAuth callback は `localhost:<port>/callback` で、これは Vercel が許可済み。組織承認不要で動く。

### (B) VS Code 拡張で OAuth → CLI と共有

VS Code 拡張 (ローカル) で OAuth 完了 → トークンは `~/.claude/.credentials.json` (macOS では Keychain に保存される場合あり) に保存され、**ローカルの CLI と VS Code 拡張の間で共有**される。片方で OAuth すれば両方で使える。
**Web (claude.ai/code) は対象外**: Web はリモート sandbox で実行されるため、ローカルの credentials を参照できない ([ai-gateway-reachability.md](./ai-gateway-reachability.md) と同じ到達性の制約)。Web で詰まる場合は (A)/(C)/(D) を使う。

### (C) Toolbar コメント本文を手動コピペ

Vercel MCP 未接続のまま運用するパターン:
- Toolbar の 💬 アイコンを開いて本文をコピー
- Web session に貼り付けて「この内容で `/toolbar-pull` を実行して」と依頼
- 修正後の resolve は Toolbar 上で人間がクリック

### (D) 組織の OAuth 連携承認を申請

情報システム部門 (or Vercel admin) に Claude Code Web の host を allowlist に追加してもらう。
時間はかかるが、承認後は完全自動化に戻れる。

## 切り分け手順

```
Web session 起動
  ↓
/mcp 実行
  ↓
vercel の行が ✗ → Authenticate ボタン押下
  ↓
ブラウザで OAuth 画面 → ?
  ├─ "Host not in allowlist" → (A)/(B)/(D) のいずれか
  ├─ "Authorize" ボタン押せた → 通常完了
  └─ ブラウザが開かない → ポップアップブロッカー / VPN を確認
```

## 関連

- [docs/comparison/surfaces.md](../comparison/surfaces.md) — サーフェス選択の文脈
- [docs/runbooks/auto-fix-conditions.md](./auto-fix-conditions.md) — Auto-fix の発火条件
