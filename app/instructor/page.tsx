import { Award, GraduationCap, HeartHandshake, MapPin, School, Star, Video } from 'lucide-react'
import { ActivityIcon } from '@/components/activity-icon'
import { RecruitmentCard } from '@/components/blocks/recruitment-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { activityById, cityById, instructorById, instructors, recruitments } from '@/lib/mock/data'

// デモの主役: 松山の元プロ奏者（オンラインで南予を支える）
const me = instructorById('i01') ?? instructors[0]

// 自分の専門に合う募集（広域で拾う）
const matched = recruitments
  .filter((r) => r.status === '募集中' && me.specialties.includes(r.activityId))
  .slice(0, 3)

export default function InstructorPage() {
  const city = cityById(me.cityId)
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Badge variant="secondary" className="mb-3">
        指導者マイページ
      </Badge>

      {/* プロフィールヘッダー */}
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
              {me.name.replace(/\s/g, '').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{me.name}</h1>
              <span className="text-muted-foreground flex items-center gap-0.5 text-sm">
                <Star className="text-warning size-4 fill-current" />
                {me.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-muted-foreground">{me.headline}</p>
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-0.5">
                <MapPin className="size-3.5" />
                {city?.name}（{me.region}）
              </span>
              {me.onlineAvailable && (
                <span className="text-info flex items-center gap-0.5">
                  <Video className="size-3.5" />
                  オンライン指導可
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {me.specialties.map((s) => {
              const act = activityById(s)
              return (
                act && (
                  <Badge key={s} className="gap-1">
                    <ActivityIcon name={act.icon} className="size-3" />
                    {act.name}
                  </Badge>
                )
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* インパクト指標（承認・手応えの可視化）*/}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Impact icon={HeartHandshake} value={`${me.thanksCount}件`} label="もらった感謝" />
        <Impact icon={School} value={`${me.schoolsSupported}校`} label="関わった学校" />
        <Impact icon={Award} value={`${me.yearsExperience}年`} label="指導歴" />
        <Impact icon={Star} value={me.rating.toFixed(1)} label="評価" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* マッチする募集 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">あなたにマッチする募集</h2>
          <p className="text-muted-foreground -mt-2 text-sm">
            オンライン対応のため、南予・東予の募集にも応募できます。
          </p>
          {matched.map((r) => (
            <RecruitmentCard key={r.id} recruitment={r}>
              <Button size="sm" className="mt-1">
                応募する
              </Button>
            </RecruitmentCard>
          ))}
        </div>

        {/* サイド: 研修 + バッジ + 感謝の声 */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="text-success size-4" />
                研修の受講状況
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TrainingRow label="指導者基礎研修" done />
              <TrainingRow label="安全管理・救急" done />
              <TrainingRow label="オンライン指導スキル" done />
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>ハラスメント防止</span>
                  <span className="text-muted-foreground">受講中 60%</span>
                </div>
                <Progress value={60} indicatorClassName="bg-warning" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                研修を続ける
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">獲得バッジ</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {me.badges.map((b) => (
                <Badge
                  key={b.label}
                  variant={
                    b.tone === 'primary'
                      ? 'default'
                      : b.tone === 'success'
                        ? 'success'
                        : b.tone === 'info'
                          ? 'info'
                          : b.tone === 'warning'
                            ? 'warning'
                            : 'accent'
                  }
                >
                  {b.label}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HeartHandshake className="text-destructive size-4" />
                届いた感謝の声
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {me.thanksVoices.map((v) => (
                <blockquote key={v.body} className="border-primary/40 border-l-2 pl-3 text-sm">
                  <p className="leading-relaxed">「{v.body}」</p>
                  <footer className="text-muted-foreground mt-0.5 text-xs">— {v.from}</footer>
                </blockquote>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

function Impact({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Award
  value: string
  label: string
}) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-center gap-3">
        <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
          <Icon className="size-5" />
        </span>
        <div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-muted-foreground text-xs">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function TrainingRow({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      {done ? (
        <Badge variant="success" className="gap-1">
          <GraduationCap className="size-3" />
          修了
        </Badge>
      ) : (
        <Badge variant="outline">未受講</Badge>
      )}
    </div>
  )
}
