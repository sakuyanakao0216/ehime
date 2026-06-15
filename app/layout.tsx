import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { publicEnv } from '@/lib/env'
import './globals.css'

// フォントはネットワーク非依存のシステムスタック (globals.css の --font-sans) を使う。
// next/font/google はビルド時に Google Fonts を取得しに行き、ネットワーク制限環境
// (CI / 一時障害) でビルドが落ちるため、テンプレ初期状態では採用しない。
// Web フォントを使いたくなったら next/font/local (フォントを同梱) が堅い。

export const metadata: Metadata = {
  // OGP 等の相対 URL を絶対化する基準。解決順は lib/env.ts (Vercel 上は env 未設定でも動く)
  metadataBase: new URL(publicEnv.appUrl),
  title: 'prototype',
  description: 'vercel-aiagent-coding-skill starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        {/* キーレス計測 (画面には何も出ない)。データは Vercel ダッシュボードの
            Analytics / Speed Insights タブで閲覧 (各タブで 1 回 Enable が必要)。
            Vercel 外・ローカルでは no-op。 */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
