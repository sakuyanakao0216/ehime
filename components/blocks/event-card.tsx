import Image from 'next/image'
import { ActivityIcon } from '@/components/activity-icon'
import { activityById, cityById } from '@/lib/mock/data'
import type { EventCategory, SportEvent } from '@/lib/mock/events'

/** カテゴリ別の雰囲気画像（Vertex Imagen 生成）。 */
const categoryImage: Partial<Record<EventCategory, string>> = {
  プロ観戦: '/images/generated/kansen.png',
  地域: '/images/generated/chiiki.png',
  学校: '/images/generated/gakko.png',
}

/** エディトリアルなイベントカード（白基調・ヘアライン・明朝タイトル）。 */
export function EventCard({ event }: { event: SportEvent }) {
  const city = cityById(event.cityId)
  const act = activityById(event.activityId)
  const img = categoryImage[event.category]
  return (
    <article className="lift group card-soft flex gap-4 p-5">
      {/* カテゴリ画像（なければ種目アイコン） */}
      <div className="bg-muted text-foreground/70 relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        {img ? (
          <Image src={img} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          act && <ActivityIcon name={act.icon} className="size-6" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-muted-foreground label flex items-center gap-2">
          {event.recommended && (
            <span className="bg-brand/10 text-brand normal-case tracking-normal rounded-full px-2 py-0.5 text-[10px] font-bold">
              ★ おすすめ
            </span>
          )}
          <span>{event.category}</span>
          <span className="bg-border h-3 w-px" />
          <span className="normal-case tracking-normal">{act?.name}</span>
        </div>
        <h3 className="display mt-1 text-lg leading-snug font-bold">{event.title}</h3>
        <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm">
          <span>{event.dateLabel}</span>
          <span>
            {city?.name}・{event.venue}
          </span>
          <span>{event.price}</span>
        </div>
        {event.perk && (
          <p className="text-brand mt-2 flex items-center gap-1.5 text-xs font-medium">
            <span className="bg-brand size-1.5 rounded-full" />
            {event.perk}
          </p>
        )}
      </div>
    </article>
  )
}
