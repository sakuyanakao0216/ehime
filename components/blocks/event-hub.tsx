'use client'

import { CalendarDays, List, MapIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EventCalendar } from '@/components/blocks/event-calendar'
import { EventCard } from '@/components/blocks/event-card'
import { EventMap } from '@/components/blocks/event-map'
import { activities } from '@/lib/mock/data'
import { type EventCategory, type EventWhen, events } from '@/lib/mock/events'
import { cn } from '@/lib/utils'

const WHENS: (EventWhen | 'すべて')[] = ['すべて', '今日', '今週末', '今月']
const CATS: (EventCategory | 'すべて')[] = ['すべて', 'プロ観戦', '地域', '学校']

export function EventHub() {
  const [when, setWhen] = useState<EventWhen | 'すべて'>('すべて')
  const [cat, setCat] = useState<EventCategory | 'すべて'>('すべて')
  const [sport, setSport] = useState<string>('all')
  const [view, setView] = useState<'list' | 'calendar' | 'map'>('list')

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (when !== 'すべて' && e.when !== when) return false
        if (cat !== 'すべて' && e.category !== cat) return false
        if (sport !== 'all' && e.activityId !== sport) return false
        return true
      }),
    [when, cat, sport],
  )

  const sportsInUse = activities.filter((a) => events.some((e) => e.activityId === a.id))

  return (
    <div className="space-y-4">
      {/* いつ */}
      <div className="flex flex-wrap items-center gap-1.5">
        {WHENS.map((w) => (
          <Pill key={w} active={when === w} onClick={() => setWhen(w)}>
            {w}
          </Pill>
        ))}
        <div className="ml-auto flex rounded-full border p-0.5">
          <ViewBtn active={view === 'list'} onClick={() => setView('list')}>
            <List className="size-4" />
            リスト
          </ViewBtn>
          <ViewBtn active={view === 'calendar'} onClick={() => setView('calendar')}>
            <CalendarDays className="size-4" />
            カレンダー
          </ViewBtn>
          <ViewBtn active={view === 'map'} onClick={() => setView('map')}>
            <MapIcon className="size-4" />
            地図
          </ViewBtn>
        </div>
      </div>

      {/* カテゴリ */}
      <div className="flex flex-wrap gap-1.5">
        {CATS.map((c) => (
          <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Pill>
        ))}
      </div>

      {/* 種目 */}
      <div className="flex flex-wrap gap-1.5">
        <Pill active={sport === 'all'} onClick={() => setSport('all')}>
          すべての種目
        </Pill>
        {sportsInUse.map((a) => (
          <Pill key={a.id} active={sport === a.id} onClick={() => setSport(a.id)}>
            {a.name}
          </Pill>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">{filtered.length}件のイベント</p>

      {view === 'map' && <EventMap events={filtered} />}
      {view === 'calendar' && <EventCalendar events={filtered} />}
      {view === 'list' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}

function ViewBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
        active ? 'bg-foreground text-background' : 'text-muted-foreground',
      )}
    >
      {children}
    </button>
  )
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-foreground border-transparent text-background'
          : 'bg-card hover:border-foreground/40',
      )}
    >
      {children}
    </button>
  )
}
