# Antigravity で使うためのマニュアル（迷わないための手順書）

このプロジェクトのスキル群（`vercel-aiagent-coding-skill` マーケットプレイス）を
**Google Antigravity** で使うための手順。**Antigravity はここ（このリポジトリ内）だけ読めば完結する**ように書いてある。

> ✅ **ステータス: 仕様確定・実装済み**。Antigravity Agent Skills は **Agent Skills 標準フォーマット**
> （Claude Code と同一の `SKILL.md`）を採用しており、SKILL.md 本体はほぼ無変換で動く。
> アダプタは frontmatter を標準の `name` + `description` に整え、Antigravity が読む `.agents/skills/`
> レイアウトへ配置 + 同梱アセットのリンクを書き換える。

> なぜこの手順が要るか: `.claude/settings.json` の marketplace 参照は **Claude Code 専用**で、
> Antigravity はそれを解釈しない。GitHub の URL を毎回取りに行くと迷子になるので、
> **ローカルに `.agents/skills/` を一度だけ生成**して、それを Antigravity に読ませる。

---

## TL;DR（最短）

```bash
# 1. マーケットプレイスのアダプタでスキルを生成（このリポジトリのルートで実行）
#    既定の出力先が .agents/skills なので --out 省略でよい
node ../vercel-aiagent-coding-skill/adapters/antigravity/build.mjs

# 2. Antigravity を再読み込み → .agents/skills/ のスキルが認識される
```

`.agents/` `.agent/` は **gitignore 済・非コミット**。各自のマシンで生成して使う（再生成前提なので直接編集しない）。

---

## 前提：マーケットプレイス本体の場所

スキルの実体（`plugins/*/SKILL.md`）と変換アダプタ（`adapters/antigravity/build.mjs`）は
**別リポジトリ** `vercel-aiagent-coding-skill` にある。本テンプレはそれを**参照するだけ**。

| 状況 | 対応 |
|---|---|
| **隣にクローン済み**（推奨レイアウト） | `../vercel-aiagent-coding-skill/` をそのまま使う（TL;DR のコマンド） |
| まだ無い | `git clone https://github.com/FDE-project/vercel-aiagent-coding-skill.git` を**このリポジトリの隣**に置く |
| 別の場所にある | コマンドの `../vercel-aiagent-coding-skill/` を実際のパスに置き換える |

---

## 配置（discovery）のルール

Antigravity はスキルを次の場所から探す。**用途に応じて出力先を選ぶ**:

| スコープ | Antigravity（IDE） | Antigravity CLI |
|---|---|---|
| **プロジェクト** | `<root>/.agents/skills/`（= 既定の `--out`） | `<root>/.agent/skills/` |
| **グローバル** | `~/.agents/skills/` | `~/.gemini/antigravity-cli/skills/` |

---

## 生成手順（詳細）

```bash
# 全プラグイン（38個）を変換（既定: .agents/skills へ）
node ../vercel-aiagent-coding-skill/adapters/antigravity/build.mjs

# 出力先を明示（例: CLI 用の .agent/skills、または任意ディレクトリ）
node ../vercel-aiagent-coding-skill/adapters/antigravity/build.mjs --out .agent/skills

# 特定プラグインだけ欲しいとき（例: ai-feature / kickoff）
node ../vercel-aiagent-coding-skill/adapters/antigravity/build.mjs --plugin ai-feature
```

実行すると出力先（既定 `.agents/skills/`）配下に以下が展開される:

- `<plugin>/SKILL.md` … Antigravity Agent Skills 形式に整えた各スキル
- `<plugin>/references/ scripts/ templates/ …` … スキル同梱アセット
- `_docs/ _examples/ _README.md` … マーケットプレイス共有ドキュメント（オフラインで読める）

ビルド後にリンク切れを自己検証し、問題があれば `exit 1` で知らせる（正常は `exit 0`）。

### 変換時に起きること

| Claude 形式 | → Antigravity 形式 |
|---|---|
| frontmatter `name` / `description` | そのまま（標準フォーマットが同一） |
| `allowed-tools: [Bash, Edit, Read, Write]` | **出力しない**（Antigravity は Claude 形式 tool をゲートに使わない。標準でも実験的フィールド扱い） |
| `${CLAUDE_PLUGIN_ROOT}/...` 等の相対リンク | 生成先レイアウトに書き換え |
| 本文 | そのまま維持 |

> Antigravity の skill は `scripts/` と汎用エージェントツール（`run_command` / `write_to_file` / `replace_file_content` など）を使う。
> frontmatter で tool をゲートしないため、アダプタは `name` + `description` のみ書き出す。

---

## スキルを使わない選択肢（多くはこれで足りる）

スキル本体を動かさなくても、**構想・設計を Claude 側で実行 → `docs/` と `.steering/` に成果物を残す → Antigravity はそれを読んで実装続行**で最低限成立する。
`AGENTS.md` の作業フローポリシー（要件確認 → プラン → 着手、`dev` ブランチ運用、PR → プレビュー URL）は
Antigravity でも `AGENTS.md` 経由でそのまま効く。

「スキルの中身そのもの」が要るときだけ、上記の `.agents/skills/` 生成を行う。

---

## 運用ルール（house rules と整合）

- `.agents/skills/`（CLI は `.agent/skills/`）は **gitignore 済 = コミットしない**。各自ローカルで生成
- スキルは**直接編集しない**。マーケットプレイスが更新されたら adapter を**再実行**して再生成
- `--out` にマーケットプレイスの `plugins/` `docs/` `adapters/` 内を指定すると、汚染防止で拒否される

## 参考（公式）

- [Getting started with Antigravity skills (Google Codelabs)](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [Agent Skills — Specification (agentskills.io)](https://agentskills.io/specification)
- [Build with Google Antigravity (Developers Blog)](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
