#!/usr/bin/env node
// deploy-preflight/scan-demo-protection — デモ公開範囲 (アクセス保護) の検出 (依存ゼロ)
//
// 「客には見せたいが世界には公開したくない」プロトが全世界公開のままデプロイされるのを防ぐ。
// ローカルから機械判定できるのはコード内のサイト全体ゲートのみ:
// - middleware.ts/js (root or src/) に Basic 認証・認証ガードらしき実装があるか
//
// Vercel Deployment Protection (ダッシュボード設定) はローカルから検出できないため、
// middleware が見つからない場合は「未保護の可能性」として確認を促す warning を返す。
// 判断基準は references/deployment-protection.md を参照。
//
// exit code: 0 = サイト全体ゲートを検出 / 1 = 検出できず (Vercel 側設定の確認を促す) / 2 = 実行失敗

import { readFileSync, existsSync } from 'node:fs';

const CANDIDATES = [
  'middleware.ts', 'middleware.js',
  'src/middleware.ts', 'src/middleware.js',
];

// サイト全体ゲートらしさのシグナル (Basic 認証 / 認証 SDK の middleware)
const SIGNALS = [
  { id: 'basic-auth', re: /authorization|basic[-_ ]?auth|btoa|atob|401/i, label: 'Basic 認証らしき実装' },
  { id: 'auth-middleware', re: /next-auth|@clerk|withAuth|authMiddleware|clerkMiddleware/i, label: '認証 SDK の middleware' },
];

try {
  const target = CANDIDATES.find((c) => existsSync(c));
  if (target) {
    const content = readFileSync(target, 'utf8');
    const hit = SIGNALS.find((s) => s.re.test(content));
    if (hit) {
      console.log(JSON.stringify({
        ok: true, severity: 'ok', protection: 'middleware',
        file: target, signal: hit.id,
        message: `${target} に${hit.label}を検出。公開範囲はコード側で制御されている`,
      }, null, 2));
      process.exit(0);
    }
  }

  // middleware なし or ゲートらしき実装なし → ローカルでは判定不能
  console.log(JSON.stringify({
    ok: false, severity: 'warning', protection: 'unknown',
    message: 'サイト全体のアクセスゲートをコードから検出できなかった。意図的な全世界公開でなければ、Vercel Deployment Protection (ダッシュボード) か middleware の Basic 認証を設定する。判断基準: references/deployment-protection.md',
  }, null, 2));
  process.exit(1);
} catch (e) {
  console.error(JSON.stringify({ ok: false, severity: 'error', message: `実行失敗: ${e.message}` }));
  process.exit(2);
}
