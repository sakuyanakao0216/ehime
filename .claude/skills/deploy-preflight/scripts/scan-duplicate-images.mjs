#!/usr/bin/env node
// deploy-preflight/scan-duplicate-images — 画像ディレクトリの重複検出 (依存ゼロ)
//
// 使い方: node scan-duplicate-images.mjs [対象ディレクトリ]   (省略時: public)
//
// 同じ MD5 ハッシュの画像が複数ある場合に警告。ファイル名違いの重複を炙る。
// symlink は無限再帰防止のためスキップする。
// 対象ディレクトリが存在しない場合は「検査ゼロを pass」と区別できるよう
// { ok: true, skipped: true, reason: ... } を明示出力して exit 0。
//
// exit code 契約:
//   0 = 重複なし (対象ディレクトリ不在による skip も含む)
//   1 = 重複あり
//   2 = 実行失敗 (読み取りエラー等)

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, lstatSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.argv[2] ?? 'public';
const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);
const map = new Map(); // hash → [paths]

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const p = join(dir, name);
    let s;
    try { s = lstatSync(p); } catch { continue; }
    if (s.isSymbolicLink()) continue; // symlink は追わない (無限再帰防止)
    if (s.isDirectory()) walk(p);
    else if (s.isFile() && IMG_EXT.has(extname(p).toLowerCase())) {
      const hash = createHash('md5').update(readFileSync(p)).digest('hex');
      const list = map.get(hash) ?? [];
      list.push(p);
      map.set(hash, list);
    }
  }
}

if (!existsSync(ROOT) || !lstatSync(ROOT).isDirectory()) {
  console.log(JSON.stringify({ ok: true, skipped: true, reason: `対象ディレクトリ不在: ${ROOT}` }, null, 2));
  process.exit(0);
}

try {
  walk(ROOT);
} catch (e) {
  console.error(JSON.stringify({ ok: false, severity: 'error', message: `実行失敗: ${e.message}` }, null, 2));
  process.exit(2);
}

const dups = [...map.entries()].filter(([, paths]) => paths.length > 1).map(([hash, paths]) => ({ hash, paths }));
const ok = dups.length === 0;
console.log(JSON.stringify({ ok, severity: ok ? 'ok' : 'warning', count: dups.length, dups }, null, 2));
process.exit(ok ? 0 : 1);
