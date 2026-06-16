# Auto-fix の発火条件

Vercel Toolbar コメントから自動修正が走る条件は **Claude Web 限定**。他サーフェスは「人が起動する手動 loop」になる。本書は Web の Auto-fix が動く/動かない条件と切り分けを記す。

## Auto-fix が動く条件 (全部必要)

1. 作業 branch を **push 済**で **Vercel Preview Deploy** が生成されている
2. その branch を compare とする **Draft (or Ready) PR が存在する**
3. claude.ai/code で **その PR (= その branch) に紐づく session** が作成済み
4. session の **CIモニタリングパネル**で「**CIを自動修正してコメントに対応**」チェックボックスが ON
5. Vercel Project Settings → **Toolbar → Pre-Production Deployments が Enabled**

> Auto-fix トグルの実体は **claude.ai/code セッション画面右上の CIモニタリング パネル内**。GitHub PR の CI ステータスバーには無い (混乱しやすいポイント)。

## 発火フロー

```
Vercel Preview URL の 💬 にコメント (人間)
  ↓
Vercel bot が PR に "💬 N unresolved" check comment を投稿
  ↓
"Preview Comments" check が failure に
  ↓
claude.ai/code の CIモニタリング が検知 → 該当 session を自動再起動
  ↓
vercel-toolbar-loop スキルが起動
  ↓
list_toolbar_threads で取得 → context.selector / frameworkContext から対象特定
  ↓
修正案提示 → 承認後 commit & push
  ↓
change_toolbar_thread_resolve_status でスレッドを resolved に
```

## 症状別 切り分け表

| 症状 | 原因候補 | 確認 |
|---|---|---|
| CIモニタリングパネルに何も表示されない | **Draft PR が未作成** | branch push 後に `gh pr create --draft` |
| PR の Checks に Vercel Preview Comments が出ない | Vercel project 未作成 / Production Branch 設定間違い | Vercel Dashboard → Settings |
| Preview Comments が green のまま | Toolbar コメントが未投稿 or 同期遅延 | 1-2 分待って再確認 |
| Preview Comments が red になるが session が動かない | session 未作成 / CIモニタリング トグル OFF | claude.ai/code でこの repo+branch の session を作成 |
| session 起動するが「Vercel MCP に繋がってない」と言う | OAuth 未完了 | `/mcp` で `vercel` の行を Authenticate |
| Plugin / hook が効かない | `.claude/settings.json` の parse 失敗 | `/doctor` を実行 |

## サーフェス別: Auto-fix の代替

| サーフェス | Auto-fix | 代替の loop |
|---|---|---|
| **Claude Web** | ✅ | (これが本流) |
| Claude App / CLI / VS Code | ❌ | `/toolbar-pull` を**手動で発話** |
| Codex 全般 | ❌ | `/toolbar-pull` を**手動で発話** (Vercel MCP は Codex でも接続可) |
| Antigravity | ❌ | 手動 or 独自 hook で polling |

## 「過去の push に遡って反応しない」点

Auto-fix は **その瞬間に発生した failure イベント**にしか反応しない。設定を整えた**後**に新しい push (新しい Preview Deploy) が起きてからの failure に対して動く。設定だけして「過去のコメントを片付けてほしい」というつもりでも動かない — その場合は手動で `/toolbar-pull` を発話する。

## Draft PR の必要性 (整理)

| 用途 | Draft PR |
|---|---|
| `vercel-toolbar-loop` を**手動**起動するだけ | **不要** (branch が Preview Deploy を持っていれば OK) |
| Claude Web の Auto-fix で**自動**起動 | **必須** (Draft でも可、Ready でも可) |

## 関連

- [docs/runbooks/vercel-mcp-oauth.md](./vercel-mcp-oauth.md) — "Host not in allowlist" 対策
- [plugins/vercel-toolbar-loop/](../../vercel-toolbar-loop/) — このループを実装する Plugin 本体
- [docs/comparison/surfaces.md](../comparison/surfaces.md) — Web 以外のサーフェスでの代替フロー
