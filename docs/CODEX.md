# Codex で使うためのマニュアル（迷わないための手順書）

このプロジェクトのスキル群（`vercel-aiagent-coding-skill` マーケットプレイス）を
**VS Code の Codex / Codex CLI** で使うための手順。**Codex はここ（このリポジトリ内）だけ読めば完結する**ように書いてある。

> なぜこの手順が要るか: `.claude/settings.json` の marketplace 参照は **Claude Code 専用**で、
> Codex はそれを解釈しない。GitHub の URL を毎回取りに行くと迷子になるので、
> **ローカルに `.codex/skills/` を一度だけ生成**して、それを Codex に読ませる。

---

## TL;DR（最短）

```bash
# 1. マーケットプレイスのアダプタで .codex/skills/ を生成（このリポジトリのルートで実行）
node ../vercel-aiagent-coding-skill/adapters/codex/build.mjs --out .codex/skills/

# 2. Codex を再読み込み（VS Code 拡張なら再起動 or 新セッション）→ スラッシュコマンドでスキルが出る
```

`.codex/` は **gitignore 済・非コミット**。各自のマシンで生成して使う（再生成前提なので直接編集しない）。

---

## 前提：マーケットプレイス本体の場所

スキルの実体（`plugins/*/SKILL.md`）と変換アダプタ（`adapters/codex/build.mjs`）は
**別リポジトリ** `vercel-aiagent-coding-skill` にある。本テンプレはそれを**参照するだけ**。

| 状況 | 対応 |
|---|---|
| **隣にクローン済み**（推奨レイアウト） | `../vercel-aiagent-coding-skill/` をそのまま使う（TL;DR のコマンド） |
| まだ無い | `git clone https://github.com/FDE-project/vercel-aiagent-coding-skill.git` を**このリポジトリの隣**に置く |
| 別の場所にある | コマンドの `../vercel-aiagent-coding-skill/` を実際のパスに置き換える |

> Codex には「マーケットプレイス本体は別 repo。無ければ上記を clone してから adapter を実行」とだけ伝えれば迷わない。

---

## 生成手順（詳細）

```bash
# 全プラグイン（38個）を変換
node ../vercel-aiagent-coding-skill/adapters/codex/build.mjs --out .codex/skills/

# 特定プラグインだけ欲しいとき（例: ai-feature / kickoff）
node ../vercel-aiagent-coding-skill/adapters/codex/build.mjs --plugin ai-feature --out .codex/skills/
```

実行すると `.codex/skills/` 配下に以下が展開される:

- `<plugin>/SKILL.md` … Codex Skills 形式に変換された各スキル
- `<plugin>/references/ scripts/ templates/ …` … スキル同梱アセット
- `_docs/ _examples/ _README.md` … マーケットプレイス共有ドキュメント（オフラインで読める）

ビルド後にリンク切れを自己検証し、問題があれば `exit 1` で知らせる（正常は `exit 0`）。

### 変換時に起きること

| Claude 形式 | → Codex 形式 |
|---|---|
| frontmatter `name` / `description` | そのまま |
| `allowed-tools: [Bash, Edit, Read, Write]` | `tools: [shell, edit_file, read_file, write_file]` |
| `model: claude-sonnet-4-6` | 省略（Codex の default model に委ねる） |
| `${CLAUDE_PLUGIN_ROOT}/...` 等の相対リンク | 生成先レイアウトに書き換え |
| 本文の `Claude` 表記 | 維持（文脈で読める） |

---

## VS Code Codex からの呼び出し

1. 上記で `.codex/skills/` を生成
2. Codex 拡張を再読み込み（新セッション）
3. **スラッシュコマンド**でスキルを起動（例 `/spec` `/ship` など。一覧は `.codex/skills/_README.md`）

参考（公式）:
- [Codex Agent Skills](https://developers.openai.com/codex/skills)
- [Codex IDE slash commands](https://developers.openai.com/codex/ide/slash-commands)
- [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md)

---

## スキルを使わない選択肢（多くはこれで足りる）

スキル本体を動かさなくても、**構想・設計を Claude 側で実行 → `docs/` と `.steering/` に成果物を残す → Codex はそれを読んで実装続行**で最低限成立する。
`AGENTS.md` の作業フローポリシー（要件確認 → プラン → 着手、`dev` ブランチ運用、PR → プレビュー URL）は
Codex でも `AGENTS.md` 経由でそのまま効く。

「スキルの中身そのもの」が要るときだけ、上記の `.codex/skills/` 生成を行う。

---

## 運用ルール（house rules と整合）

- `.codex/skills/` は **gitignore 済 = コミットしない**。各自ローカルで生成
- スキルは**直接編集しない**。マーケットプレイスが更新されたら adapter を**再実行**して再生成
- `--out` にマーケットプレイスの `plugins/` `docs/` `adapters/` 内を指定すると、汚染防止で拒否される
