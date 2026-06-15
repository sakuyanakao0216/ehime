import {
  ArrowRight,
  Building2,
  Citrus,
  GraduationCap,
  HeartHandshake,
  MapPinned,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import { ActivityFeed } from '@/components/blocks/activity-feed'
import { RegionMeter } from '@/components/blocks/region-meter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { kpis } from '@/lib/mock/data'

const pillars = [
  {
    icon: Sparkles,
    title: 'AI 広域マッチング',
    body: '種目・地域・空き時間・オンライン可否から、県全体の人材プールで最適な指導者を提案。なぜ合うかの理由も提示します。',
  },
  {
    icon: GraduationCap,
    title: '信頼を見える化',
    body: '県の研修修了・資格・実績・子どもや保護者からの感謝の声を候補に常時表示。「どんな人か分からない不安」を解消します。',
  },
  {
    icon: Video,
    title: 'オンラインで偏在を解消',
    body: '東予・南予の専門指導者の空白を、オンライン指導で埋める。子どもがどの地域にいても専門的な指導を受けられます。',
  },
]

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="from-primary/10 via-background to-accent/30 absolute inset-0 -z-10 bg-gradient-to-br" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Citrus className="size-3.5" />
            オールえひめ ／ 2026年12月 プロトタイプ
          </Badge>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            こどもたちの機会を守る、
            <span className="text-primary">全国初</span>のチャレンジ。
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            部活動・地域クラブの運営者と指導者を、県が主導して
            <strong className="text-foreground">広域でマッチング</strong>。
            指導者不足と地域間の偏りを乗り越え、愛媛のどこにいても
            専門的な指導に出会える仕組みをつくります。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/operator">
                <Building2 />
                運営者として指導者を探す
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/instructors">
                <Users />
                指導者を一覧で見る
              </Link>
            </Button>
          </div>

          {/* KPI */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat
              value={`▲${kpis.decadeClubDecline}+`}
              label="直近10年の部活動 減少数"
              tone="text-destructive"
            />
            <Stat value={`${kpis.registeredInstructors}名`} label="登録指導者（プロト）" />
            <Stat value={`${kpis.openRecruitments}件`} label="募集中の部活動・クラブ" />
            <Stat
              value={`${kpis.onlineCapableRate}%`}
              label="オンライン指導に対応"
              tone="text-info"
            />
          </div>
        </div>
      </section>

      {/* 課題 */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="grid gap-6 sm:grid-cols-3">
            <Problem
              title="指導者の不足"
              body="教員が専門外の競技まで顧問を担う形は持続性に欠け、長時間労働の一因に。"
            />
            <Problem
              title="地域間の偏り"
              body="東予・南予は子どもの減少が著しく、単独校での部活動維持が困難に。"
            />
            <Problem
              title="市町任せの限界"
              body="小規模市町はシステム構築の予算・事務負担が重く、人材バンクは登録が伸び悩む。"
            />
          </CardContent>
        </Card>
      </section>

      {/* 解決の柱 */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-2 text-2xl font-bold">広域連携システムの3つの柱</h2>
        <p className="text-muted-foreground mb-6">
          「登録して終わり」にしない。県全体で支え合う仕組みへ。
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <Card key={p.title}>
              <CardContent className="space-y-3">
                <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <p.icon className="size-6" />
                </span>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 活性化: フィード + 地域メーター */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
              <HeartHandshake className="text-primary size-5" />
              いま、県内で起きていること
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              マッチや感謝がリアルタイムに流れ、関わりたくなる場に。
            </p>
            <ActivityFeed />
          </div>
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
              <MapPinned className="text-primary size-5" />
              地域の盛り上がりメーター
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              東予・中予・南予の充足率を可視化。空白地域に重点的に人材を届けます。
            </p>
            <Card>
              <CardContent>
                <RegionMeter />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <div className="bg-card/60 rounded-xl border p-4 backdrop-blur">
      <div className={`text-2xl font-bold sm:text-3xl ${tone ?? 'text-primary'}`}>{value}</div>
      <div className="text-muted-foreground mt-1 text-xs leading-tight">{label}</div>
    </div>
  )
}

function Problem({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-destructive mb-1 font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
    </div>
  )
}
