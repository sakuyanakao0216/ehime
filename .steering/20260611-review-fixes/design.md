# 設計内容 — 全体レビュー指摘の修正 + 追加機能 (20260611-review-fixes)

## 方針

- テンプレの「最小スケルトン」思想は崩さない。追加するのは**土台**(残して拡張するもの) のみで、UI デモ類は足さない
- 追加ファイルは全てキーレスで動く (Analytics / Speed Insights は Vercel ダッシュボードで Enable するだけ)
- デザイントークン規約に従い、新規 UI (error / not-found) は hex ハードコードなし

## 確定事項

### session-start.sh (A-2)

- `set -euo pipefail` — `| tail -5` による失敗マスクを解消
- `corepack prepare --activate` (引数なし) — package.json の `packageManager: pnpm@9.15.0` ピンを自動採用。`@latest` 指定はピンと食い違うため廃止
- npm フォールバックは**削除** — pnpm-lock.yaml しか無いリポジトリで `npm ci` は必ず失敗する。pnpm が用意できない場合は警告して `exit 0` (hook はセッションをブロックしない)

### metadataBase + appUrl フォールバック (B-6, C-10)

- `lib/env.ts` の解決順: `NEXT_PUBLIC_APP_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → (production なら throw / dev なら localhost)
- Vercel 上では env 未設定でも throw しない。Vercel 外の本番 (例: self-host) だけ明示設定を強制
- `app/layout.tsx` の `metadata.metadataBase` に接続し、OGP 相対 URL を絶対化

### CI と env ガードの関係 (実装中に確定)

- `metadataBase` は**ビルド時**に評価されるため、Vercel 外で env なしに `next build` すると
  lib/env.ts の本番ガードが throw する (これは意図通り — localhost で OGP が静かに壊れるより良い)
- CI では検証用ダミー `NEXT_PUBLIC_APP_URL=http://localhost:3000` を build step の env で注入する
- Vercel ビルドは `VERCEL_PROJECT_PRODUCTION_URL` が自動注入されるため何も要らない
- CI の push トリガーは main のみ (dev は pull_request 側で検証。二重実行を避ける)

### permissions deny ガード (C-8)

- `deny: ["Bash(git push origin main)", "Bash(git push --force:*)"]`
- 完全な防御ではない (`git push origin HEAD:main` 等は素通り)。ハウスルールの最低限ガードという位置づけ

### セキュリティヘッダ (D-14)

- `X-Content-Type-Options: nosniff` / `Referrer-Policy: strict-origin-when-cross-origin` / `X-Frame-Options: SAMEORIGIN`
- CSP はプロト段階では見送り (外部リソースの足し引きが激しい時期に CSP 管理コストが見合わない)。本番リリース時に検討
- Vercel Toolbar は same-origin 注入のため `SAMEORIGIN` と干渉しない

### CI (D-11)

- trigger: `push` (main / dev) + `pull_request`
- corepack 経由で packageManager ピンの pnpm を使用 (`corepack enable`)
- steps: install (frozen-lockfile) → `biome check` → `tsc --noEmit` → `next build`
- `next build` は `ignoreBuildErrors: true` で型エラーを素通りするため、typecheck を独立 step に置く

### Dependabot (D-16)

- npm (weekly) + github-actions (weekly)。Renovate ではなく GitHub ネイティブを採用 (追加サービス・鍵が不要)

## 対象外

- `.claude/settings.local.json` の掃除 (利用者ローカルの状態)
- CSP ヘッダ (上記)
- `.env.local` への変更
