import { MapPin, ShieldCheck, Star } from 'lucide-react'
import { ActivityIcon } from '@/components/activity-icon'
import { activityById, cityById } from '@/lib/mock/data'
import type { Instructor } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

function initials(name: string) {
  return name.replace(/\s/g, '').slice(0, 1)
}

/** エディトリアルな指導者カード（白基調・ヘアライン・明朝の名）。 */
export function InstructorCard({
  instructor,
  className,
}: {
  instructor: Instructor
  className?: string
}) {
  const city = cityById(instructor.cityId)
  return (
    <article className={cn('lift card-soft p-5', className)}>
      <div className="flex items-start gap-3">
        <div className="border-foreground/15 text-foreground/80 flex size-12 shrink-0 items-center justify-center rounded-full border text-lg font-bold">
          {initials(instructor.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="display text-base font-bold">{instructor.name}</h3>
          <p className="text-muted-foreground truncate text-xs">{instructor.headline}</p>
        </div>
        <span className="text-muted-foreground flex items-center gap-0.5 text-xs">
          <Star className="size-3 fill-current" />
          {instructor.rating.toFixed(1)}
        </span>
      </div>

      {/* 得意な種目 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {instructor.specialties.map((s) => {
          const act = activityById(s)
          return (
            act && (
              <span
                key={s}
                className="border-border text-foreground/80 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              >
                <ActivityIcon name={act.icon} className="size-3" />
                {act.name}
              </span>
            )
          )
        })}
      </div>

      {/* 場所・信頼 */}
      <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-0.5">
          <MapPin className="size-3" />
          {city?.name}
        </span>
        {instructor.onlineAvailable && <span>オンライン対応</span>}
        {instructor.trainingCompleted && (
          <span className="text-foreground flex items-center gap-0.5 font-medium">
            <ShieldCheck className="text-brand size-3" />
            県研修修了
          </span>
        )}
      </div>

      {/* 声 */}
      {instructor.thanksVoices[0] && (
        <p className="border-border text-foreground/80 mt-3 border-t pt-3 text-xs leading-relaxed">
          「{instructor.thanksVoices[0].body}」
        </p>
      )}

      <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
        <span>感謝 {instructor.thanksCount}</span>
        <span>指導歴 {instructor.yearsExperience}年</span>
        <span>{instructor.schoolsSupported}校</span>
      </div>
    </article>
  )
}
