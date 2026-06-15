import { Clock, MapPin, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { activityById, cityById } from '@/lib/mock/data'
import { categoryMeta, type SportEvent } from '@/lib/mock/events'
import { cn } from '@/lib/utils'
import { emojiFor, gradientFor } from '@/lib/visual'

/** スポーツイベント1件のカード（観戦・地域・学校 横断）。割引バッジで“お得感”を見せる。 */
export function EventCard({ event }: { event: SportEvent }) {
  const cat = categoryMeta[event.category]
  const city = cityById(event.cityId)
  const act = activityById(event.activityId)
  return (
    <Card className="lift overflow-hidden py-0">
      <CardContent className="flex gap-0 p-0">
        <div
          className={cn(
            'flex w-16 shrink-0 flex-col items-center justify-center gap-0.5 bg-gradient-to-b text-white sm:w-20',
            gradientFor(event.activityId),
          )}
        >
          <span className="text-2xl sm:text-3xl">{emojiFor(event.activityId)}</span>
          <span className="text-[10px] opacity-90">{act?.name}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5 p-3">
          <div className="flex items-center gap-1.5">
            <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', cat.className)}>
              {cat.emoji} {event.category}
            </span>
            <span className="text-muted-foreground text-xs">{event.price}</span>
          </div>
          <h3 className="leading-snug font-bold">{event.title}</h3>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            <span className="flex items-center gap-0.5">
              <Clock className="size-3" />
              {event.dateLabel}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin className="size-3" />
              {city?.name}・{event.venue}
            </span>
          </div>
          {event.perk && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
              <Tag className="size-3" />
              {event.perk}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
