# `.claude/settings.json` parse 失敗パターン集

`check.mjs` が検出する典型 6 パターン。(a)〜(c) は実機検証 (2026 上期) で踏まれたもの (SETUP-README §7 を原典として保存)、(d)〜(f) は周辺で起きやすい設定ミス。

> **check.mjs の exit code 契約**: `0` = clean (warning のみも 0) / `1` = severity=error の finding が 1 件以上 / `2` = 対象ファイルの読込・JSON parse 失敗。

## (a) `$schema` 値の厳密一致

### 現象

トースト: `Settings file failed to parse: $schema must be equal to one of the allowed values`

### 原因

値が以下と**完全一致**していないと NG:

```
https://json.schemastore.org/claude-code-settings.json
```

`https://claude.ai/schemas/settings.json` のような直感的に見える URL は拒否される。

### 修正

エラーメッセージに出ている URL を **そのままコピー**。

### 検出

`check.mjs`: id = `schema-url-mismatch`

---

## (b) `hooks` の 2 段ネスト構造

### 現象

トースト: `Expected array, received undefined` または `Required` (どこで required かは表示されないことが多い)

### 原因

各 event (`SessionStart` 等) の配列要素は `{ hooks: [...] }` を持つ必要があるが、`command` を直書きする旧記法が誤って残るケース。

```jsonc
// ✗ NG
"hooks": {
  "SessionStart": [
    { "type": "command", "command": ".claude/hooks/start.sh" }
  ]
}

// ✓ OK
"hooks": {
  "SessionStart": [
    {
      "hooks": [
        { "type": "command", "command": ".claude/hooks/start.sh", "timeout": 60 }
      ]
    }
  ]
}
```

また `mode: "sync"` のような **標準 schema に無いフィールド**を入れると `additionalProperties: false` で別エラー。`type` / `command` / `timeout` のみに留める。

### 検出

`check.mjs`: id = `hooks-not-array` / `hooks-entry-not-object` / `hooks-flat-command` / `hooks-unknown-field`

---

## (c) `extraKnownMarketplaces.<id>.source` は二重ネスト

### 現象

トースト: `Expected object, received string`

### 原因

`source` フィールドの値は文字列ではなく**オブジェクト**で、その中に `source: "github"` と `repo: "owner/repo"` を入れる:

```jsonc
// ✗ NG
"extraKnownMarketplaces": {
  "vercel-aiagent-coding-skill": {
    "source": "github",
    "repo": "dentsu-fde/vercel-aiagent-coding-skill"
  }
}

// ✓ OK
"extraKnownMarketplaces": {
  "vercel-aiagent-coding-skill": {
    "source": {
      "source": "github",
      "repo": "dentsu-fde/vercel-aiagent-coding-skill"
    }
  }
}
```

`repo` は `"owner/repo"` 形式の単一文字列。`owner` を別フィールドにするのは NG (`additionalProperties: false`)。

### 検出

`check.mjs`: id = `mp-source-string` / `mp-source-inner-missing` / `mp-source-repo-missing` / `mp-repo-format`

---

## (d) `extraKnownMarketplaces.<id>` に `source` キー自体が無い

### 現象

marketplace が一覧に出ない / `Required` 系のエラー。

### 原因

`<id>` の中に `repo` などだけ書いて、`source` キーを丸ごと書き忘れるケース:

```jsonc
// ✗ NG — source キーが無い
"extraKnownMarketplaces": {
  "my-mp": {
    "repo": "owner/repo"
  }
}

// ✓ OK
"extraKnownMarketplaces": {
  "my-mp": {
    "source": { "source": "github", "repo": "owner/repo" }
  }
}
```

### 検出

`check.mjs`: id = `mp-source-missing` (error)

---

## (e) hooks の `timeout` はミリ秒ではなく**秒**

### 現象

hook が「10 分以上待っても切れない」「やたら長い timeout になっている」。parse は通るため気付きにくい。

### 原因

Claude Code の hook `timeout` は**秒単位**。`60000` のようにミリ秒のつもりで書くと 60000 秒 (約 16.7 時間) になる。

```jsonc
// ✗ 疑わしい — 60000 秒 (ミリ秒との取り違え)
{ "type": "command", "command": "...", "timeout": 60000 }

// ✓ OK — 60 秒
{ "type": "command", "command": "...", "timeout": 60 }
```

### 検出

`check.mjs`: id = `hooks-timeout-suspicious` (warning, 600 超で疑い判定)

---

## (f) `enabledPlugins` のキーは `name@marketplace` 形式

### 現象

`enabledPlugins` に書いたのに plugin が有効化されない。

### 原因

キーは `<plugin名>@<marketplace名>` の形式が必要。plugin 名だけ書くと参照先 marketplace が解決できない:

```jsonc
// ✗ NG
"enabledPlugins": { "kickoff": true }

// ✓ OK
"enabledPlugins": { "kickoff@vercel-aiagent-coding-skill": true }
```

### 検出

`check.mjs`: id = `enabled-plugin-format` (warning)

---

## ローカル schema 検証 (補助手段)

`check.mjs` でも検出できない奇妙なエラーが出たときの最終手段:

```bash
curl -sL https://www.schemastore.org/claude-code-settings.json -o /tmp/cc-schema.json
python3 -c "import json; from jsonschema import Draft202012Validator; \
print(list(Draft202012Validator(json.load(open('/tmp/cc-schema.json'))).iter_errors(json.load(open('.claude/settings.json')))))"
```
