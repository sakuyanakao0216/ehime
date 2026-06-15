import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ActivityFeed } from '@/components/blocks/activity-feed'
import { CategoryGrid } from '@/components/blocks/category-grid'
import { HowItWorks } from '@/components/blocks/how-it-works'
import { RecruitmentCard } from '@/components/blocks/recruitment-card'
import { RegionMeter } from '@/components/blocks/region-meter'
import { RoleChooser } from '@/components/blocks/role-chooser'
import { Button } from '@/components/ui/button'
import { kpis, recruitments } from '@/lib/mock/data'

const newArrivals = recruitments.filter((r) => r.status === '募集中').slice(0, 4)

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      {/* Hero */}
      <section className="relative py-12 sm:py-16">
        <span className="animate-float pointer-events-none absolute top-6 right-6 text-5xl opacity-80 sm:text-6xl">
          🍊
        </span>
        <span className="animate-float pointer-events-none absolute top-28 right-24 hidden text-3xl opacity-60 sm:block [animation-delay:1.5s]">
          🎺
        </span>
        <span className="animate-float pointer-events-none absolute top-40 right-2 hidden text-3xl opacity-60 sm:block [animation-delay:0.7s]">
          ⚽
        </span>

        <div className="bg-brand mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm">
          <Sparkles className="size-3.5" />
          オールえひめ ／ 部活サポート
        </div>
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
          困っている部活と、
          <br className="hidden sm:block" />
          <span className="text-brand">教えたい人</span>を、サクッと。
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
          愛媛のどこにいても、専門の指導者に出会える。
          学校・クラブは募集を出すだけ、指導者はサッと応募するだけ。 AI
          が県中からぴったりの相手を見つけます。
        </p>

        {/* KPI チップ */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip emoji="🧑‍🏫" text={`指導者 ${kpis.registeredInstructors}名が登録`} />
          <Chip emoji="📣" text={`いま ${kpis.openRecruitments}件が募集中`} />
          <Chip emoji="💻" text={`${kpis.onlineCapableRate}% がオンライン対応`} />
        </div>
      </section>

      {/* 役割選択: 誰が使うアプリかを最初に明確化 */}
      <section className="mb-14">
        <h2 className="mb-1 text-center text-2xl font-bold">あなたはどっち？</h2>
        <p className="text-muted-foreground mb-5 text-center text-sm">
          タップして、あなたにぴったりの画面へ
        </p>
        <RoleChooser />
      </section>

      {/* コア機能を3ステップで */}
      <section className="mb-14">
        <h2 className="mb-1 text-2xl font-bold">どうやってつながるの？</h2>
        <p className="text-muted-foreground mb-5 text-sm">
          むずかしい手続きはなし。3 ステップでマッチします。
        </p>
        <HowItWorks />
      </section>

      {/* 種目カテゴリ */}
      <section className="mb-14">
        <h2 className="mb-1 text-2xl font-bold">種目からさがす</h2>
        <p className="text-muted-foreground mb-5 text-sm">
          気になる種目をタップして、指導者を見てみよう。
        </p>
        <CategoryGrid />
      </section>

      {/* 新着の募集（マーケットの主役フィード） */}
      <section className="mb-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">新着の募集 📣</h2>
            <p className="text-muted-foreground text-sm">いま指導者をさがしている部活・クラブ</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/instructor">
              もっと見る
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {newArrivals.map((r) => (
            <RecruitmentCard key={r.id} recruitment={r}>
              <Button size="sm" className="mt-1 w-full rounded-full">
                くわしく見る
              </Button>
            </RecruitmentCard>
          ))}
        </div>
      </section>

      {/* 盛り上がり */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-1 text-xl font-bold">いま県内で起きていること 🎉</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            マッチや感謝がぞくぞく。見ているだけでワクワク。
          </p>
          <ActivityFeed />
        </div>
        <div>
          <h2 className="mb-1 text-xl font-bold">地域の盛り上がりマップ 🗺️</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            東予・中予・南予の充足ぐあい。みんなで空白をうめていこう。
          </p>
          <div className="bg-card rounded-2xl border p-5 shadow-sm">
            <RegionMeter />
          </div>
        </div>
      </section>
    </main>
  )
}

function Chip({ emoji, text }: { emoji: string; text: string }) {
  return (
    <span className="glass flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm">
      <span>{emoji}</span>
      {text}
    </span>
  )
}
