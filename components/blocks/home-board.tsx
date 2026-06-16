'use client'

import { CalendarRange, Handshake } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { CollabCard } from '@/components/blocks/collab-card'
import { EhimeHeatmap } from '@/components/blocks/ehime-heatmap'
import { EventCard } from '@/components/blocks/event-card'
import { HighlightsStrip } from '@/components/blocks/highlights-strip'
import { SocialFeed } from '@/components/blocks/social-feed'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { collabEvents, events } from '@/lib/mock/events'
import { cn } from '@/lib/utils'

const WHENS = ['すべて', '今日', '今週末', '今月'] as const
type When = (typeof WHENS)[number]

/** おすすめを先頭に並べる。 */
const recoFirst = <T extends { recommended?: boolean }>(a: T, b: T) =>
  Number(!!b.recommended) - Number(!!a.recommended)

/**
 * トップのダッシュボード。
 * スポーツハイライト → 時期フィルター →（左）盛り上がり＋偏りヒートマップ／（右）SNS投稿 →
 * 下に コラボ企画・イベントのタブ。フィルターは地図とタブ内容に連動する。
 */
export function HomeBoard() {
  const [when, setWhen] = useState<When>('すべて')

  const evs = events.filter((e) => when === 'すべて' || e.when === when).sort(recoFirst)
  const cols = collabEvents.filter((c) => when === 'すべて' || c.when === when).sort(recoFirst)

  return (
    <div className="pt-6 sm:pt-8">
      {/* ヒーロービジュアル（生成画像） */}
      <div className="relative mb-8 h-44 overflow-hidden rounded-2xl sm:h-60">
        <Image
          src="/images/generated/hero.png"
          alt="愛媛のスポーツ"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-5 sm:bottom-5 sm:left-6">
          <div className="label text-white/85">All Ehime Sports</div>
          <div className="display mt-1 text-2xl font-bold text-white sm:text-3xl">
            観る、する、<span className="text-brand">ささえる。</span>
          </div>
        </div>
      </div>

      {/* スポーツハイライト（直近の出来事・ニュース） */}
      <HighlightsStrip />

      {/* 時期フィルター（地図・タブに連動） */}
      <div className="mt-6 flex flex-wrap items-center gap-1.5">
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

      {/* 左: 地図（やや大きめ） / 右: SNS投稿（細長・高さを合わせて内部スクロール） */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.7fr_1fr] lg:items-stretch">
        <EhimeHeatmap events={evs} />

        <div className="card-soft flex min-h-0 flex-col overflow-hidden p-4">
          <div className="mb-3 flex shrink-0 items-center gap-2">
            <span className="label text-brand">みんなの投稿</span>
            <span className="text-muted-foreground text-xs">X / Instagram</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <SocialFeed />
          </div>
        </div>
      </div>

      {/* 下: コラボ企画・イベント（フィルター連動） */}
      <div className="mt-10">
        <Tabs defaultValue="collab">
          <TabsList className="mb-5 w-full max-w-xs">
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
              <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="grid gap-3 sm:grid-cols-2">
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

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground flex min-h-40 items-center justify-center rounded-xl border border-dashed p-8 text-center text-sm">
      {children}
    </div>
  )
}
