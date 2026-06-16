# adapters/antigravity

Claude フォーマットの `plugins/<name>/SKILL.md` を **Antigravity Agent Skills** 形式へ変換するアダプタ。

## ステータス

**実装済み・仕様確定**。Antigravity Agent Skills は **Agent Skills 標準フォーマット**(Claude Code と同一の SKILL.md)を採用しており、SKILL.md 本体はほぼ無変換で動く。本アダプタは frontmatter を標準の `name` + `description` に整え、Antigravity が読む `.agents/skills/` レイアウトへ配置 + 同梱アセットのリンクを書き換える。

参照した仕様:
- Google Codelabs「Getting started with Antigravity skills」
- Agent Skills 標準仕様（agentskills.io / specification）

## Antigravity Agent Skills 仕様(要点)

- **frontmatter**: `name`(必須・小文字とハイフンのみ・親ディレクトリ名と一致)、`description`(必須・トリガ語を含める)。optional に `license` / `compatibility` / `metadata` / `allowed-tools`(実験的)。
- **tool**: SKILL.md で Claude 形式の tool を宣言しない。`scripts/` と汎用エージェントツール(`run_command` / `write_to_file` / `replace_file_content` など)を使う。
- **配置(discovery)**:
  - プロジェクト: `<root>/.agents/skills/`(Antigravity)、`<root>/.agent/skills/`(Antigravity CLI)
  - グローバル: `~/.agents/skills/`(Antigravity)、`~/.gemini/antigravity-cli/skills/`(Antigravity CLI)
- **ディレクトリ**: `SKILL.md`(必須)+ `scripts/` `references/` `assets/`(任意。その他のディレクトリも可)。

## 実行方法

```bash
node adapters/antigravity/build.mjs                          # 全 plugin → .agents/skills/ (既定)
node adapters/antigravity/build.mjs --out /tmp/ag-skills      # 出力先を指定
node adapters/antigravity/build.mjs --plugin ai-feature       # 単一 plugin だけ
```

adapter が置かれた Marketplace repo の `plugins/*/skills/*/SKILL.md` を走査し、`<out>/<name>/SKILL.md` を書き出す。`--out` は実行ディレクトリ基準で解決し、絶対パスも指定できる。既定の出力先 `.agents/skills/` は Antigravity のプロジェクトスコープ skills ディレクトリ。生成物はローカル成果物として扱い、通常は commit しない。

## 変換ルール

| Claude | Antigravity |
|---|---|
| `name` (frontmatter) | `name`(値が無いキーは出力しない) |
| `description` | `description`(同上) |
| `allowed-tools: [Bash, Edit, Read, Write]` | **出力しない**(Antigravity は Claude 形式の tool をゲートに使わない。標準でも実験的フィールド) |
| `references/` `scripts/` `templates/` `workflows-template/` `__fixtures__/` | `<out>/<name>/` 配下にコピー |
| `docs/*.md` | `<out>/_docs/` にコピー |
| `examples/` | `<out>/_examples/` にコピー |
| 相対リンク (`.md` `.mjs` `.yml` `.yaml` `.json` `.sh` `.ts` / `dir/` 終わり) | 生成先レイアウトに合わせて書き換え |
| `[...](${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs)` 形式のリンク | `./scripts/check.mjs` のような plugin ディレクトリ相対に書き換え |
| body | そのまま維持 |

入力 Markdown は BOM 除去・CRLF→LF 正規化してから frontmatter を解釈する。

## 挙動の補足

- **事前削除**: 今回のビルドで書き直す場所 (`<out>/<plugin>` と `_docs` `_adapters` `_examples` `_README.md`) だけを出力前に削除する。誤指定保護のため、出力先全体の rm -rf はしない
- **`--plugin` 指定時**: SKILL.md の変換は対象 plugin のみだが、`docs/` 等の共有物から全 plugin のアセットがリンクされるため、アセットコピーは全 plugin 分行う。リンク自己検証も対象 plugin 配下に限定する (出力全体の検証は全体ビルドで行う)
- **リンク自己検証**: ビルド後、出力内の全 `.md` の相対リンクを解決し、リンク切れがあれば一覧表示して **exit 1**
- **exit code**: 正常終了は 0。次の場合は 1 — (a) `--plugin` に存在しない名前を指定 / 変換 0 件、(b) `--out` がこの repo の `plugins/` `docs/` `adapters/` 内を指す (出力の変換元への混入防止)、(c) リンク自己検証でリンク切れを検出

## 今後 (予定)

- Antigravity の `Hooks` / `Subagents` 機能との連携設計
- `Managed Agents` tier への展開可否を検討

## 参考

- [Getting started with Antigravity skills (Google Codelabs)](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
- [Agent Skills — Specification (agentskills.io)](https://agentskills.io/specification)
- [Build with Google Antigravity (Developers Blog)](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
