import { GraduationCap, MapPin, Star, Video } from 'lucide-react'
import { ApplyButton } from '@/components/apply-button'
import { RecruitmentCard } from '@/components/blocks/recruitment-card'
import { RoleBanner } from '@/components/blocks/role-banner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { activityById, cityById, instructorById, instructors, recruitments } from '@/lib/mock/data'
import { cn } from '@/lib/utils'
import { avatarGradient, emojiFor } from '@/lib/visual'

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
      <RoleBanner
        emoji="🙌"
        roleLabel="指導者の方"
        gradient="from-sky-400 to-indigo-500"
        description={`${me.name}さん、こんにちは。あなたにぴったりの募集が ${matched.length}件 とどいています。`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 主アクション: おすすめ募集に応募する */}
        <div>
          <h1 className="text-2xl font-bold">あなたへのおすすめ募集 ✨</h1>
          <p className="text-muted-foreground mb-4 text-sm">
            オンライン対応だから、南予・東予の募集にも応募できます。気になったら応募するだけ。
          </p>
          <div className="space-y-3">
            {matched.map((r) => (
              <RecruitmentCard key={r.id} recruitment={r}>
                <ApplyButton className="mt-1 w-full" />
              </RecruitmentCard>
            ))}
          </div>
        </div>

        {/* サイド: プロフィールと実績（副次情報） */}
        <aside className="space-y-5">
          {/* プロフィールカード */}
          <Card className="gap-0 overflow-hidden py-0">
            <div className={cn('bg-gradient-to-br p-5 text-white', avatarGradient(me.id))}>
              <div className="flex size-14 items-center justify-center rounded-full bg-white/25 text-2xl font-bold backdrop-blur">
                {me.name.replace(/\s/g, '').slice(0, 1)}
              </div>
              <h2 className="mt-3 text-lg font-bold">{me.name}</h2>
              <p className="text-sm text-white/90">{me.headline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/90">
                <span className="flex items-center gap-0.5">
                  <MapPin className="size-3" />
                  {city?.name}
                </span>
                {me.onlineAvailable && (
                  <span className="flex items-center gap-0.5">
                    <Video className="size-3" />
                    オンラインOK
                  </span>
                )}
                <span className="flex items-center gap-0.5">
                  <Star className="size-3 fill-white" />
                  {me.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap gap-1.5">
                {me.specialties.map((s) => (
                  <span key={s} className="bg-muted rounded-full px-2.5 py-1 text-sm font-medium">
                    {emojiFor(s)} {activityById(s)?.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat value={`❤️${me.thanksCount}`} label="感謝" />
                <Stat value={`${me.schoolsSupported}校`} label="活躍" />
                <Stat value={`${me.yearsExperience}年`} label="指導歴" />
              </div>
            </CardContent>
          </Card>

          {/* 研修（安心の見える化） */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">🎓 研修の受講状況</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TrainingRow label="指導者きほん研修" done />
              <TrainingRow label="安全・救急" done />
              <TrainingRow label="オンライン指導" done />
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>ハラスメント防止</span>
                  <span className="text-muted-foreground">受講中 60%</span>
                </div>
                <Progress value={60} indicatorClassName="bg-amber-500" />
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-full">
                研修を続ける
              </Button>
            </CardContent>
          </Card>

          {/* 感謝の声 */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">💬 とどいた声</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {me.thanksVoices.map((v) => (
                <div key={v.body} className="bg-primary/5 rounded-xl p-3 text-sm leading-relaxed">
                  「{v.body}」<div className="text-muted-foreground mt-0.5 text-xs">— {v.from}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-muted/60 rounded-xl py-2">
      <div className="text-sm font-bold">{value}</div>
      <div className="text-muted-foreground text-[11px]">{label}</div>
    </div>
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
