'use client'

import { eventsWithCoords, type SportEvent } from '@/lib/mock/events'
import { emojiFor } from '@/lib/visual'

/**
 * 簡易スポーツマップ（外部地図に依存しないスタイライズ版）。
 * 愛媛を北東→南西に見立てた背景に、イベントを種目絵文字ピンで配置。
 * 本番では地図SDK（要キー/ネットワーク）に差し替える前提。
 */
export function EventMap({ events }: { events: SportEvent[] }) {
  const pins = eventsWithCoords().filter((e) => events.some((x) => x.id === e.id))
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* 地域ラベル */}
      <span className="absolute top-3 right-4 text-xs font-bold text-sky-700/60">東予</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-700/50">
        中予
      </span>
      <span className="absolute bottom-4 left-6 text-xs font-bold text-orange-700/60">南予</span>
      {/* 海/陸のやわらかい帯 */}
      <div className="absolute inset-0 bg-[radial-gradient(40rem_30rem_at_70%_20%,theme(colors.sky.100),transparent)]" />

      {pins.map((e) => (
        <div
          key={e.id}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${e.coord.x}%`, top: `${e.coord.y}%` }}
        >
          <button
            type="button"
            className="lift flex size-9 items-center justify-center rounded-full border-2 border-white bg-white text-lg shadow-md"
            aria-label={e.title}
          >
            {emojiFor(e.activityId)}
          </button>
          {/* ホバーでタイトル */}
          <span className="bg-foreground text-background pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 rounded-md px-2 py-1 text-[11px] whitespace-nowrap group-hover:block">
            {e.title}
          </span>
        </div>
      ))}
    </div>
  )
}
