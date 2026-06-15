import { Sparkles, Users } from 'lucide-react'
import { ApplyButton } from '@/components/apply-button'
import { Card, CardContent } from '@/components/ui/card'
import { cityById } from '@/lib/mock/data'
import type { ConnectEvent } from '@/lib/mock/events'
import { cn } from '@/lib/utils'
import { emojiFor, gradientFor } from '@/lib/visual'

const levelTone: Record<ConnectEvent['level'], string> = {
  ちょい手伝い: 'bg-emerald-100 text-emerald-700',
  体験サポート: 'bg-sky-100 text-sky-700',
  継続サポート: 'bg-violet-100 text-violet-700',
}

/** Wheel A: AI が組成する「つながりイベント」。気軽さ（ちょい手伝い）を前面に。 */
export function ConnectEventCard({ event }: { event: ConnectEvent }) {
  const city = cityById(event.cityId)
  return (
    <Card className="lift overflow-hidden py-0">
      <div
        className={cn(
          'flex items-center gap-3 bg-gradient-to-r p-4 text-white',
          gradientFor(event.activityId),
        )}
      >
        <span className="text-3xl">{emojiFor(event.activityId)}</span>
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              'rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-emerald-700',
            )}
          >
            {event.level}
          </span>
          <h3 className="mt-1 leading-snug font-bold">{event.title}</h3>
        </div>
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span>📍 {city?.name}</span>
          <span>🗓️ {event.dateLabel}</span>
          <span className="flex items-center gap-0.5">
            <Users className="size-3" />
            {event.joined}/{event.slots}人
          </span>
        </div>
        <p className="text-muted-foreground text-sm">{event.who}</p>
        {/* AIの提案理由（嗜好データ×ニーズ） */}
        <p className="flex items-start gap-1.5 rounded-xl bg-violet-50 p-2.5 text-xs leading-relaxed text-violet-800">
          <Sparkles className="mt-0.5 size-3.5 shrink-0" />
          {event.aiReason}
        </p>
        <ApplyButton label="ゆるく参加してみる" doneLabel="参加登録しました！" className="w-full" />
      </CardContent>
    </Card>
  )
}
