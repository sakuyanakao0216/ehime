import type { LucideIcon } from 'lucide-react'
import { GraduationCap, Handshake, HeartHandshake, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { feed } from '@/lib/mock/data'
import type { FeedKind } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

const meta: Record<FeedKind, { icon: LucideIcon; label: string; className: string }> = {
  match: { icon: Handshake, label: 'マッチ', className: 'text-primary bg-primary/10' },
  thanks: {
    icon: HeartHandshake,
    label: '感謝',
    className: 'text-destructive bg-destructive/10',
  },
  training: {
    icon: GraduationCap,
    label: '研修',
    className: 'text-success bg-success/10',
  },
  join: { icon: UserPlus, label: '新規', className: 'text-info bg-info/10' },
}

function rel(min: number) {
  if (min < 60) return `${min}分前`
  return `${Math.floor(min / 60)}時間前`
}

/** 県内のアクティビティフィード（社会的証明・毎日アクセスしたくなる仕掛け）。 */
export function ActivityFeed({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {feed.map((item) => {
        const m = meta[item.kind]
        return (
          <div
            key={item.id}
            className="bg-card flex items-start gap-3 rounded-lg border p-3 text-sm"
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full',
                m.className,
              )}
            >
              <m.icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="leading-snug">{item.body}</p>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                <Badge variant="outline" className="px-1.5 py-0">
                  {item.region}
                </Badge>
                <span>{rel(item.minutesAgo)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
