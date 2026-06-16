#!/usr/bin/env node
// deploy-preflight/scan-console — console.log 残存検出 (依存ゼロ)
//
// app/ components/ lib/ 配下の .ts/.tsx から console.log を検出。
// console.error / console.warn は許容 (運用ログとして残すケースあり)。
// `// eslint-disable-next-line` か `// allow-console` のコメントがある場合は除外。

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['app', 'components', 'lib'];
const EXTS = new Set(['.ts', '.tsx']);

const findings = [];

function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) walk(p);
    else if (EXTS.has(extname(p))) check(p);
  }
}

function check(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/\bconsole\.log\s*\(/.test(line)) {
      const prev = lines[i - 1] ?? '';
      if (/eslint-disable.*no-console|allow-console/.test(prev)) return;
      if (/eslint-disable.*no-console|allow-console/.test(line)) return;
      findings.push({ file, line: i + 1, snippet: line.trim().slice(0, 120) });
    }
  });
}

for (const r of ROOTS) walk(r);

const ok = findings.length === 0;
console.log(JSON.stringify({ ok, severity: ok ? 'ok' : 'warning', count: findings.length, findings }, null, 2));
process.exit(ok ? 0 : 2); // 2 = warning
