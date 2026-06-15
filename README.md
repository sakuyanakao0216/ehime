<!--
このファイルはアプリの README です。コピー後、あなたのプロジェクト説明に書き換えてください。
テンプレ(スターター)の使い方は docs/STARTER.md、ハウスルールは AGENTS.md にあります。
-->

# (プロジェクト名)

(このアプリが何か、1〜2 行で。クライアントピッチで通る粒度で書く)

## ローカル起動

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## 開発の進め方

- **何か作りたいとき**: Claude Code で `/start`（司令塔。要件確認 → プラン → フロー → dev ブランチ作業 → プレビュー URL。最短なら `/start --quick`）
- **Codex / Antigravity でスキルを使いたいとき**: エージェントに **「スキルを生成して」** と頼むだけ（adapter が `.codex/skills/` ・ `.agents/skills/` に書き出す）。手順は [docs/CODEX.md](docs/CODEX.md) / [docs/ANTIGRAVITY.md](docs/ANTIGRAVITY.md)
- **環境変数 / API キー**: [docs/STARTER.md「環境変数 / API キー」](docs/STARTER.md#環境変数--api-キー)
- **テンプレの使い方全体**（サーフェス別クイックスタート・プラグイン一覧）: [docs/STARTER.md](docs/STARTER.md)
- **ハウスルール / 既定の作業フロー（司令塔）/ 規約 / 禁止事項**: [AGENTS.md](AGENTS.md)

## 技術スタック

Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui / pnpm / Vercel。詳細は [AGENTS.md](AGENTS.md)。

---

> 🧰 このリポジトリは [`vercel-aiagent-coding-skill-starter`](docs/STARTER.md) から作成。テンプレの全機能と使い方は [docs/STARTER.md](docs/STARTER.md) を参照。
