'use client'

import { CalendarRange, Handshake } from 'lucide-react'
import { useState } from 'react'
import { CollabCard } from '@/components/blocks/collab-card'
import { EhimeHeatmap } from '@/components/blocks/ehime-heatmap'
import { EventCard } from '@/components/blocks/event-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { regionStats } from '@/lib/mock/data'
import { collabEvents, events } from '@/lib/mock/events'
import { cn } from '@/lib/utils'

const WHENS = ['すべて', '今日', '今週末', '今月'] as const
type When = (typeof WHENS)[number]

/**
 * トップのダッシュボード。
 * 現状サマリ → 時期フィルター → （左）盛り上がり＋偏りヒートマップ／（右）コラボ企画・イベントのタブ。
 * フィルターは地図とタブ内容に連動する。
 */
export function HomeBoard() {
  const [when, setWhen] = useState<When>('すべて')

  const evs = events.filter((e) => when === 'すべて' || e.when === when)
  const cols = collabEvents.filter((c) => when === 'すべて' || c.when === when)
  const avgFill = Math.round(
    regionStats.reduce((s, r) => s + r.fillRate, 0) / Math.max(1, regionStats.length),
  )
  const matches = regionStats.reduce((s, r) => s + r.recentMatches, 0)

  return (
    <div className="pt-8 sm:pt-10">
      {/* 現状サマリ */}
      <div className="label text-brand mb-3 flex items-center gap-3">
        <span className="bg-brand inline-block h-px w-8" />
        スポえひめ ・ 愛媛全域
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={evs.length} unit="件" label="イベント" />
        <Stat value={cols.length} unit="件" label="コラボ企画" />
        <Stat value={`${avgFill}%`} label="支え手の充足(平均)" />
        <Stat value={matches} unit="件" label="今月のマッチ" accent />
      </div>

      {/* 時期フィルター */}
      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <CalendarRange className="text-muted-foreground mr-1 size-4" />
        {WHENS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWhen(w)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              when === w
                ? 'bg-foreground border-transparent text-background'
                : 'bg-card hover:border-foreground/40',
            )}
          >
            {w}
          </button>
        ))}
      </div>

      {/* 左: 地図 / 右: タブ（フィルター連動） */}
      <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="lg:sticky lg:top-20">
          <EhimeHeatmap events={evs} />
        </div>

        <Tabs defaultValue="collab">
          <TabsList className="mb-4 w-full max-w-xs">
            <TabsTrigger value="collab" className="flex-1 gap-1.5">
              <Handshake className="size-4" />
              コラボ企画
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 gap-1.5">
              <CalendarRange className="size-4" />
              イベント
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collab">
            {cols.length ? (
              <div className="space-y-3">
                {cols.map((e) => (
                  <CollabCard key={e.id} event={e} />
                ))}
              </div>
            ) : (
              <Empty>この時期のコラボ企画はまだありません</Empty>
            )}
          </TabsContent>

          <TabsContent value="events">
            {evs.length ? (
              <div className="space-y-3">
                {evs.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            ) : (
              <Empty>この時期のイベントはまだありません</Empty>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Stat({
  value,
  unit,
  label,
  accent,
}: {
  value: number | string
  unit?: string
  label: string
  accent?: boolean
}) {
  return (
    <div className="card-soft p-4">
      <div className="flex items-baseline gap-0.5">
        <span className={cn('display text-3xl leading-none font-bold', accent && 'text-brand')}>
          {value}
        </span>
        {unit && <span className="text-muted-foreground text-sm font-medium">{unit}</span>}
      </div>
      <div className="text-muted-foreground mt-1.5 text-xs">{label}</div>
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground flex min-h-40 items-center justify-center rounded-xl border border-dashed p-8 text-center text-sm">
      {children}
    </div>
  )
}
