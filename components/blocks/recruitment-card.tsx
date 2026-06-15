import { CalendarDays, MapPin, Video } from 'lucide-react'
import { ActivityIcon } from '@/components/activity-icon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { activityById, cityById } from '@/lib/mock/data'
import type { Recruitment } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

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
    <Card className={cn('gap-3 py-5', className)}>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5">
              {act && (
                <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md">
                  <ActivityIcon name={act.icon} className="size-3.5" />
                </span>
              )}
              <span className="text-muted-foreground text-xs">{act?.name}</span>
            </div>
            <h3 className="leading-snug font-semibold">{recruitment.org}</h3>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {recruitment.urgency === '急募' && !matched && (
              <Badge variant="destructive">急募</Badge>
            )}
            <Badge variant={matched ? 'success' : 'outline'}>{recruitment.status}</Badge>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">{recruitment.background}</p>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="flex items-center gap-0.5">
            <MapPin className="size-3" />
            {city?.name}（{recruitment.region}）
          </span>
          <span className="flex items-center gap-0.5">
            <CalendarDays className="size-3" />
            {recruitment.requiredDays.join('・')}
          </span>
          {recruitment.onlineOk && (
            <span className="text-info flex items-center gap-0.5">
              <Video className="size-3" />
              オンライン可
            </span>
          )}
          <Badge variant="secondary" className="px-1.5 py-0">
            {recruitment.level}
          </Badge>
        </div>

        {children}
      </CardContent>
    </Card>
  )
}
