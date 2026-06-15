import { stairway } from '@/lib/mock/me'
import { cn } from '@/lib/utils'

/**
 * 関わりの階段（Wheel A の中核）。
 * 観る → 参加 → ちょい手伝い → 継続 → 指導者。いまの位置と次の一歩を示す。
 */
export function Stairway({ current, progress }: { current: number; progress?: number }) {
  return (
    <div className="space-y-2">
      {stairway.map((s, i) => {
        const done = i < current
        const now = i === current
        return (
          <div
            key={s.key}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3 transition-colors',
              now
                ? 'bg-brand border-transparent text-white shadow-sm'
                : done
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-card opacity-70',
            )}
          >
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full text-lg',
                now ? 'bg-white/25' : 'bg-muted',
              )}
            >
              {s.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{s.label}</span>
                {done && <span className="text-xs text-emerald-600">✓ 達成</span>}
                {now && <span className="text-xs text-white/90">← いまここ</span>}
              </div>
              <p className={cn('text-xs', now ? 'text-white/90' : 'text-muted-foreground')}>
                {s.desc}
              </p>
              {now && typeof progress === 'number' && (
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
