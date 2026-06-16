---
name: settings-doctor
description: Claude Code の `.claude/settings.json` が parse 失敗してトースト "Settings file failed to parse" が出る、または Plugin / hook / permission / extraKnownMarketplaces が**何故か効かない**ときに起動する診断スキル。`$schema` 値の不一致、`hooks` の 2 段ネスト崩れ、`extraKnownMarketplaces.<id>.source` を文字列で書いてしまうミスなど、実機で踏まれた失敗を中心に典型 6 パターンを自動検出し、修正パッチを提示する。「settings おかしい」「parse failed」「plugin 効かない」「hook 動かない」「marketplace 参照できない」「/doctor」などのキーワードでトリガする。
allowed-tools: [Bash, Read, Edit]
---

# settings-doctor

## このスキルが解決すること

Claude Code は `.claude/settings.json` を schema バリデーションする。引っかかるとファイル**全体**が無効化され、`permissions` / `hooks` / `extraKnownMarketplaces` / `enabledPlugins` が**一切効かない**。トーストには:

> Settings file failed to parse: .../.claude/settings.json — <理由>. Permission rules and other settings from this file are not in effect.

と出るが、原因の特定は地味に時間を食う。このスキルは典型 6 失敗パターンを正規表現 + JSON 構造チェックで検出する。

## 検出する 6 パターン

### (a) `$schema` 値の厳密一致

正しい値は **`https://json.schemastore.org/claude-code-settings.json`** のみ。`claude.ai/schemas/...` のような直感的 URL は NG。

### (b) `hooks` の 2 段ネスト構造

各 event (例: `SessionStart`) の配列要素は `{ "hooks": [...] }` を持つ必要がある。`command` を直書きすると "Expected array, received undefined"。標準 schema に無いフィールド (`mode: "sync"` 等) を入れると別エラー。

### (c) `extraKnownMarketplaces.<id>.source` は **オブジェクト**

```jsonc
// ✗ NG — Expected object, received string
"source": "github", "repo": "..."

// ✓ OK
"source": { "source": "github", "repo": "owner/repo" }
```

### (d) `extraKnownMarketplaces.<id>` に `source` キー自体が無い

`repo` などだけ書いて `source` キーを書き忘れるケース。marketplace が解決されない (error)。

### (e) hooks の `timeout` は**秒**単位

`60000` のようにミリ秒のつもりで書くと 60000 秒 (約 16.7 時間) になる。600 超は取り違え疑いとして warning。正しくは `"timeout": 60` のように秒で書く。

### (f) `enabledPlugins` のキーは `name@marketplace` 形式

`"kickoff": true` ではなく `"kickoff@vercel-aiagent-coding-skill": true`。形式が崩れていると plugin が有効化されない (warning)。

詳細パターンは [references/known-failure-patterns.md](./references/known-failure-patterns.md) に集約。

## 起動方法

### 自律起動

ユーザが上記症状を訴えた時点で自動的にこのスキルを参照する。

### slash command

`/doctor` で明示起動。引数で対象ファイルを指定可能 (省略時はリポジトリルートの `.claude/settings.json`)。

## 実行手順

1. 対象ファイルを Read で読み込み、JSON parse を試みる
2. parse 成功なら `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs <対象ファイル>` を Bash で実行 (6 パターン + 任意で schemastore 検証)
3. 検出された問題ごとに「現状 / あるべき形 / 修正パッチ」を提示
4. ユーザ承認後、Edit ツールで実際にパッチを適用
5. 適用後、再度 check を実行して green (exit 0) を確認

> **check.mjs の exit code 契約**: `0` = clean (warning のみも 0) / `1` = severity=error の finding が 1 件以上 / `2` = 対象ファイルの読込・JSON parse 失敗。

## 出力フォーマット例

```
## settings-doctor レポート

対象: .claude/settings.json
検出: 2 件

### [a] $schema 値の不一致
現状: "https://claude.ai/schemas/settings.json"
あるべき: "https://json.schemastore.org/claude-code-settings.json"

### [c] extraKnownMarketplaces.claude-skills.source が文字列
現状: { "source": "github", "repo": "..." }
あるべき: { "source": { "source": "github", "repo": "..." } }

修正パッチを適用しますか? (y/N)
```

## 参考

- [references/known-failure-patterns.md](./references/known-failure-patterns.md) — 失敗パターンの詳細と再現条件
- [scripts/check.mjs](./scripts/check.mjs) — 検出ロジック本体
