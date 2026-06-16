'use client'

import { useState } from 'react'
import { categoryMeta, EHIME_PATH, eventsWithCoords, type SportEvent } from '@/lib/mock/events'
import { cn } from '@/lib/utils'

/** カテゴリ別のピン色（モノトーン＋差し色）。 */
const pinColor: Record<string, string> = {
  プロ観戦: 'bg-foreground',
  地域: 'bg-muted-foreground',
  学校: 'bg-brand',
}

/**
 * 愛媛県の地図ビュー（外部地図SDKに依存しないスタイライズ版）。
 * 県のシルエット上にイベントをカテゴリ色のピンで配置。本番では地図SDKに差し替え。
 */
export function EventMap({ events }: { events: SportEvent[] }) {
  const [active, setActive] = useState<string | null>(null)
  const pins = eventsWithCoords().filter((e) => events.some((x) => x.id === e.id))

  return (
    <div className="bg-card relative overflow-hidden rounded-2xl border p-3">
      <div className="relative aspect-[100/75] w-full">
        <svg
          viewBox="0 0 100 75"
          className="h-full w-full"
          role="img"
          aria-label="愛媛県のスポーツイベント地図"
        >
          <title>愛媛県マップ</title>
          <path
            d={EHIME_PATH}
            className="fill-muted stroke-border"
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
        </svg>

        {/* ピン */}
        {pins.map((e) => (
          <button
            type="button"
            key={e.id}
            onClick={() => setActive(active === e.id ? null : e.id)}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${e.coord.x}%`, top: `${(e.coord.y / 75) * 100}%` }}
            aria-label={e.title}
          >
            <span
              className={cn(
                'block size-3 rounded-full border-2 border-white shadow transition-transform group-hover:scale-125',
                pinColor[e.category] ?? 'bg-primary',
                active === e.id && 'scale-125 ring-2 ring-offset-1',
              )}
            />
            {active === e.id && (
              <span className="bg-foreground text-background absolute bottom-full left-1/2 z-10 mb-1 w-40 -translate-x-1/2 rounded-lg px-2 py-1.5 text-[11px] leading-snug shadow-lg">
                <span className="font-bold">{e.title}</span>
                <br />
                {e.cityName}・{e.dateLabel}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 凡例 */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
        {(Object.keys(categoryMeta) as (keyof typeof categoryMeta)[]).map((c) => (
          <span key={c} className="text-muted-foreground flex items-center gap-1">
            <span className={cn('size-2.5 rounded-full', pinColor[c])} />
            {c}
          </span>
        ))}
        <span className="text-muted-foreground/70">ピンをタップで詳細</span>
      </div>
    </div>
  )
}
