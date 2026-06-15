import { ActivityIcon } from '@/components/activity-icon'
import { activityById, cityById } from '@/lib/mock/data'
import type { SportEvent } from '@/lib/mock/events'

/** エディトリアルなイベントカード（白基調・ヘアライン・明朝タイトル）。 */
export function EventCard({ event }: { event: SportEvent }) {
  const city = cityById(event.cityId)
  const act = activityById(event.activityId)
  return (
    <article className="lift group card-soft flex gap-4 p-5">
      {/* 種目アイコン */}
      <div className="bg-muted text-foreground/70 flex size-14 shrink-0 items-center justify-center rounded-xl">
        {act && <ActivityIcon name={act.icon} className="size-6" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-muted-foreground label flex items-center gap-2">
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
