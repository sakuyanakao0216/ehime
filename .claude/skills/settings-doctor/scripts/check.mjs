#!/usr/bin/env node
// settings-doctor check — 依存ゼロ (Node 20+)
//
// 使い方: node check.mjs [path-to-settings.json]
// 出力: JSON ({ ok: boolean, findings: [{ id, severity, message, suggestion }] })
//
// exit code 契約:
//   0 = clean (severity=error の finding なし。warning のみなら 0)
//   1 = severity=error の finding が 1 件以上
//   2 = 対象ファイルの読込失敗 / JSON parse 失敗

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SCHEMA_URL_OK = 'https://json.schemastore.org/claude-code-settings.json';

const target = resolve(process.argv[2] ?? '.claude/settings.json');

const findings = [];
const push = (id, severity, message, suggestion) =>
  findings.push({ id, severity, message, suggestion });

let raw;
try {
  raw = await readFile(target, 'utf8');
} catch (e) {
  push('file-missing', 'error', `${target} を読めない: ${e.message}`, '対象パスを確認する');
  emit();
  process.exit(2);
}

let json;
try {
  json = JSON.parse(raw);
} catch (e) {
  push('invalid-json', 'error', `JSON parse 失敗: ${e.message}`, 'カンマ / 引用符 / 末尾余剰カンマを修正');
  emit();
  process.exit(2);
}

// (a) $schema 値の厳密一致
if (json.$schema && json.$schema !== SCHEMA_URL_OK) {
  push(
    'schema-url-mismatch',
    'error',
    `$schema 値が厳密に一致していない: "${json.$schema}"`,
    `"${SCHEMA_URL_OK}" に置き換える`,
  );
}

// (b) hooks の 2 段ネスト構造 / (e) timeout の単位疑い
// hook の timeout は「秒」単位。600 (= 10 分) 超はミリ秒との取り違えを疑う。
const TIMEOUT_SUSPICIOUS_OVER = 600;
const checkTimeout = (val, where) => {
  if (typeof val === 'number' && val > TIMEOUT_SUSPICIOUS_OVER) {
    push(
      'hooks-timeout-suspicious',
      'warning',
      `${where} の timeout が ${val} (${TIMEOUT_SUSPICIOUS_OVER} 超)。hook の timeout は秒単位なので、ミリ秒と取り違えている疑い`,
      '秒単位に直す (例: 60000 → 60)',
    );
  }
};

if (json.hooks && typeof json.hooks === 'object') {
  for (const [event, entries] of Object.entries(json.hooks)) {
    if (!Array.isArray(entries)) {
      push('hooks-not-array', 'error', `hooks.${event} は配列である必要がある`, `[ { "hooks": [...] } ] の形に修正`);
      continue;
    }
    entries.forEach((entry, i) => {
      if (entry == null || typeof entry !== 'object') {
        push('hooks-entry-not-object', 'error', `hooks.${event}[${i}] はオブジェクトである必要`, '{ "hooks": [...] } で囲む');
        return;
      }
      // command を直書きしている = 旧形式
      if ('command' in entry && !('hooks' in entry)) {
        push(
          'hooks-flat-command',
          'error',
          `hooks.${event}[${i}] が { command: ... } を直書きしている (2 段ネスト崩れ)`,
          `{ "hooks": [ { "type": "command", "command": "...", "timeout": 60 } ] } で囲む`,
        );
      }
      // 標準 schema に無いフィールド (例: mode)
      if ('mode' in entry) {
        push(
          'hooks-unknown-field',
          'warning',
          `hooks.${event}[${i}] に標準 schema に無い "mode" フィールドがある`,
          '"mode" を削除する (type / command / timeout のみが標準)',
        );
      }
      // (e) timeout の単位疑い (直書き / 2 段ネスト内の両方を見る)
      checkTimeout(entry.timeout, `hooks.${event}[${i}]`);
      if (Array.isArray(entry.hooks)) {
        entry.hooks.forEach((h, j) => {
          if (h && typeof h === 'object') checkTimeout(h.timeout, `hooks.${event}[${i}].hooks[${j}]`);
        });
      }
    });
  }
}

// (c) extraKnownMarketplaces.<id>.source の構造 / (d) source キー欠落
if (json.extraKnownMarketplaces && typeof json.extraKnownMarketplaces === 'object') {
  for (const [mpId, mp] of Object.entries(json.extraKnownMarketplaces)) {
    if (mp == null || typeof mp !== 'object') continue;
    if (!('source' in mp)) {
      push(
        'mp-source-missing',
        'error',
        `extraKnownMarketplaces.${mpId} に "source" キーが無い`,
        `{ "source": { "source": "github", "repo": "owner/repo" } } を追加する`,
      );
      continue;
    }
    const src = mp.source;
    if (typeof src === 'string') {
      push(
        'mp-source-string',
        'error',
        `extraKnownMarketplaces.${mpId}.source が文字列 ("${src}") になっている`,
        `{ "source": { "source": "${src}", "repo": "owner/repo" } } の形 (二重ネスト) に修正`,
      );
    } else if (src && typeof src === 'object') {
      // 内側に "source" と "repo" が必要
      if (!('source' in src)) {
        push('mp-source-inner-missing', 'error', `extraKnownMarketplaces.${mpId}.source に inner "source" がない`, '`{ "source": "github", "repo": "owner/repo" }` を入れる');
      }
      if (!('repo' in src)) {
        push('mp-source-repo-missing', 'error', `extraKnownMarketplaces.${mpId}.source に "repo" がない`, '`"repo": "owner/repo"` を追加');
      } else if (typeof src.repo === 'string' && !src.repo.includes('/')) {
        push('mp-repo-format', 'warning', `extraKnownMarketplaces.${mpId}.source.repo は "owner/repo" 形式 (現状 "${src.repo}")`, 'スラッシュ区切りで指定');
      }
    }
  }
}

// (f) enabledPlugins のキーは "name@marketplace" 形式
if (json.enabledPlugins && typeof json.enabledPlugins === 'object') {
  for (const key of Object.keys(json.enabledPlugins)) {
    if (!/^[^@\s]+@[^@\s]+$/.test(key)) {
      push(
        'enabled-plugin-format',
        'warning',
        `enabledPlugins のキー "${key}" が "name@marketplace" 形式でない`,
        `"${key}@<marketplace名>": true の形式にする (例: "${key}@vercel-aiagent-coding-skill")`,
      );
    }
  }
}

emit();
process.exit(findings.some((f) => f.severity === 'error') ? 1 : 0);

function emit() {
  const ok = findings.length === 0;
  console.log(JSON.stringify({ ok, target, findings }, null, 2));
}
