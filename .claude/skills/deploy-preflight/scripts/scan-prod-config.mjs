#!/usr/bin/env node
// deploy-preflight/scan-prod-config — 本番昇格時に外したい設定の検出 (依存ゼロ)
//
// next.config.mjs / .ts / .js の以下フラグを検出:
// - typescript.ignoreBuildErrors: true
// - eslint.ignoreDuringBuilds: true
// - images.unoptimized: true
//
// 開発期は OK だが本番昇格時に外したい設定。production_build フラグなど環境分岐がある場合は手動確認。

import { readFileSync, existsSync } from 'node:fs';

const CANDIDATES = ['next.config.mjs', 'next.config.ts', 'next.config.js'];

const findings = [];
const PATTERNS = [
  { id: 'ts-ignore-build', re: /ignoreBuildErrors\s*:\s*true/, label: 'typescript.ignoreBuildErrors: true' },
  { id: 'eslint-ignore', re: /ignoreDuringBuilds\s*:\s*true/, label: 'eslint.ignoreDuringBuilds: true' },
  { id: 'images-unoptimized', re: /unoptimized\s*:\s*true/, label: 'images.unoptimized: true' },
];

const target = CANDIDATES.find((c) => existsSync(c));
if (!target) {
  console.log(JSON.stringify({ ok: true, message: 'next.config が無いのでスキップ' }));
  process.exit(0);
}

const content = readFileSync(target, 'utf8');
content.split('\n').forEach((line, i) => {
  for (const p of PATTERNS) {
    if (p.re.test(line)) {
      findings.push({ file: target, line: i + 1, id: p.id, label: p.label, snippet: line.trim() });
    }
  }
});

// "プロト中は OK、本番昇格時に見直す" 設定。本スクリプトは warning 扱い (デプロイは止めない)。
const ok = findings.length === 0;
console.log(JSON.stringify({ ok, severity: ok ? 'ok' : 'warning', count: findings.length, findings }, null, 2));
process.exit(ok ? 0 : 2);
