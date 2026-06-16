'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cities, regionStats } from '@/lib/mock/data'
import { cityCoords, EHIME_PATH, eventsWithCoords, type SportEvent } from '@/lib/mock/events'
import type { Region } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

/** 充足率の色（偏在の見える化）。低いほど「応援募集中」。 */
function regionTone(fill: number) {
  if (fill >= 70)
    return { badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600', label: 'いい感じ' }
  if (fill >= 50)
    return { badge: 'border-amber-500/40 bg-amber-500/10 text-amber-600', label: 'もう少し' }
  return { badge: 'border-rose-500/40 bg-rose-500/10 text-rose-600', label: '応援募集中' }
}

/** 地域の中心座標（その地域の市町座標の平均）。偏在ラベルの配置に使う。 */
function regionCenter(region: Region) {
  const cs = cities.filter((c) => c.region === region && cityCoords[c.id])
  const n = cs.length || 1
  const x = cs.reduce((s, c) => s + cityCoords[c.id].x, 0) / n
  const y = cs.reduce((s, c) => s + cityCoords[c.id].y, 0) / n
  return { x, y }
}

/**
 * 愛媛のいま — イベントの「盛り上がり」をヒートで、支え手の「偏り」を数字で。
 * 濃い（オレンジが強い）ほどイベントが集中 ＝ 盛り上がっている。
 * 地域バッジ（充足率%）で、支え手が足りない地域が一目でわかる。
 */
export function EhimeHeatmap({ events }: { events: SportEvent[] }) {
  const [active, setActive] = useState<string | null>(null)
  const pins = eventsWithCoords().filter((e) => events.some((x) => x.id === e.id))

  // 市町ごとのイベント数（ヒートの濃淡）
  const counts = new Map<string, number>()
  for (const e of pins) counts.set(e.cityId, (counts.get(e.cityId) ?? 0) + 1)
  const maxCount = Math.max(1, ...counts.values())
  const blobs = [...counts.entries()]
    .map(([cityId, count]) => ({ cityId, count, coord: cityCoords[cityId] }))
    .filter((b) => b.coord)

  return (
    <div className="card-soft relative overflow-hidden p-3 sm:p-4">
      <div className="bg-muted relative aspect-[100/75] w-full overflow-hidden rounded-xl">
        {/* 瀬戸内海の背景（さりげなく）。主役は愛媛の地図シルエット */}
        <Image
          src="/images/generated/sea.png"
          alt=""
          fill
          sizes="640px"
          className="object-cover opacity-30"
        />
        <div className="bg-background/40 absolute inset-0" />

        <svg
          viewBox="0 0 100 75"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="愛媛県のスポーツ盛り上がりマップ"
          style={{ filter: 'drop-shadow(0 1px 3px oklch(0.2 0.03 240 / 0.2))' }}
        >
          <title>愛媛県マップ</title>
          <path
            d={EHIME_PATH}
            className="fill-card stroke-border"
            strokeWidth={0.5}
            strokeLinejoin="round"
          />
        </svg>

        {/* ヒート（盛り上がり）: イベント密度で濃淡＋最盛地は脈動 */}
        {blobs.map((b) => {
          const ratio = b.count / maxCount
          const size = 14 + ratio * 26 // %（コンテナ幅基準）
          const hottest = b.count === maxCount
          return (
            <span
              key={b.cityId}
              className={cn(
                'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-md',
                hottest && 'animate-pulse',
              )}
              style={{
                left: `${b.coord.x}%`,
                top: `${(b.coord.y / 75) * 100}%`,
                width: `${size}%`,
                aspectRatio: '1',
                background:
                  'radial-gradient(closest-side, color-mix(in oklch, var(--brand) 60%, transparent), transparent)',
                opacity: 0.2 + ratio * 0.55,
              }}
            />
          )
        })}

        {/* イベントピン（タップで詳細） */}
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
                'bg-brand block size-2.5 rounded-full border-2 border-white shadow transition-transform group-hover:scale-150',
                active === e.id && 'scale-150 ring-2 ring-offset-1',
              )}
            />
            {active === e.id && (
              <span className="bg-foreground text-background absolute bottom-full left-1/2 z-20 mb-1 w-40 -translate-x-1/2 rounded-lg px-2 py-1.5 text-[11px] leading-snug shadow-lg">
                <span className="font-bold">{e.title}</span>
                <br />
                {e.cityName}・{e.dateLabel}
              </span>
            )}
          </button>
        ))}

        {/* 偏在（支え手の充足率）: 地域バッジを地図に重ねる */}
        {regionStats.map((s) => {
          const c = regionCenter(s.region)
          const t = regionTone(s.fillRate)
          return (
            <div
              key={s.region}
              className={cn(
                'absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-0.5 text-center text-[11px] font-bold shadow-sm backdrop-blur-sm',
                t.badge,
              )}
              style={{ left: `${c.x}%`, top: `${(c.y / 75) * 100}%` }}
            >
              {s.region} {s.fillRate}%
            </div>
          )
        })}
      </div>

      {/* 凡例 */}
      <div className="text-muted-foreground relative mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block size-3 rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, color-mix(in oklch, var(--brand) 70%, transparent), transparent)',
            }}
          />
          濃いほどイベントが盛り上がり
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full border border-rose-500/40 bg-rose-500/10" />
          バッジ＝支え手の充足率（低い地域は応援募集中）
        </span>
      </div>
    </div>
  )
}
