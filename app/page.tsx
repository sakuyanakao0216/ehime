import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ConnectEventCard } from '@/components/blocks/connect-event-card'
import { EventHub } from '@/components/blocks/event-hub'
import { HeroBanner } from '@/components/blocks/hero-banner'
import { RegionMeter } from '@/components/blocks/region-meter'
import { StairwayTeaser } from '@/components/blocks/stairway-teaser'
import { WhySportEhime } from '@/components/blocks/why-sport-ehime'
import { connectEvents } from '@/lib/mock/events'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      {/* Hero */}
      <section className="relative isolate pt-12 pb-10 sm:pt-16">
        <div className="aura-brand pointer-events-none absolute inset-x-0 -top-28 -z-10 h-72 opacity-70" />
        <div className="label text-brand mb-5 flex items-center gap-3">
          <span className="bg-brand inline-block h-px w-8" />
          All Ehime Sports
        </div>
        <h1 className="display max-w-2xl text-4xl leading-[1.12] font-bold tracking-tight text-balance sm:text-6xl">
          観る、する、
          <span className="text-brand">ささえる。</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-md text-base leading-relaxed">
          愛媛のスポーツイベントが、ぜんぶここに。 見て、行って、楽しむうちに、AI
          が世代や立場を越えて参加できる場をつくります。
        </p>
      </section>

      {/* なぜスポえひめか（差別化 = “つくる側”） */}
      <section className="reveal mb-20">
        <WhySportEhime />
      </section>

      {/* トップバナー: AI が提案する交流イベント（集まれば開催） */}
      <section className="reveal mb-20">
        <HeroBanner />
      </section>

      {/* 関わりの階段ティザー（“育てる”モデルの核） */}
      <section className="reveal mb-20">
        <StairwayTeaser />
      </section>

      {/* イベント情報ハブ */}
      <section className="reveal mb-20">
        <div className="mb-6 border-b pb-3">
          <div className="label text-muted-foreground">Events</div>
          <h2 className="display mt-1 text-2xl font-bold">スポーツイベントをさがす</h2>
        </div>
        <EventHub />
      </section>

      {/* 愛媛のいま（偏在メーター = 政策フック） */}
      <section className="reveal mb-20">
        <div className="card-soft grid gap-7 p-6 sm:grid-cols-[1fr_1.1fr] sm:p-8">
          <div>
            <div className="label text-brand">愛媛のいま</div>
            <h2 className="display mt-1 text-2xl font-bold text-balance">
              支え手の“偏り”を、数字で見える化。
            </h2>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
              指導者は地域でかたよっています。東予・中予・南予の充足ぐあいを可視化し、
              「どこに、誰が足りないか」を一目で。オンライン指導と広域マッチングで、空白を埋めにいきます。
            </p>
            <Link
              href="/operator"
              className="text-foreground mt-5 inline-flex items-center gap-1 text-sm font-medium hover:gap-2"
            >
              学校・クラブの募集を見る
              <ArrowRight className="size-4 transition-all" />
            </Link>
          </div>
          <RegionMeter />
        </div>
      </section>

      {/* おすすめのつながりイベント（旧 /connect を統合） */}
      <section className="reveal">
        <div className="mb-6 flex items-end justify-between border-b pb-3">
          <div>
            <div className="label text-brand">AI Recommendation</div>
            <h2 className="display mt-1 text-2xl font-bold">あなたへのつながりイベント</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              「好き・得意」から、AI が“ちょい手伝い”できる場をおすすめ。まずは気軽に。
            </p>
          </div>
          <Link
            href="/me"
            className="text-muted-foreground hover:text-foreground hidden items-center gap-1 text-sm sm:flex"
          >
            関わりの階段
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {connectEvents.map((e) => (
            <ConnectEventCard key={e.id} event={e} />
          ))}
        </div>
      </section>
    </main>
  )
}
