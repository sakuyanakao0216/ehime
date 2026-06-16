# Metadata API パターン集

Next.js App Router の代表 3 パターン + 周辺ファイル。共有カードが正しく出ることを最優先に確認する。

## 1. 静的 metadata（app/layout.tsx）

```ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'), // OG 画像の絶対 URL 化に必須
  title: {
    default: 'サービス名',
    template: '%s | サービス名', // 子ページの title に自動付与
  },
  description: '1〜2文でサービスの価値を書く（共有カードに出る）',
  openGraph: {
    title: 'サービス名',
    description: '共有カード用の説明',
    siteName: 'サービス名',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

- `metadataBase` を忘れると相対パスの OG 画像が解決されず、カードに画像が出ない
- 本番 URL は env（`NEXT_PUBLIC_SITE_URL` 等）から組み立てると環境差分に強い

## 2. 動的 metadata（generateMetadata）

詳細ページでデータから title/OG を生成する。

```ts
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const item = await getItem(id) // page と同じ fetch はキャッシュで重複しない
  if (!item) return { title: '見つかりません' }
  return {
    title: item.title, // layout の template でサイト名が付く
    description: item.summary,
    openGraph: { title: item.title, description: item.summary },
  }
}
```

## 3. OG 画像（app/opengraph-image.tsx）

`next/og` の `ImageResponse` でコード生成。静的画像（`app/opengraph-image.png`）でも可。

```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', color: '#fff', fontSize: 64 }}>
      サービス名
    </div>,
    size,
  )
}
```

- 1200x630 が各 SNS で安全なサイズ
- 動的ルート配下に置けばページごとの OG 画像も作れる

## 4. sitemap.ts / robots.ts

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://example.com', lastModified: new Date() },
    // 動的ページは fetch して列挙
  ]
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

- プレビュー/開発環境は `disallow: '/'` か `robots: { index: false }` で除外（Vercel のプレビューはデフォルトで noindex ヘッダが付くが、本番 URL と取り違えないこと）

## 5. アイコン（ファイル規約）

| ファイル | 用途 |
|---|---|
| `app/favicon.ico` | ブラウザタブ |
| `app/icon.png` | 汎用アイコン（サイズ違いを複数置ける） |
| `app/apple-icon.png` | iOS ホーム画面 |

置くだけで `<head>` に自動で link が入る。

## 6. JSON-LD（構造化データ）

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite', // Article / Product / FAQPage 等、内容に合う型を選ぶ
  name: 'サービス名',
  url: 'https://example.com',
}

// ページ JSX 内
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

- 型ごとの必須プロパティは schema.org / Google 検索セントラルで確認

## 確認手順

- 共有カード: X / Slack / LINE に実 URL を貼って実物確認（各 SNS の card validator も利用）
- 構造化データ: Google のリッチリザルトテストで検証
- `<head>` の出力: `curl -s <url> | grep -i 'og:'` で og タグの有無を機械確認

> Metadata API のフィールドは Next.js のバージョンで増減がある。細部は公式ドキュメント（Metadata Files / generateMetadata）で確認すること。
