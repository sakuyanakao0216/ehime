# 要求事項 — 全体レビュー指摘の修正 + 追加機能 (20260611-review-fixes)

## 背景

テンプレ全体のコードレビューを実施し、バグ 3 件・docs と実体の不整合 3 件・小粒改善 4 件・追加機能候補 6 件を検出。利用者は「全部 (改善+追加機能も)」の適用を選択した。

## 要求

### A. バグ修正 (必須)

- A-1: `.claude/settings.json` の hook `timeout: 60000` → `60` (Claude Code の timeout は秒単位。60000 は約16.7時間)
- A-2: `session-start.sh` — `npm ci` フォールバックは package-lock.json が無く必ず失敗するため削除。`set -euo pipefail` 化。`corepack prepare pnpm@latest` の packageManager ピン (pnpm@9.15.0) との食い違い解消
- A-3: favicon 不在 (`/favicon.ico` が全ページ 404) → `app/icon.svg` を追加

### B. 不整合修正 (必須)

- B-4: Marketplace リンクを `sakuyanakao0216/...` → `FDE-project/...` に統一 (settings.json は変更済み・docs が未追随)。FDE-project 側に skill / starter 両 repo の存在を確認済み
- B-5: STARTER.md「同梱(最小)」が実体 (`ai` / `@ai-sdk/gateway` / `lib/ai.ts` 同梱済み) と不一致 → 追随
- B-6: `lib/env.ts` の `publicEnv.appUrl` が未使用で production ガードが機能していない → `metadataBase` に接続

### C. 改善

- C-7: autoprefixer 削除 (Tailwind v4 は Lightning CSS が prefix 処理)
- C-8: permissions 整理 (冗長 allow 削除・main 直 push の deny ガード追加)
- C-9: engines `20.x` → `>=20.9` (Next.js 16 最低要件)
- C-10: appUrl に Vercel env (`VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`) フォールバック

### D. 追加機能

- D-11: CI ワークフロー (biome check / typecheck / build)。`ignoreBuildErrors: true` の防波堤
- D-12: `app/error.tsx` / `app/not-found.tsx` (トークン準拠・最小)
- D-13: Vercel Analytics / Speed Insights (キーレス計測。データは Vercel ダッシュボードで閲覧)
- D-14: セキュリティヘッダ最小セット (CSP はプロト段階では見送り)
- D-15: PR テンプレート (プレビュー URL 運用に合わせる)
- D-16: Dependabot (npm + github-actions, weekly)

## 成功条件

- `pnpm check` / `pnpm typecheck` / `pnpm build` が全てグリーン
- `pnpm dev` で `/` 表示・favicon 200・存在しないパスで not-found 表示・セキュリティヘッダ付与を確認
- Draft PR + Vercel プレビュー URL の提示
