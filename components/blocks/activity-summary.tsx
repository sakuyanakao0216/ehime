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
    <div className="card-soft overflow-hidden">
      {/* サマリー帯 */}
      <div className="flex items-center justify-between gap-4 border-b p-5">
        <div>
          <div className="label text-brand">My Activity</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="display text-3xl leading-none font-bold">{activity.monthTotal}</span>
            <span className="text-muted-foreground text-sm">回 / 今月</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm">
          <Flame className="text-brand size-4" />
          <span className="font-bold">{activity.streakWeeks}週連続</span>
        </div>
      </div>

      <div className="space-y-6 p-5">
        {/* 種別ごとのバー */}
        <div className="space-y-3">
          {activity.breakdown.map((b) => {
            const Icon = icons[b.key] ?? Volleyball
            return (
              <div key={b.key} className="flex items-center gap-3">
                <div className="bg-brand/10 text-brand flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-4" />
                </div>
                <span className="w-28 shrink-0 text-sm font-medium sm:w-36">{b.label}</span>
                <div className="bg-secondary relative h-2.5 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-brand h-full rounded-full"
                    style={{ width: `${(b.count / max) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm">
                  <span className="font-bold">{b.count}</span>
                  <span className="text-muted-foreground text-xs">回</span>
                </span>
              </div>
            )
          })}
        </div>

        {/* 週次の活動バー */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="label text-muted-foreground">この8週の活動</div>
            <div className="text-muted-foreground text-xs">単位: 回</div>
          </div>
          <div className="flex h-24 items-end gap-2 pt-4">
            {activity.weekly.map((v, i) => {
              const last = i === activity.weekly.length - 1
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: 週は固定順
                  key={i}
                  className={cn(
                    'relative flex-1 rounded-t-md transition-all',
                    last ? 'bg-brand' : 'bg-brand/25',
                  )}
                  style={{ height: `${Math.max(8, (v / weekMax) * 100)}%` }}
                  title={`${v}回`}
                >
                  <span
                    className={cn(
                      'absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold',
                      last ? 'text-brand' : 'text-muted-foreground',
                    )}
                  >
                    {v}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="text-muted-foreground mt-1.5 flex justify-between text-[10px]">
            <span>8週前</span>
            <span>今週</span>
          </div>
        </div>

        <p className="text-muted-foreground border-t pt-3 text-xs leading-relaxed">
          あなたの活動から、AI が次に楽しめそうなイベントを提案します。
        </p>
      </div>
    </div>
  )
}
