import { MapPin, Star, Video } from 'lucide-react'
import { ActivityIcon } from '@/components/activity-icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { activityById, cityById } from '@/lib/mock/data'
import type { Badge as BadgeType, Instructor } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

const toneMap: Record<BadgeType['tone'], string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/15 text-warning',
  accent: 'bg-accent text-accent-foreground',
}

function initials(name: string) {
  return name.replace(/\s/g, '').slice(0, 2)
}

/** 信頼レイヤー（研修・資格・実績・感謝）を常時見せる指導者カード。 */
export function InstructorCard({
  instructor,
  className,
}: {
  instructor: Instructor
  className?: string
}) {
  const city = cityById(instructor.cityId)
  return (
    <Card className={cn('gap-4 py-5', className)}>
      <CardContent className="space-y-3.5">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary/15 text-primary font-semibold">
              {initials(instructor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{instructor.name}</h3>
              <span className="text-muted-foreground flex shrink-0 items-center gap-0.5 text-xs">
                <Star className="size-3 fill-current text-warning" />
                {instructor.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-muted-foreground truncate text-sm">{instructor.headline}</p>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-0.5">
                <MapPin className="size-3" />
                {city?.name}（{instructor.region}）
              </span>
              {instructor.onlineAvailable && (
                <span className="text-info flex items-center gap-0.5">
                  <Video className="size-3" />
                  オンライン可
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 専門種目 */}
        <div className="flex flex-wrap gap-1.5">
          {instructor.specialties.map((s) => {
            const act = activityById(s)
            return (
              <Badge key={s} variant="secondary" className="gap-1">
                {act && <ActivityIcon name={act.icon} className="size-3" />}
                {act?.name}
              </Badge>
            )
          })}
        </div>

        {/* 信頼バッジ */}
        <div className="flex flex-wrap gap-1.5">
          {instructor.badges.map((b) => (
            <span
              key={b.label}
              className={cn('rounded-md px-2 py-0.5 text-xs font-medium', toneMap[b.tone])}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* 感謝の声（1件） */}
        {instructor.thanksVoices[0] && (
          <blockquote className="border-primary/40 text-muted-foreground border-l-2 pl-3 text-xs italic">
            「{instructor.thanksVoices[0].body}」
            <span className="not-italic">— {instructor.thanksVoices[0].from}</span>
          </blockquote>
        )}

        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span>指導歴 {instructor.yearsExperience}年</span>
          <span>関わった学校 {instructor.schoolsSupported}校</span>
          <span>感謝 {instructor.thanksCount}件</span>
        </div>
      </CardContent>
    </Card>
  )
}
