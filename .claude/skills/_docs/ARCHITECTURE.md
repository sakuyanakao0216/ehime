# vercel-aiagent-coding-skill — Architecture

このリポジトリは **Claude Code Plugin Marketplace `vercel-aiagent-coding-skill`** の本体。Vercel Toolbar コメント駆動で自動修正が回るマルチ IDE 戦略 (Claude / Codex / Antigravity) を取る。

## 全体像

```
vercel-aiagent-coding-skill/                    ← この repo
├── .claude-plugin/marketplace.json   ← Marketplace 定義 (単一ソース)
├── plugins/<name>/                   ← 各 Plugin (Claude フォーマットを正)
│   ├── .claude-plugin/plugin.json    ← Plugin メタデータ
│   ├── skills/<スキル名>/SKILL.md    ← スキル本体
│   ├── commands/                     ← slash command 定義
│   ├── hooks/                        ← hook 定義 (例: deploy-preflight の push ガード)
│   └── references/                   ← スキルが参照する詳細資料
├── adapters/codex/                   ← SKILL.md → Codex Skills 変換
├── adapters/antigravity/             ← SKILL.md → Antigravity 変換 (暫定プロト実装済み、仕様確定待ち)
└── docs/                             ← マニュアル / ランブック / 比較表 / 規約 (conventions)

vercel-aiagent-coding-skill-starter/                            ← 別 repo (コピペ起動テンプレ)
└── .claude/settings.json で vercel-aiagent-coding-skill を参照
    https://github.com/dentsu-fde/vercel-aiagent-coding-skill-starter
```

## 設計原則

1. **Claude フォーマットを正とする** — Codex/Antigravity は adapter で変換 (片方向)
2. **Marketplace と Template を repo 分離** — Marketplace は変更が頻繁、Template は安定が必要
3. **既存知見を runbook に固定** — `docs/runbooks/` に "なぜハマるか" を書き残す
4. **マルチ IDE 中立な記述** — SKILL.md 内で "Claude" と書かず "AI assistant" に寄せる

## メタデータ方針

`marketplace.json` の各 plugin の `description` は、`plugins/<name>/.claude-plugin/plugin.json` の `description` の**短縮要約版**。一覧で読み切れる長さに揃えるための**意図的な二重管理**で、plugin.json 側を更新したら marketplace.json 側の要約も追従させる (自動同期しない)。

## 今後の追加 (ロードマップ)

確定ではなく候補。優先度は利用フィードバックで入れ替わる。

- **アダプタの `--check` モード** — 変換せず差分・リンク切れだけ検証する dry-run (CI 組み込み用)
- **hooks の他プラグイン展開** — deploy-preflight の push ガードと同様の hook を smoke-test / privacy-check 等にも広げる
- **候補スキル** — `i18n` (多言語化)、`auth-e2e` (認証フローの E2E) など、体験フローの空白を埋めるもの
- **Antigravity アダプタの仕様追従** — Agent Skills 仕様の確定にあわせ tool 名マップ・出力先を確定させる

詳細な体験フローと設計判断は [docs/comparison/experience-flow.md](./comparison/experience-flow.md) / [backend-strategy.md](./comparison/backend-strategy.md) を参照。
