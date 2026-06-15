import { Users } from 'lucide-react'
import { ActivityIcon } from '@/components/activity-icon'
import { ApplyButton } from '@/components/apply-button'
import { activityById, cityById } from '@/lib/mock/data'
import type { ConnectEvent } from '@/lib/mock/events'

/** Wheel A: AI が組成する「つながりイベント」。気軽さ（ちょい手伝い）を前面に。 */
export function ConnectEventCard({ event }: { event: ConnectEvent }) {
  const city = cityById(event.cityId)
  const act = activityById(event.activityId)
  return (
    <article className="lift bg-card border p-5">
      <div className="flex gap-4">
        <div className="bg-muted text-foreground/70 flex size-14 shrink-0 items-center justify-center rounded-sm">
          {act && <ActivityIcon name={act.icon} className="size-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="label text-muted-foreground flex items-center gap-2">
            <span className="text-brand">{event.level}</span>
            <span className="bg-border h-3 w-px" />
            <span className="normal-case tracking-normal">{act?.name}</span>
          </div>
          <h3 className="font-serif mt-1 text-lg leading-snug font-semibold">{event.title}</h3>
          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm">
            <span>{city?.name}</span>
            <span>{event.dateLabel}</span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {event.joined}/{event.slots}
            </span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-3 text-sm">{event.who}</p>

      {/* AI の提案理由 */}
      <p className="border-brand text-foreground/80 mt-3 border-l-2 pl-3 text-sm leading-relaxed">
        <span className="label text-brand mr-1">AI</span>
        {event.aiReason}
      </p>

      <ApplyButton
        label="ゆるく参加してみる"
        doneLabel="参加を登録しました"
        className="mt-4 w-full"
      />
    </article>
  )
}
