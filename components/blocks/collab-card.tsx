'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'
import { ActivityIcon } from '@/components/activity-icon'
import { ConsultChat } from '@/components/blocks/consult-chat'
import { Button } from '@/components/ui/button'
import { activityById, cityById } from '@/lib/mock/data'
import type { CollabEvent, CollabPartner } from '@/lib/mock/events'
import { cn } from '@/lib/utils'

function PartnerChips({ partners }: { partners: CollabPartner[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {partners.map((p) => (
        <span
          key={p}
          className={cn(
            'border-border rounded-full border px-2.5 py-0.5 text-xs',
            p === 'プロ' && 'text-brand border-brand/40',
          )}
        >
          {p === '学校' ? '近くの学校' : p === 'ジム' ? '地域のジム' : 'プロ'}
        </span>
      ))}
    </div>
  )
}

/** コラボ: AI が近隣の学校・ジム・プロと統合イベントを企画。賛同が集まれば実施（成立型）。 */
export function CollabCard({ event, mine }: { event: CollabEvent; mine?: boolean }) {
  const [joined, setJoined] = useState(event.joined)
  const [agreed, setAgreed] = useState(false)
  const [chat, setChat] = useState(false)
  const act = activityById(event.activityId)
  const city = cityById(event.cityId)
  const open = joined >= event.minToOpen
  const justOpened = agreed && open && event.joined < event.minToOpen
  const pct = Math.min(100, Math.round((joined / event.minToOpen) * 100))

  return (
    <article className={cn('lift card-soft p-5', mine && 'ring-brand/30 ring-1')}>
      <div className="flex gap-4">
        <div className="bg-muted text-foreground/70 flex size-14 shrink-0 items-center justify-center rounded-xl">
          {act && <ActivityIcon name={act.icon} className="size-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="label text-brand">{mine ? 'あなたが企画' : 'コラボ提案'}</div>
            {mine && (
              <span className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-[10px] font-bold">
                企画中
              </span>
            )}
            {!mine && event.recommended && (
              <span className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-[10px] font-bold">
                ★ おすすめ
              </span>
            )}
          </div>
          <h3 className="display mt-1 text-lg leading-snug font-bold">{event.title}</h3>
          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm">
            <span>{city?.name}</span>
            <span>{event.dateLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <PartnerChips partners={event.partners} />
      </div>

      <p className="text-muted-foreground mt-3 text-xs">相手（匿名）: {event.partnerLabel}</p>

      <p className="border-brand text-foreground/80 mt-3 border-l-2 pl-3 text-xs leading-relaxed">
        <span className="label text-brand mr-1">AI</span>
        {event.aiReason}
      </p>

      {/* 成立ゲージ */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          {open ? (
            <span className="text-brand flex items-center gap-1 font-bold">
              <Check className="size-4" />
              実施決定
            </span>
          ) : (
            <span className="font-bold">あと{event.minToOpen - joined}団体で実施</span>
          )}
          <span className="text-muted-foreground text-xs">
            賛同 {joined}/{event.minToOpen}
          </span>
        </div>
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={cn('h-full rounded-full', open ? 'bg-brand' : 'bg-foreground')}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {justOpened && (
        <div className="animate-pop mt-3 flex items-center gap-1.5 text-sm font-medium">
          <Check className="text-brand size-4" />
          あなたの賛同で実施が決定しました。
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {agreed ? (
          <div className="bg-muted flex flex-1 items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium">
            <Check className="text-brand size-4" />
            賛同しました
          </div>
        ) : (
          <Button
            className="flex-1"
            onClick={() => {
              setJoined((n) => n + 1)
              setAgreed(true)
            }}
          >
            このコラボに賛同する
          </Button>
        )}
        <Button variant="outline" onClick={() => setChat((v) => !v)}>
          相談する
        </Button>
      </div>

      {chat && <ConsultChat candidateLabel={event.partnerLabel} />}
    </article>
  )
}
