'use client'

import { useState } from 'react'
import { EventCard } from '@/components/blocks/event-card'
import { categoryMeta, type SportEvent } from '@/lib/mock/events'
import { cn } from '@/lib/utils'

// プロト想定の「今月」= 2026年6月。本日は 6/15。
const YEAR = 2026
const MONTH = 5 // 0-indexed June
const TODAY = 15

const pinColor: Record<string, string> = {
  プロ観戦: 'bg-foreground',
  地域: 'bg-muted-foreground',
  学校: 'bg-brand',
}

/** dateLabel から日付(日)を取り出す。「本日」は TODAY 扱い。 */
function dayOf(e: SportEvent): number {
  if (e.dateLabel.includes('本日')) return TODAY
  const m = e.dateLabel.match(/(\d+)\/(\d+)/)
  return m ? Number(m[2]) : TODAY
}

const WEEK = ['日', '月', '火', '水', '木', '金', '土']

export function EventCalendar({ events }: { events: SportEvent[] }) {
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate()
  const firstDow = new Date(YEAR, MONTH, 1).getDay()

  const byDay = new Map<number, SportEvent[]>()
  for (const e of events) {
    const d = dayOf(e)
    byDay.set(d, [...(byDay.get(d) ?? []), e])
  }

  const firstDayWithEvents = [...byDay.keys()].sort((a, b) => a - b)[0] ?? TODAY
  const [selected, setSelected] = useState<number>(firstDayWithEvents)

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const selectedEvents = byDay.get(selected) ?? []

  return (
    <div>
      <div className="bg-card rounded-lg border p-3 sm:p-4">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="display text-lg font-bold">2026年 6月</span>
          <span className="text-muted-foreground text-xs">愛媛のスポーツ</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {WEEK.map((w) => (
            <div key={w} className="text-muted-foreground py-1 text-center text-[11px] font-medium">
              {w}
            </div>
          ))}
          {cells.map((d, i) => {
            if (d === null)
              // biome-ignore lint/suspicious/noArrayIndexKey: 空セルは固定順
              return <div key={`empty-${i}`} />
            const evs = byDay.get(d) ?? []
            const has = evs.length > 0
            const isToday = d === TODAY
            const isSel = d === selected
            return (
              <button
                type="button"
                key={d}
                onClick={() => has && setSelected(d)}
                disabled={!has}
                className={cn(
                  'flex aspect-square flex-col items-center justify-center gap-1 rounded-md text-sm transition-colors',
                  isSel && has
                    ? 'bg-foreground text-background'
                    : has
                      ? 'hover:bg-muted'
                      : 'text-muted-foreground/50',
                )}
              >
                <span className={cn(isToday && !isSel && 'text-brand font-bold')}>{d}</span>
                {has && (
                  <span className="flex gap-0.5">
                    {evs.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={cn(
                          'size-1 rounded-full',
                          isSel ? 'bg-background' : pinColor[e.category],
                        )}
                      />
                    ))}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {/* 凡例 */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-xs">
          {(Object.keys(categoryMeta) as (keyof typeof categoryMeta)[]).map((c) => (
            <span key={c} className="text-muted-foreground flex items-center gap-1">
              <span className={cn('size-2 rounded-full', pinColor[c])} />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* 選択日のイベント */}
      <div className="mt-4">
        <div className="label text-muted-foreground mb-2">
          6月{selected}日（{WEEK[new Date(YEAR, MONTH, selected).getDay()]}）の予定
        </div>
        {selectedEvents.length === 0 ? (
          <p className="text-muted-foreground text-sm">予定はありません。</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
