import { cn } from '@/lib/utils'

/**
 * スポえひめ ロゴマーク（SVG・スケーラブル）。
 * 暖色グラデの角丸タイルに、立ち上がるアーク＋ボール＝「関わりが上がっていく」動きを象徴。
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
      {/* 立ち上がる軌道（関わりの階段＝成長） */}
      <path
        d="M9 29 C 15 30 23 27 29 13"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 軌道の起点と到達点 */}
      <circle cx="9" cy="29" r="2" fill="white" fillOpacity="0.7" />
      <circle cx="29.5" cy="12.5" r="4.2" fill="white" />
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
