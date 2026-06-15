import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ConnectEventCard } from '@/components/blocks/connect-event-card'
import { EventHub } from '@/components/blocks/event-hub'
import { HeroBanner } from '@/components/blocks/hero-banner'
import { connectEvents } from '@/lib/mock/events'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      {/* Hero */}
      <section className="pt-12 pb-10 sm:pt-16">
        <div className="label text-brand mb-5 flex items-center gap-3">
          <span className="bg-brand inline-block h-px w-8" />
          All Ehime Sports
        </div>
        <h1 className="font-serif max-w-2xl text-3xl leading-[1.18] font-semibold tracking-tight text-balance sm:text-5xl">
          愛媛のスポーツが、ひとつになる。
        </h1>
        <p className="text-muted-foreground mt-5 max-w-md text-base leading-relaxed">
          見て、行って、楽しむうちに、スポーツを支える仲間になれる。 AI
          が、世代や立場を越えて参加できる場をつくります。
        </p>
      </section>

      {/* トップバナー: AI が提案する交流イベント（集まれば開催） */}
      <section className="mb-20">
        <HeroBanner />
      </section>

      {/* イベント情報ハブ */}
      <section className="mb-20">
        <div className="mb-6 border-b pb-3">
          <div className="label text-muted-foreground">Events</div>
          <h2 className="font-serif mt-1 text-2xl font-semibold">スポーツイベントをさがす</h2>
        </div>
        <EventHub />
      </section>

      {/* おすすめのつながりイベント（旧 /connect を統合） */}
      <section>
        <div className="mb-6 flex items-end justify-between border-b pb-3">
          <div>
            <div className="label text-brand">AI Recommendation</div>
            <h2 className="font-serif mt-1 text-2xl font-semibold">あなたへのつながりイベント</h2>
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
