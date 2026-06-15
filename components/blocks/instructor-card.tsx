import { Heart, MapPin, ShieldCheck, Star, Video } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { activityById, cityById } from '@/lib/mock/data'
import type { Instructor } from '@/lib/mock/types'
import { cn } from '@/lib/utils'
import { avatarGradient, emojiFor } from '@/lib/visual'

function initials(name: string) {
  return name.replace(/\s/g, '').slice(0, 1)
}

/** メルカリの商品カード風。顔（カラフルなアバター）と「何が得意・どこ・安心ポイント」がひと目で分かる。 */
export function InstructorCard({
  instructor,
  className,
}: {
  instructor: Instructor
  className?: string
}) {
  const city = cityById(instructor.cityId)
  return (
    <Card className={cn('lift gap-0 overflow-hidden py-0', className)}>
      {/* カラフルなヘッダー */}
      <div
        className={cn('relative bg-gradient-to-br p-4 text-white', avatarGradient(instructor.id))}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/25 text-xl font-bold backdrop-blur">
            {initials(instructor.name)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-bold">{instructor.name}</h3>
            <p className="truncate text-xs text-white/90">{instructor.headline}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="気になる"
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-colors hover:bg-white/35"
        >
          <Heart className="size-4" />
        </button>
        {instructor.trainingCompleted && (
          <span className="absolute -bottom-2.5 left-4 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-emerald-600 shadow">
            <ShieldCheck className="size-3" />
            県の研修ずみ
          </span>
        )}
      </div>

      <CardContent className="space-y-3 p-4 pt-5">
        {/* 得意な種目（絵文字） */}
        <div className="flex flex-wrap gap-1.5">
          {instructor.specialties.map((s) => {
            const act = activityById(s)
            return (
              <span
                key={s}
                className="bg-muted flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium"
              >
                <span>{emojiFor(s)}</span>
                {act?.name}
              </span>
            )
          })}
        </div>

        {/* 場所・オンライン・評価 */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-0.5">
            <MapPin className="size-3" />
            {city?.name}
          </span>
          {instructor.onlineAvailable && (
            <span className="text-info flex items-center gap-0.5 font-medium">
              <Video className="size-3" />
              オンラインOK
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {instructor.rating.toFixed(1)}
          </span>
        </div>

        {/* 子ども・保護者の声 */}
        {instructor.thanksVoices[0] && (
          <p className="bg-primary/5 rounded-lg p-2.5 text-xs leading-relaxed">
            💬「{instructor.thanksVoices[0].body}」
          </p>
        )}

        {/* かんたん実績 */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold">❤️ 感謝{instructor.thanksCount}</span>
          <span className="text-muted-foreground">指導歴{instructor.yearsExperience}年</span>
          <span className="text-muted-foreground">{instructor.schoolsSupported}校で活躍</span>
        </div>
      </CardContent>
    </Card>
  )
}
