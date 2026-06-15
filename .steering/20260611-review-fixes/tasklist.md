# 実装内容詳細 — 全体レビュー指摘の修正 + 追加機能 (20260611-review-fixes)

commit は A / B / C / D のグループ単位で分割。

## A. バグ修正

- [ ] `.claude/settings.json` — hook timeout `60000` → `60`
- [ ] `.claude/hooks/session-start.sh` — `set -euo pipefail` / `corepack prepare --activate` / npm フォールバック削除
- [ ] `app/icon.svg` — 新規 (ニュートラルな汎用マーク)

## B. 不整合修正

- [ ] `AGENTS.md` / `docs/STARTER.md` / `README.md` — `sakuyanakao0216/` → `FDE-project/` 全リンク統一
- [ ] `docs/STARTER.md` — 同梱リストに `ai` / `@ai-sdk/gateway` / `lib/ai.ts` を反映
- [ ] `app/layout.tsx` — `metadataBase: new URL(publicEnv.appUrl)` 追加

## C. 改善

- [ ] `postcss.config.mjs` / `package.json` — autoprefixer 削除
- [ ] `.claude/settings.json` — `Bash(pnpm dlx shadcn@latest *)` 削除・deny ガード追加
- [ ] `package.json` — engines `>=20.9`
- [ ] `lib/env.ts` — Vercel env フォールバック

## D. 追加機能

- [ ] `.github/workflows/ci.yml` — install → biome check → typecheck → build
- [ ] `app/error.tsx` / `app/not-found.tsx` — トークン準拠の最小画面
- [ ] `package.json` + `app/layout.tsx` — `@vercel/analytics` / `@vercel/speed-insights`
- [ ] `next.config.mjs` — セキュリティヘッダ 3 種
- [ ] `.github/pull_request_template.md`
- [ ] `.github/dependabot.yml`

## ドキュメント追随

- [ ] `AGENTS.md` — 「土台」リストに error/not-found/icon/.github を追記
- [ ] `docs/STARTER.md` — CI / PR テンプレ / Analytics (ダッシュボードで Enable) を反映

## 検証

- [ ] `pnpm install` / `pnpm check` / `pnpm typecheck` / `pnpm build`
- [ ] `bash -n session-start.sh` + `CLAUDE_CODE_REMOTE=true` ドライラン
- [ ] `pnpm dev` — `/` 200 / favicon 200 / 404 ページ / `curl -I` でヘッダ確認
- [ ] push → Draft PR → プレビュー URL 提示
