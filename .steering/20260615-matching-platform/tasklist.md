# 実装タスク — 広域連携システム

> 作成日 2026-06-15。

## 環境 / 依存
- [x] 調査（user-research / competitive-analysis / insights）
- [x] 依存追加: lucide-react, radix primitives, cva, tw-animate-css, @faker-js/faker, zod
- [x] shadcn は registry が遮断されているため new-york ソースを `components/ui` に手配置

## デザイン
- [x] `app/globals.css` にみかんカラーのトークン（:root / .dark / @theme inline）
- [x] `app/icon.svg` をみかんモチーフへ差し替え

## UI 基盤（components/ui）
- [x] button, card, badge, input, label, textarea, select, tabs, avatar, progress, separator

## モックデータ（lib/mock）
- [x] regions / cities（愛媛の市町・地域区分）
- [x] activities（種目）
- [x] instructors（20名・信頼レイヤー・感謝の声・バッジ）
- [x] recruitments（12件・偏在が出る分布）
- [x] feed（アクティビティ）/ region-stats（充足率）
- [x] スコアリング関数（AIフォールバック兼用）

## ブロック（components/blocks）
- [x] サイトヘッダー / アクティビティフィード / 地域盛り上がりメーター
- [x] 指導者カード（信頼レイヤー）/ 募集カード / AI推薦パネル

## ページ
- [x] `/` ランディング
- [x] `/operator` ダッシュボード
- [x] `/operator/recruit/new` 募集作成 + AI推薦
- [x] `/instructors` 一覧 + フィルタ
- [x] `/instructor` 指導者マイページ

## コア機能
- [x] `app/api/match/route.ts`（generateObject + logAiUsage + フォールバック）

## 仕上げ
- [x] README をアプリ説明へ書き換え
- [x] `pnpm typecheck` / `pnpm build`（ローカルは NEXT_PUBLIC_APP_URL を付与。Vercel は自動）
- [x] スモークテスト（API フォールバック・各ページ 200・日本語名）
- [ ] commit & push（claude/eager-ramanujan-v1bjlc）
- [ ] （許可後）Draft PR → プレビュー URL 出力
