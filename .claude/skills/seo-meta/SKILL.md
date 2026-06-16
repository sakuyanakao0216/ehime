---
name: seo-meta
description: SEO・メタデータ・シェア時の見栄えを整備するスキル。「SEO」「メタタグ」「OGP」「OG画像」「Twitter Card」「サムネイル」「sitemap」「robots.txt」「favicon」「アプリアイコン」「構造化データ」「JSON-LD」「URL共有したときの見た目」「/seo-meta」などのキーワードでトリガする。Next.js App Router の Metadata API で title/description/OGP/Twitter Card を設定し、app/sitemap.ts・app/robots.ts・favicon/app icon・構造化データ (JSON-LD) を整備する。ピッチ用プロトでは「URL を Slack/X に貼った時の見栄え」が第一印象を決めるため、公開・共有の前（体験フロー⑨リリース）に起動する。
allowed-tools: [Bash, Read, Write, Edit]
---

# seo-meta

## このスキルが解決すること

URL を共有した瞬間に「タイトルなし・画像なしの素っ気ないカード」が出ると、ピッチ前に損をする。**共有時の見栄え**と検索の最低限を、Metadata API で一括整備する。

1. **title / description**: ルート + ページ別（`generateMetadata` で動的に）
2. **OGP / Twitter Card**: 共有カードの画像・文言（`opengraph-image` / `metadataBase`）
3. **sitemap / robots**: `app/sitemap.ts` / `app/robots.ts`（プレビュー環境は noindex）
4. **favicon / app icon**: `app/` 配下のファイル規約で配置
5. **構造化データ**: JSON-LD（schema.org）を必要なページにだけ

## 起動方法

### slash command
`/seo-meta [meta|ogp|sitemap|icons|jsonld]` で起動。

### 自律起動
「OGP 設定して」「シェアした時のサムネイルがない」「sitemap 作って」「SEO 整えて」などで自動起動。

## 整備項目（[metadata-patterns.md](./references/metadata-patterns.md)）

| 項目 | 場所 | ポイント |
|---|---|---|
| 静的 metadata | `app/layout.tsx` / `page.tsx` | `title.template` でサイト名を統一 |
| 動的 metadata | `generateMetadata` | 詳細ページのデータから title/OG を生成 |
| OG 画像 | `app/opengraph-image.tsx` or 静的画像 | 1200x630 推奨 / `metadataBase` 必須 |
| sitemap/robots | `app/sitemap.ts` / `app/robots.ts` | 動的ページも列挙 / プレビューは noindex |
| アイコン | `app/favicon.ico` / `icon.png` / `apple-icon.png` | ファイル規約で自動配信 |
| JSON-LD | 該当ページに script 埋め込み | リッチリザルトテストで検証 |

## やってはいけないこと

- `metadataBase` 未設定のまま相対パスで OG 画像を指定（共有カードに画像が出ない）
- プレビュー/開発環境を index 可能なまま公開（robots で除外）
- 全ページ同一の title/description（共有カードが区別不能）
- 効果の薄いページにまで JSON-LD を盛る（型が合わず警告だけ増える）

## 周辺

- `deploy-preflight`: 公開前チェックの一環としてここを通す
- `design-review`: 画面内の見た目（こちらは共有・検索面の見た目）
- `image-gen`: OG 画像の素材生成
- `pitch-review`: ピッチで共有する URL の最終確認
