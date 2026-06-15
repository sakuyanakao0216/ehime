import { cn } from '@/lib/utils'

/** 「いま誰の画面か」を明示するバナー。ユーザーの迷子を防ぐ。 */
export function RoleBanner({
  emoji,
  roleLabel,
  description,
  gradient = 'from-orange-400 to-rose-500',
}: {
  emoji: string
  roleLabel: string
  description: string
  gradient?: string
}) {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-sm',
          gradient,
        )}
      >
        {emoji}
      </span>
      <div>
        <div className="text-muted-foreground text-xs font-medium">{roleLabel}の画面</div>
        <p className="text-sm leading-snug font-medium">{description}</p>
      </div>
    </div>
  )
}
