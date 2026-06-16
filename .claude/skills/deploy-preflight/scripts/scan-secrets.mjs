#!/usr/bin/env node
// deploy-preflight/scan-secrets — 依存ゼロ
//
// commit 候補のファイルから「秘密っぽい文字列」を探す。
// - AWS / GitHub / Vercel / Anthropic / OpenAI / Gemini / generic な API token 形式
// - 私的鍵ヘッダ
// - .env* ファイルそのものが staged されていないか
//
// 使い方:
//   node scan-secrets.mjs [--staged | --all] [path...]
// デフォルト: git staged のみ

import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

const args = process.argv.slice(2);
const mode = args.includes('--all') ? 'all' : 'staged';
const explicitPaths = args.filter((a) => !a.startsWith('--'));

const PATTERNS = [
  { id: 'aws-key', re: /AKIA[0-9A-Z]{16}/, label: 'AWS Access Key ID' },
  { id: 'github-token', re: /gh[psor]_[A-Za-z0-9_]{36,255}/, label: 'GitHub token' },
  { id: 'vercel-token', re: /\b[A-Za-z0-9]{24}\b.*VERCEL/i, label: 'Vercel token-ish' },
  { id: 'anthropic', re: /sk-ant-[A-Za-z0-9_\-]{30,}/, label: 'Anthropic API key' },
  { id: 'openai', re: /sk-[A-Za-z0-9_\-]{30,}/, label: 'OpenAI / generic sk- key' },
  { id: 'gemini', re: /AIza[0-9A-Za-z_\-]{35}/, label: 'Google / Gemini API key' },
  { id: 'private-key', re: /-----BEGIN ([A-Z ]+)PRIVATE KEY-----/, label: 'Private key block' },
  { id: 'generic-bearer', re: /Bearer\s+[A-Za-z0-9_\-\.]{20,}/, label: 'Generic Bearer token' },
];

function getFiles() {
  if (explicitPaths.length > 0) return explicitPaths;
  try {
    const out = execFileSync('git', mode === 'staged'
      ? ['diff', '--cached', '--name-only', '--diff-filter=AM']
      : ['ls-files'], { encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch (e) {
    console.error(`git 呼び出し失敗: ${e.message}`);
    return [];
  }
}

const findings = [];
const SKIP_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.pdf', '.zip', '.lock']);
const SKIP_DIR = ['node_modules/', '.next/', 'dist/', 'build/', '.git/'];

for (const f of getFiles()) {
  if (SKIP_DIR.some((d) => f.includes(d))) continue;
  const ext = '.' + (f.split('.').pop() ?? '');
  if (SKIP_EXT.has(ext)) continue;

  // .env* 自体が staged されているなら最大警戒
  if (/(^|\/)\.env(\..+)?$/.test(f) && !f.endsWith('.example')) {
    findings.push({ file: f, line: 0, id: 'env-staged', label: `.env ファイルが ${mode} に含まれている` });
    continue;
  }

  let content;
  try {
    if (statSync(f).size > 1024 * 1024) continue; // > 1MB skip
    content = readFileSync(f, 'utf8');
  } catch {
    continue;
  }

  content.split('\n').forEach((line, i) => {
    for (const p of PATTERNS) {
      if (p.re.test(line)) {
        findings.push({ file: f, line: i + 1, id: p.id, label: p.label });
      }
    }
  });
}

const ok = findings.length === 0;
console.log(JSON.stringify({ ok, mode, count: findings.length, findings }, null, 2));
process.exit(ok ? 0 : 1);
