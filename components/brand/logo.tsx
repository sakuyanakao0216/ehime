import { cn } from '@/lib/utils'

/**
 * スポえひめ ロゴマーク（SVG・スケーラブル）。
 * 暖色グラデの角丸タイルに、瀬戸内海の波＋つながる3つの点（人）＝「地域でつながる」を象徴。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="スポえひめ"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spo-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="color-mix(in oklch, var(--brand) 72%, white)" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#spo-logo-g)" />
      {/* つながり（人が結ばれる） */}
      <path
        d="M11 16.5 Q20 11 29 16.5"
        fill="none"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="11" cy="16.5" r="2.3" fill="white" />
      <circle cx="20" cy="12" r="2.7" fill="white" />
      <circle cx="29" cy="16.5" r="2.3" fill="white" />
      {/* 瀬戸内海の波（二重） */}
      <path
        d="M7 27 q4.5 -3 9 0 t9 0 t9 0"
        fill="none"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M7 31 q4.5 -2.6 9 0 t9 0 t9 0"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

/**
 * ロゴ（マーク＋ワードマーク）。`className` で文字色を指定（暗い画像上では text-white など）。
 * マークは常にブランドオレンジ。
 */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className={cn('size-8 shrink-0', markClassName)} />
      <span className="display text-lg leading-none font-extrabold tracking-tight">
        スポ<span className="text-brand">えひめ</span>
      </span>
    </span>
  )
}
