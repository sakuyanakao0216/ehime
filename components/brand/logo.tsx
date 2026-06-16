import { cn } from '@/lib/utils'

/**
 * スポえひめ ロゴマーク（SVG・スケーラブル）。
 * オレンジの角丸スクエアに、白いボールの軌道アーク＝「動く・参加する」を象徴。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="スポえひめ"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="9" style={{ fill: 'var(--brand)' }} />
      <path
        d="M7 23 Q14.5 22 18.5 12.5"
        fill="none"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="20.5" cy="10.5" r="3.1" fill="white" />
    </svg>
  )
}

/**
 * ロゴ（マーク＋ワードマーク）。`className` で文字色を指定（暗い画像上では text-white など）。
 * マークは常にブランドオレンジ。
 */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <LogoMark className={cn('size-7 shrink-0', markClassName)} />
      <span className="display text-base leading-none font-bold tracking-tight">スポえひめ</span>
    </span>
  )
}
