# adapters/codex

Claude フォーマットの `plugins/<name>/SKILL.md` を **Codex Skills** 形式へ変換するアダプタ。

## 役割

- `plugins/*/SKILL.md` を読み込み、Codex 互換の `.codex/skills/<name>/SKILL.md` を生成
- `allowed-tools` の名前空間 (Bash/Edit → shell/edit_file 等) をマップ
- plugin 同梱アセット (`references/` `scripts/` `templates/` `workflows-template/` `__fixtures__/`) を `<out>/<name>/` 配下にコピーし、SKILL 内リンクを生成先レイアウトに合わせて書き換える
- この Marketplace の `docs/` → `<out>/_docs/`、`adapters/` → `<out>/_adapters/`、`examples/` → `<out>/_examples/`、`README.md` → `<out>/_README.md` として同梱
- ビルド後に出力内の全 `.md` の相対リンクを自己検証し、リンク切れがあれば一覧表示して **exit 1**

## 変換ルール (草案)

| Claude | Codex |
|---|---|
| `name` (frontmatter) | `name` (値が無いキーは出力しない) |
| `description` | `description` (同上) |
| `allowed-tools: [Bash, Edit, Read]` | `tools: [shell, edit_file, read_file]` |
| `model: claude-sonnet-4-6` | (省略 — Codex 側の default model) |
| `references/` `scripts/` `templates/` `workflows-template/` `__fixtures__/` | `<out>/<name>/` 配下にコピー |
| `docs/*.md` | `<out>/_docs/` にコピー |
| `examples/` | `<out>/_examples/` にコピー |
| 相対リンク (`.md` `.mjs` `.yml` `.yaml` `.json` `.sh` `.ts` / `dir/` 終わり) | 生成先レイアウトに合わせて書き換え |
| `[...](${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs)` 形式のリンク | `./scripts/check.mjs` のような plugin ディレクトリ相対に書き換え |
| body の `Claude` 表記 | 維持 |

入力 Markdown は BOM 除去・CRLF→LF 正規化してから frontmatter を解釈する。

## 実行方法（最小プロト実装済み）

```bash
node adapters/codex/build.mjs --out .codex/skills/    # 全 plugin を変換
node adapters/codex/build.mjs --out=.codex/skills/    # 等号形式も可
node adapters/codex/build.mjs --plugin ai-feature     # 単一 plugin だけ
```

この Marketplace repo で直接実行するほか、ターゲット repo から `.marketplace/adapters/codex/build.mjs` のように実行できる。ソースは adapter が置かれた Marketplace repo から読み、`--out` は実行ディレクトリ基準で解決する。生成物はローカル成果物として扱い、通常は commit しない。

### 挙動の補足

- **事前削除**: 今回のビルドで書き直す場所 (`<out>/<plugin>` と `_docs` `_adapters` `_examples` `_README.md`) だけを出力前に削除する。誤指定保護のため、出力先全体の rm -rf はしない
- **`--plugin` 指定時**: SKILL.md の変換は対象 plugin のみだが、`docs/` 等の共有物から全 plugin のアセットがリンクされるため、アセットコピーは全 plugin 分行う。リンク自己検証も対象 plugin 配下に限定する (出力全体の検証は全体ビルドで行う)
- **exit code**: 正常終了は 0。次の場合は 1 — (a) `--plugin` に存在しない名前を指定 / 変換 0 件、(b) `--out` がこの repo の `plugins/` `docs/` `adapters/` 内を指す (出力の変換元への混入防止)、(c) ビルド後のリンク自己検証でリンク切れを検出 (切れたリンクを stderr に一覧表示)

## 参考

- [Codex Agent Skills 公式 docs](https://developers.openai.com/codex/skills)
- [Codex AGENTS.md docs](https://developers.openai.com/codex/guides/agents-md)
- [Codex IDE slash commands](https://developers.openai.com/codex/ide/slash-commands)
