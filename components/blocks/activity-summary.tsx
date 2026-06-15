import type { LucideIcon } from 'lucide-react'
import { Dumbbell, Flame, HandHeart, Ticket, Volleyball } from 'lucide-react'
import { me } from '@/lib/mock/me'
import { cn } from '@/lib/utils'

const icons: Record<string, LucideIcon> = {
  gym: Dumbbell,
  watch: Ticket,
  join: Volleyball,
  help: HandHeart,
}

/** 自分のスポーツ活動のまとめ。ジム・観戦などの履歴をバーで可視化し、続けたくなる。 */
export function ActivitySummary() {
  const { activity } = me
  const max = Math.max(...activity.breakdown.map((b) => b.count), 1)
  const weekMax = Math.max(...activity.weekly, 1)
  return (
    <div className="bg-card border">
      {/* サマリー帯 */}
      <div className="flex items-center justify-between gap-4 border-b p-5">
        <div>
          <div className="label text-brand">My Activity</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="display text-3xl leading-none font-bold">{activity.monthTotal}</span>
            <span className="text-muted-foreground text-sm">回 / 今月</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm">
          <Flame className="text-brand size-4" />
          <span className="font-bold">{activity.streakWeeks}週連続</span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* 種別ごとのバー */}
        <div className="space-y-2.5">
          {activity.breakdown.map((b) => {
            const Icon = icons[b.key] ?? Volleyball
            return (
              <div key={b.key} className="flex items-center gap-3">
                <Icon className="text-muted-foreground size-4 shrink-0" />
                <span className="w-32 shrink-0 text-sm">{b.label}</span>
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-brand h-full rounded-full"
                    style={{ width: `${(b.count / max) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm font-bold">{b.count}</span>
              </div>
            )
          })}
        </div>

        {/* 週次の活動バー */}
        <div>
          <div className="label text-muted-foreground mb-2">この8週の活動</div>
          <div className="flex h-20 items-end gap-1.5">
            {activity.weekly.map((v, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: 週は固定順
                key={i}
                className={cn(
                  'flex-1 rounded-t-sm',
                  i === activity.weekly.length - 1 ? 'bg-brand' : 'bg-muted-foreground/30',
                )}
                style={{ height: `${(v / weekMax) * 100}%` }}
                title={`${v}回`}
              />
            ))}
          </div>
        </div>

        <p className="text-muted-foreground border-t pt-3 text-xs leading-relaxed">
          あなたの活動から、AI が次に楽しめそうなイベントを提案します。
        </p>
      </div>
    </div>
  )
}
