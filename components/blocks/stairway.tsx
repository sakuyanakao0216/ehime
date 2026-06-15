import { stairway } from '@/lib/mock/me'
import { cn } from '@/lib/utils'

/**
 * 関わりの階段（Wheel A の中核）。観る → 参加 → ちょい手伝い → 継続 → 指導者。
 * エディトリアルに番号＋ヘアラインで表現。
 */
export function Stairway({ current, progress }: { current: number; progress?: number }) {
  return (
    <ol className="border-border divide-border divide-y border-y">
      {stairway.map((s, i) => {
        const done = i < current
        const now = i === current
        return (
          <li
            key={s.key}
            className={cn('flex items-center gap-3 py-3', !done && !now && 'opacity-45')}
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                now
                  ? 'bg-foreground text-background'
                  : done
                    ? 'border-brand text-brand border'
                    : 'border-border text-muted-foreground border',
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{s.label}</span>
                {now && <span className="label text-brand">いまここ</span>}
              </div>
              <p className="text-muted-foreground text-xs">{s.desc}</p>
              {now && typeof progress === 'number' && (
                <div className="bg-muted mt-1.5 h-1 w-full overflow-hidden rounded-full">
                  <div className="bg-brand h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
