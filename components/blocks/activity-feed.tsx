import { feed } from '@/lib/mock/data'
import type { FeedKind } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

const meta: Record<FeedKind, { emoji: string; className: string }> = {
  match: { emoji: '🤝', className: 'bg-orange-100 text-orange-600' },
  thanks: { emoji: '❤️', className: 'bg-rose-100 text-rose-600' },
  training: { emoji: '🎓', className: 'bg-emerald-100 text-emerald-600' },
  join: { emoji: '✨', className: 'bg-sky-100 text-sky-600' },
}

function rel(min: number) {
  if (min < 60) return `${min}分前`
  return `${Math.floor(min / 60)}時間前`
}

/** 県内のアクティビティフィード（見ているだけでワクワクする社会的証明）。 */
export function ActivityFeed({ className, limit }: { className?: string; limit?: number }) {
  const items = limit ? feed.slice(0, limit) : feed
  return (
    <div className={cn('space-y-2.5', className)}>
      {items.map((item) => {
        const m = meta[item.kind]
        return (
          <div
            key={item.id}
            className="bg-card lift flex items-start gap-3 rounded-2xl border p-3 text-sm shadow-sm"
          >
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full text-lg',
                m.className,
              )}
            >
              {m.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="leading-snug">{item.body}</p>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                <span className="bg-muted rounded-full px-2 py-0.5">{item.region}</span>
                <span>{rel(item.minutesAgo)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
