# Deploy Guide — {{PROJECT_NAME}}

## 初回 Vercel project セットアップ (ブラウザ操作)

1. https://vercel.com/new → **Import Git Repository** で対象 repo を選択 → Deploy
2. 初回 deploy は scaffold 未取り込みなら fail / 空ページ (想定通り)
3. Project Settings:
   - **Toolbar → Pre-Production Deployments** を `Enabled` (Production も任意)
   - **Git → Production Branch** が `main` であること
   - **Region** は `hnd1` (東京) 推奨

## 通常デプロイの流れ

```
feat/* branch → push → Vercel が Preview deploy 自動生成
                ↓
       Draft PR を作成 (Auto-fix を使うなら必須)
                ↓
       Preview URL でレビュー + Toolbar コメント
                ↓
       PR を Ready → main にマージ
                ↓
       main への push で Vercel Production にデプロイ
```

## デプロイ前チェックリスト (推奨: `/deploy-check` Plugin で自動化)

- [ ] `{{PACKAGE_MANAGER}} typecheck` パス
- [ ] `{{PACKAGE_MANAGER}} lint` パス
- [ ] `{{PACKAGE_MANAGER}} build` パス
- [ ] `console.log` を本番コードに残していない
- [ ] `.env*` を commit していない
- [ ] `next.config.mjs` の `ignoreBuildErrors` / `unoptimized` を本番モードで見直したか

## 環境変数

- Vercel Project Settings → Environment Variables で Production / Preview / Development に登録
- ローカル開発は `.env.local` (gitignore 済み) に書く
- 取得は `vercel env pull` で `.env.local` に同期

## デプロイ後の動作確認

1. Production URL を開いて golden path を踏む
2. Vercel Toolbar で Lighthouse スコア確認
3. 主要ログ (Functions / Edge / Build) でエラーがないこと
