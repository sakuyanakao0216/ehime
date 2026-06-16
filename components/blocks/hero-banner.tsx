'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'
import { ActivityIcon } from '@/components/activity-icon'
import { Button } from '@/components/ui/button'
import { activityById, cityById } from '@/lib/mock/data'
import { type CrossEvent, crossEvents, type ParticipantRole } from '@/lib/mock/events'
import { cn } from '@/lib/utils'

function RoleChips({ roles }: { roles: ParticipantRole[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((r) => (
        <span
          key={r}
          className={cn(
            'border-border rounded-full border px-2.5 py-0.5 text-xs',
            r === 'プロ' && 'text-brand border-brand/40',
          )}
        >
          {r}
        </span>
      ))}
    </div>
  )
}

/** 開催ラインに対するゲージ（成立型）。 */
function OpenGauge({ joined, min }: { joined: number; min: number }) {
  const open = joined >= min
  const pct = Math.min(100, Math.round((joined / min) * 100))
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        {open ? (
          <span className="text-brand flex items-center gap-1 font-bold">
            <Check className="size-4" />
            開催決定
          </span>
        ) : (
          <span className="font-bold">あと{min - joined}人で開催</span>
        )}
        <span className="text-muted-foreground text-xs">
          {joined}/{min}人
        </span>
      </div>
      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={cn('h-full rounded-full transition-all', open ? 'bg-brand' : 'bg-foreground')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function FeaturedBanner({ event }: { event: CrossEvent }) {
  const [joined, setJoined] = useState(event.joined)
  const [done, setDone] = useState(false)
  const act = activityById(event.activityId)
  const city = cityById(event.cityId)
  const open = joined >= event.minToOpen
  const justOpened = done && open && event.joined < event.minToOpen

  return (
    <article className="card-soft grid overflow-hidden sm:grid-cols-[1.5fr_1fr]">
      <div className="p-7 sm:p-9">
        <div className="label text-brand flex items-center gap-2">
          <span className="bg-brand inline-block size-1.5 rounded-full" />
          AI 提案 ・ 集まれば開催
        </div>
        <h2 className="display mt-3 text-2xl leading-snug font-bold sm:text-3xl">{event.title}</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{event.blurb}</p>

        <div className="mt-4">
          <RoleChips roles={event.roles} />
        </div>

        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span>{event.dateLabel}</span>
          <span>{city?.name}</span>
        </div>

        <p className="border-brand text-foreground/80 mt-4 border-l-2 pl-3 text-xs leading-relaxed">
          <span className="label text-brand mr-1">AI</span>
          {event.aiReason}
        </p>

        {/* 成立ゲージ */}
        <div className="mt-5">
          <OpenGauge joined={joined} min={event.minToOpen} />
        </div>

        {justOpened ? (
          <div className="animate-pop mt-4 flex items-center gap-1.5 text-sm font-medium">
            <Check className="text-brand size-4" />
            あなたの参加で開催が決定しました。
          </div>
        ) : done ? (
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium">
            <Check className="text-brand size-4" />
            参加を登録しました{open ? '' : '。開催ラインまであと少し！'}
          </div>
        ) : (
          <div className="mt-5 flex gap-2">
            <Button
              onClick={() => {
                setJoined((n) => n + 1)
                setDone(true)
              }}
            >
              参加する
            </Button>
            <Button variant="outline">くわしく</Button>
          </div>
        )}
      </div>

      {/* ビジュアルパネル */}
      <div className="bg-muted relative hidden flex-col items-center justify-center gap-3 border-l sm:flex">
        <div className="text-foreground/70">
          {act && <ActivityIcon name={act.icon} className="size-16" />}
        </div>
        <div className="text-center">
          <div className="label text-muted-foreground">Next Event</div>
          <div className="display mt-1 text-lg font-bold">{event.dateLabel}</div>
        </div>
      </div>
    </article>
  )
}

/**
 * トップバナー: AI が企画し「人数が集まったら開催」する交流イベント（学生×社会人×プロ）。
 * “見るだけ”の情報まとめと違い、参加で開催が動く＝関わりを創るUXを最初に示す。
 */
export function HeroBanner() {
  const [featured, ...rest] = crossEvents
  return (
    <div>
      <FeaturedBanner event={featured} />

      {/* 企画中の交流イベント */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {rest.map((e) => {
          const a = activityById(e.activityId)
          const c = cityById(e.cityId)
          const open = e.joined >= e.minToOpen
          return (
            <article key={e.id} className="lift card-soft flex items-start gap-3 p-4">
              <div className="bg-muted text-foreground/70 flex size-11 shrink-0 items-center justify-center rounded-xl">
                {a && <ActivityIcon name={a.icon} className="size-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="display text-sm leading-snug font-bold">{e.title}</h3>
                <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                  <span>{e.dateLabel}</span>
                  <span>{c?.name}</span>
                  <span className={cn('font-medium', open ? 'text-brand' : 'text-foreground')}>
                    {open ? '開催決定' : `あと${e.minToOpen - e.joined}人で開催`}
                  </span>
                </div>
                <div className="mt-2">
                  <RoleChips roles={e.roles} />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
