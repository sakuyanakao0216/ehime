# サーフェス比較 — App / Web / CLI / IDE 拡張 / Antigravity

このテンプレと Marketplace は **Claude Code / Codex / Antigravity** いずれのサーフェスでも動くことを前提に設計しています。本ドキュメントは「どのサーフェスを、どの利用シーンで使うか」を整理するものです。

## 設計の上位軸

```
┌─────────────────────────────────────────────────────────────┐
│                       簡単修正 (Easy)                        │
│   ─ チャットで「ここ直して」 / Toolbar コメント 1 件          │
│   ─ Auto-fix で自動回収を狙う                                │
│   ─ メイン: Claude Code App / Web、Codex App / Web           │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      詳細修正 (Detail)                       │
│   ─ マルチファイル / リファクタ / 設計変更                   │
│   ─ ローカルで build / breakpoint / grep を併用              │
│   ─ メイン: VS Code 拡張 (Claude / Codex)、Antigravity       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                       自動化 (Automation)                    │
│   ─ CI / cron / shell script から呼ぶ                        │
│   ─ メイン: Claude Code CLI、Codex CLI                       │
└─────────────────────────────────────────────────────────────┘
```

## Use Case × Surface マトリクス

| 利用シーン | メイン (推奨) | 補助 (使い分け) |
|---|---|---|
| **簡単修正** (チャット 1 往復 / Toolbar コメント) | Claude Code App / Web、Codex App / Web | スマホ・出先・非開発者がレビューフィードバックを出すとき |
| **詳細修正** (マルチファイル / リファクタ / 設計変更) | VS Code 拡張 (Claude / Codex)、Antigravity | エディタ操作と並行、breakpoint や grep を使いたいとき |
| **自動化 / バッチ / CI** | Claude Code CLI / Codex CLI | shell script、`gh workflow`、cron から呼ぶとき |
| **設定 / トラブルシュート** | CLI (`/doctor`, `/mcp` 等) | どのサーフェスでも実行可能だが CLI が最速 |

## 機能対応マトリクス

|機能 | Claude Web | Claude App | Claude CLI | Claude VSCode | Codex Web | Codex App | Codex CLI | Codex VSCode | Antigravity |
|---|---|---|---|---|---|---|---|---|---|
| Plugin Marketplace 参照 | ✅ | ✅ | ✅ | ✅ | n/a (Skills 直配布) | n/a | n/a | n/a | plugins (独自) |
| Skill 自律起動 | ✅ | ✅ | ✅ | ✅ | ✅ (`/skills` / `$`) | ✅ | ✅ | ✅ | ✅ |
| Slash commands | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| MCP server 接続 | ✅ | ✅ | ✅ | ✅ | 一部 | 一部 | 一部 | 一部 | Extensions |
| Vercel Toolbar **自動**修正 (Auto-fix) | **✅ (唯一)** | ❌ | ❌ (手動 loop) | ❌ (手動 loop) | ❌ | ❌ | ❌ (手動 loop) | ❌ (手動 loop) | ❌ (手動 loop) |
| ローカル `pnpm dev` | ❌ (Vercel Preview で代替) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| OAuth (Vercel MCP) | △ "Host not in allowlist" の組織承認制限あり | ✅ | ✅ localhost callback | ✅ | △ | ✅ | ✅ | ✅ | ✅ |
| ハウスルール参照ファイル | CLAUDE.md | CLAUDE.md | CLAUDE.md | CLAUDE.md | AGENTS.md | AGENTS.md | AGENTS.md | AGENTS.md | AGENTS.md |
| 引き継ぎ容易性 (Session 共有) | ✅ URL で共有可 | △ | △ | △ | ✅ | △ | △ | △ | ✅ |

**重要観点**: Vercel Toolbar コメントを起点にした **完全自動ループ**が動くのは **Claude Web** だけ。それ以外のサーフェスは「人が起動する手動 loop」になる。これが「簡単修正は App / Web」を実装上裏付ける最大のポイント。

## 選び方ガイド

### 「Vercel Preview の Toolbar コメントが付いた、放っておいて直してほしい」

→ **Claude Web (claude.ai/code)** を選ぶ。CIモニタリング パネルの「CIを自動修正してコメントに対応」を ON にしておけば、`Preview Comments` check の failure を検知して自動再開する (Draft PR が必須)。詳細: [docs/runbooks/auto-fix-conditions.md](../runbooks/auto-fix-conditions.md)。

### 「スマホで Preview を見ながら "ここ色変えて" と指示したい」

→ **Claude App** (Mac / Win Desktop または iOS / Android) を使う。チャットの 1 往復で修正を依頼し、commit & push まで指示できる。デスクトップ App は MCP も使える。

### 「複数ファイルを跨いだリファクタを慎重に進めたい」

→ **VS Code 拡張 (Claude or Codex)** を使う。差分プレビュー、grep、breakpoint と並行で AI に依頼でき、`Cmd+Z` で巻き戻しやすい。

### 「設計変更を観察可能な状態で進めたい (multi-agent / multi-workspace)」

→ **Antigravity Desktop**。複数 agent を並行起動し、workspace ごとに別 repo を見せられる。Subagents / Hooks で大きなリファクタを段階的に進めるのに向く。

### 「CI で毎日 build + smoke test + 失敗時に自動修正したい」

→ **Claude Code CLI** または **Codex CLI** を GitHub Actions / cron から起動。`claude --print` / `codex exec` の non-interactive mode で。

### 「設定がおかしい / Plugin が効かない」

→ どのサーフェスでも `/doctor` を叩く (`settings-doctor` Plugin)。CLI が最速だが、結果はサーフェス共通の `.claude/settings.json` を読む。

## サーフェスを跨いだ運用パターン

ありがちな組み合わせ:

1. **「Web 主軸 + CLI 補助」**: 普段は Web で Auto-fix loop。込み入った調査だけ CLI に降りる
2. **「VS Code 主軸 + App 補助」**: 開発作業は VS Code、レビュー時のフィードバックを App で投げる
3. **「Codex CLI + Claude Web」**: Codex で書く / Claude Web で Toolbar コメント対応 (Auto-fix が Claude のみのため)
4. **「Antigravity + CLI」**: 複雑な multi-agent 設計を Antigravity で組み、定型化したら CLI に落とす

## サーフェスを跨ぐとき気をつけること

- `.claude/settings.json` / `.mcp.json` / `CLAUDE.md` / `AGENTS.md` は **すべてのサーフェス共通**。1 箇所変えると全サーフェスに波及する
- ローカル CLI と VS Code 拡張は `~/.claude/.credentials.json` (macOS では Keychain の場合あり) を共有する。片方で OAuth すれば両方使える
- Web セッションは **`.mcp.json` を commit した後**に新規作成しないと反映されない
- MCP の Vercel OAuth は組織アカウントだと Web が `Host not in allowlist` で詰まることがある。CLI なら詰まらない
- Codex を併用する場合、**ハウスルールは AGENTS.md で読まれる**ので CLAUDE.md と内容を同期する (このテンプレでは両方同梱)

## 参照

- [docs/runbooks/](../runbooks/) — Auto-fix の発火条件、`.claude/settings.json` の落とし穴
- [adapters/codex/](../../_adapters/codex/) — Claude SKILL.md → Codex Skills の片方向変換アダプタ
- [adapters/antigravity/](../../_adapters/antigravity/) — Antigravity Agent Skills への変換アダプタ (実装済み・仕様確定: Agent Skills 標準準拠、`.agents/skills/` へ出力)
