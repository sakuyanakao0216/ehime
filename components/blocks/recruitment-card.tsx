import { ActivityIcon } from '@/components/activity-icon'
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
    <article className={cn('card-soft p-5', className)}>
      <div className="flex gap-4">
        <div className="bg-muted text-foreground/70 flex size-14 shrink-0 items-center justify-center rounded-xl">
          {act && <ActivityIcon name={act.icon} className="size-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="label text-muted-foreground flex items-center gap-2">
            <span className="normal-case tracking-normal">{act?.name}</span>
            {recruitment.urgency === '急募' && !matched && <span className="text-brand">急募</span>}
            {matched && <span className="text-muted-foreground">決定済</span>}
          </div>
          <h3 className="display mt-1 text-lg leading-snug font-bold">{recruitment.org}</h3>
          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm">
            <span>{city?.name}</span>
            <span>{recruitment.requiredDays.join('・')}</span>
            {recruitment.onlineOk && <span>オンライン可</span>}
            <span>{recruitment.level}</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{recruitment.background}</p>

      {children}
    </article>
  )
}
