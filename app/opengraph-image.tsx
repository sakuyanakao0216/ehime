import { ImageResponse } from 'next/og'

// 共有リンク用の OG 画像（キーレス・ビルド/実行時に生成）。
// 日本語フォントを同梱しないため、確実に描画できるラテン文字でブランドを表現する。
// 日本語のタイトル/説明はページ metadata 側（link カードのテキスト）で伝わる。

export const alt = 'スポえひめ — All Ehime Sports'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  const ink = '#26221d'
  const brand = '#e2592a'
  const bg = '#faf8f4'
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: bg,
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: brand,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 6,
        }}
      >
        <div style={{ width: 56, height: 4, backgroundColor: brand }} />
        ALL EHIME SPORTS
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ display: 'flex', fontSize: 132, fontWeight: 800, color: ink, letterSpacing: -3 }}
        >
          Sport
          <span style={{ color: brand }}>Ehime</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 40, fontWeight: 600, color: ink }}>
          Watch. Do. Support.
        </div>
      </div>

      <div style={{ fontSize: 30, color: '#6b645b', maxWidth: 940 }}>
        AI creates the places to take part — turning fans into the people who support local sport.
      </div>
    </div>,
    { ...size },
  )
}
