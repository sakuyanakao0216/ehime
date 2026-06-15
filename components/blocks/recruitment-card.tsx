import { CalendarDays, MapPin, Video } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { activityById, cityById } from '@/lib/mock/data'
import type { Recruitment } from '@/lib/mock/types'
import { cn } from '@/lib/utils'
import { emojiFor, gradientFor } from '@/lib/visual'

/** タイミーのギグカード風。ひと目で「何を・どこで・いつ」が分かるスキャンしやすい募集カード。 */
export function RecruitmentCard({
  recruitment,
  className,
  children,
}: {
  recruitment: Recruitment
  className?: string
  children?: React.ReactNode
}) {
  const act = activityById(recruitment.activityId)
  const city = cityById(recruitment.cityId)
  const matched = recruitment.status === 'マッチ成立'
  return (
    <Card className={cn('lift overflow-hidden py-0', className)}>
      <CardContent className="flex gap-0 p-0">
        {/* 種目の絵文字タイル */}
        <div
          className={cn(
            'flex w-20 shrink-0 flex-col items-center justify-center gap-1 bg-gradient-to-b text-white sm:w-24',
            gradientFor(recruitment.activityId),
          )}
        >
          <span className="text-3xl sm:text-4xl">{emojiFor(recruitment.activityId)}</span>
          <span className="text-[11px] font-medium opacity-90">{act?.name}</span>
        </div>

        {/* 本文 */}
        <div className="min-w-0 flex-1 space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="leading-snug font-bold">{recruitment.org}</h3>
            {recruitment.urgency === '急募' && !matched ? (
              <Badge variant="destructive" className="shrink-0 animate-pulse">
                🔥 急募
              </Badge>
            ) : matched ? (
              <Badge variant="success" className="shrink-0">
                ✅ 決定
              </Badge>
            ) : null}
          </div>

          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {recruitment.background}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="bg-muted flex items-center gap-0.5 rounded-full px-2 py-1">
              <MapPin className="size-3" />
              {city?.name}
            </span>
            <span className="bg-muted flex items-center gap-0.5 rounded-full px-2 py-1">
              <CalendarDays className="size-3" />
              {recruitment.requiredDays.join('・')}
            </span>
            {recruitment.onlineOk && (
              <span className="bg-info/10 text-info flex items-center gap-0.5 rounded-full px-2 py-1 font-medium">
                <Video className="size-3" />
                オンラインOK
              </span>
            )}
            <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-1">
              {recruitment.level}
            </span>
          </div>

          {children}
        </div>
      </CardContent>
    </Card>
  )
}
