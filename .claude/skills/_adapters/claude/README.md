# adapters/claude

Claude フォーマットの `plugins/<name>/SKILL.md` を、リポジトリに **commit して使う**
`.claude/skills/<name>/SKILL.md` へ vendoring (焼き込み) するアダプタ。

## なぜ要るか

`.claude/settings.json` の marketplace 参照 (`extraKnownMarketplaces` + `enabledPlugins`) は
**ローカルの Claude Code (CLI / VS Code) でしか install されない**。Claude Web (クラウド) では
marketplace の clone がセッション初期化に間に合わず、初回セッションで plugin が無効になりがち
(`/reload-plugins` も Web では無効)。

一方 `.claude/skills/` に **commit された** skill はリポジトリ本体の一部なので、
Web/クラウドでも毎回・即ロードされる。そこで marketplace の skill を `.claude/skills/` に
焼き込むのがこのアダプタ。**marketplace を参照できる環境では marketplace が正本**で、
ここで生成する `.claude/skills/` は「参照できない環境向けの複製」と位置づける。

## 役割

- `plugins/*/SKILL.md` を読み込み、`.claude/skills/<name>/SKILL.md` を生成
- SKILL.md は Claude **ネイティブ形式**なので frontmatter は **一切変換しない (verbatim 保持)**。`allowed-tools` も `model` もそのまま
- plugin 同梱アセット (`references/` `scripts/` `templates/` `workflows-template/` `__fixtures__/`) を `<out>/<name>/` 配下にコピーし、SKILL 内リンクを生成先レイアウトに合わせて書き換える
- この Marketplace の `docs/` → `<out>/_docs/`、`adapters/` → `<out>/_adapters/`、`examples/` → `<out>/_examples/`、`README.md` → `<out>/_README.md` として同梱 (先頭 `_` なので Claude は skill として走査しない)
- ビルド後に出力内の全 `.md` の相対リンクを自己検証し、リンク切れがあれば一覧表示して **exit 1**

## Codex/Antigravity adapter との違い

| | codex | antigravity | **claude** |
|---|---|---|---|
| frontmatter | tool 名をマップ / `model` 省略 | `name` + `description` のみ | **無変換 (verbatim)** |
| 既定 `--out` | `.codex/skills` | `.agents/skills` | **`.claude/skills`** |
| commit | 通常しない | 通常しない | **する (Web に届けるため)** |

## 実行方法

```bash
node adapters/claude/build.mjs                        # 全 plugin を .claude/skills/ へ
node adapters/claude/build.mjs --out=.claude/skills/  # 出力先を明示
node adapters/claude/build.mjs --plugin ai-feature    # 単一 plugin だけ
```

この Marketplace repo で直接実行するほか、ターゲット repo から
`../vercel-aiagent-coding-skill/adapters/claude/build.mjs` のように実行できる。
ソースは adapter が置かれた Marketplace repo から読み、`--out` は実行ディレクトリ基準で解決する。

### 挙動の補足

- **事前削除**: 今回のビルドで書き直す場所 (`<out>/<plugin>` と `_docs` `_adapters` `_examples` `_README.md`) だけを出力前に削除する。誤指定保護のため出力先全体の rm -rf はしない
- **stale 掃除 (reconcile / manifest 方式)**: source から削除・rename された plugin の生成物が出力に残ると、commit 経由で Web に stale な SKILL.md がロードされてしまう。これを防ぐため、出力直下に **`.vendored-skills.json`（この adapter が生成した plugin の記録）** を置き、reconcile は **「前回 manifest に載っていた ∧ 現存 plugin に無い」もの = adapter が過去に生成した stale 出力だけ**を削除する。`--plugin` 指定時もこの掃除を行い、manifest は常に現存 source の全 plugin を記録する。**利用者が `.claude/skills/` に手で置いた独自 skill は manifest に載らないので絶対に消さない**（先頭 `_` の共有物も対象外）。manifest が無い初回・旧出力では何も消さない（安全側）。掃除した plugin 名は出力 JSON の `removedStale` に出る
- **`--plugin` 指定時**: SKILL.md の変換は対象 plugin のみだが、`docs/` 等の共有物から全 plugin のアセットがリンクされるため、アセットコピーは全 plugin 分行う。リンク自己検証も対象 plugin 配下に限定する
- **exit code**: 正常終了は 0。次の場合は 1 — (a) `--plugin` に存在しない名前を指定 / 変換 0 件、(b) `--out` がこの repo の `plugins/` `docs/` `adapters/` 内を指す、(c) ビルド後のリンク自己検証でリンク切れを検出

## 参考

- [Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)
