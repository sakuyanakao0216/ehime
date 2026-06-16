# `.claude/settings.json` parse 失敗パターン集

Claude Code は `.claude/settings.json` を schema validation する。引っかかるとファイル**全体**が無効化され、`permissions` / `hooks` / `extraKnownMarketplaces` / `enabledPlugins` が **一切効かない**。トーストには:

> Settings file failed to parse: .../.claude/settings.json — <理由>. Permission rules and other settings from this file are not in effect.

`settings-doctor` Plugin の `/doctor` は **6 パターン**を自動検出する（全パターンの一覧は [known-failure-patterns.md](../../settings-doctor/references/known-failure-patterns.md)）。本ページは実機検証で踏んだ代表 3 パターン (a)〜(c) を詳説する。

## (a) `$schema` 値の厳密一致

### 現象
- トースト: `Settings file failed to parse: $schema must be equal to one of the allowed values`

### 原因
値が以下と**完全一致**していないと NG:

```
https://json.schemastore.org/claude-code-settings.json
```

`https://claude.ai/schemas/settings.json` のような直感的に見える URL は拒否される。

### 修正
エラーメッセージに出ている URL を**そのままコピー**。

### 自動検出
`/doctor` で `id: schema-url-mismatch`

---

## (b) `hooks` の 2 段ネスト構造

### 現象
- トースト: `Expected array, received undefined` または `Required` (どこで required かは表示されないことが多い)

### 原因
各 event (`SessionStart` など) の配列要素は `{ hooks: [...] }` を持つ必要があるが、`command` を直書きする旧記法が誤って残るケース。

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

`timeout` は**秒単位**。`60000` とミリ秒のつもりで書くと約 16.7 時間になる（`/doctor` で `hooks-timeout-suspicious` として警告）。

`mode: "sync"` のような **標準 schema に無いフィールド**を入れると `additionalProperties: false` で別エラー。`type` / `command` / `timeout` のみに留める。

### 自動検出
`/doctor` で `hooks-not-array` / `hooks-entry-not-object` / `hooks-flat-command` / `hooks-unknown-field`

---

## (c) `extraKnownMarketplaces.<id>.source` は二重ネスト

### 現象
- トースト: `Expected object, received string`

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

`repo` は `"owner/repo"` 形式の単一文字列 (`owner` を別フィールドにするのは NG、`additionalProperties: false`)。

### 自動検出
`/doctor` で `mp-source-string` / `mp-source-inner-missing` / `mp-source-repo-missing` / `mp-repo-format`

---

## ローカル schema 検証 (補助手段)

`/doctor` でも検出できない奇妙なエラーが出たとき:

```bash
curl -sL https://json.schemastore.org/claude-code-settings.json -o /tmp/cc-schema.json
python3 -c "import json; from jsonschema import Draft202012Validator; \
print(list(Draft202012Validator(json.load(open('/tmp/cc-schema.json'))).iter_errors(json.load(open('.claude/settings.json')))))"
```

## 関連

- [plugins/settings-doctor/](../../settings-doctor/) — `/doctor` の実装本体
- [plugins/settings-doctor/scripts/check.mjs](../../settings-doctor/scripts/check.mjs) — 検出ロジック
