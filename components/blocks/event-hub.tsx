'use client'

import { List, MapIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EventCard } from '@/components/blocks/event-card'
import { EventMap } from '@/components/blocks/event-map'
import { activities } from '@/lib/mock/data'
import { type EventCategory, type EventWhen, events } from '@/lib/mock/events'
import { cn } from '@/lib/utils'
import { emojiFor } from '@/lib/visual'

const WHENS: (EventWhen | 'すべて')[] = ['すべて', '今日', '今週末', '今月']
const CATS: (EventCategory | 'すべて')[] = ['すべて', 'プロ観戦', '地域', '学校']

export function EventHub() {
  const [when, setWhen] = useState<EventWhen | 'すべて'>('すべて')
  const [cat, setCat] = useState<EventCategory | 'すべて'>('すべて')
  const [sport, setSport] = useState<string>('all')
  const [view, setView] = useState<'list' | 'map'>('list')

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
          <button
            type="button"
            onClick={() => setView('list')}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
              view === 'list' ? 'bg-brand text-white' : 'text-muted-foreground',
            )}
          >
            <List className="size-4" />
            リスト
          </button>
          <button
            type="button"
            onClick={() => setView('map')}
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
              view === 'map' ? 'bg-brand text-white' : 'text-muted-foreground',
            )}
          >
            <MapIcon className="size-4" />
            地図
          </button>
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
            {emojiFor(a.id)} {a.name}
          </Pill>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">{filtered.length}件のイベント</p>

      {view === 'map' ? (
        <EventMap events={filtered} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
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
        active ? 'bg-brand border-transparent text-white' : 'bg-card hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}
