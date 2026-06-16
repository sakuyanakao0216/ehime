import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CollabCard } from '@/components/blocks/collab-card'
import { ConnectEventCard } from '@/components/blocks/connect-event-card'
import { EhimeHeatmap } from '@/components/blocks/ehime-heatmap'
import { EventHub } from '@/components/blocks/event-hub'
import { HeroBanner } from '@/components/blocks/hero-banner'
import { collabEvents, connectEvents, events } from '@/lib/mock/events'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      {/* Hero */}
      <section className="relative isolate pt-12 pb-8 sm:pt-16">
        <div className="aura-brand pointer-events-none absolute inset-x-0 -top-28 -z-10 h-72 opacity-70" />
        <div className="label text-brand mb-5 flex items-center gap-3">
          <span className="bg-brand inline-block h-px w-8" />
          All Ehime Sports
        </div>
        <h1 className="display max-w-2xl text-4xl leading-[1.12] font-bold tracking-tight text-balance sm:text-6xl">
          観る、する、
          <span className="text-brand">ささえる。</span>
        </h1>
      </section>

      {/* ① 愛媛のいま（ヒートマップ演出: 盛り上がり＋支え手の偏り） */}
      <section className="reveal mb-20">
        <div className="mb-5 border-b pb-3">
          <div className="label text-brand">愛媛のいま</div>
          <h2 className="display mt-1 text-2xl font-bold text-balance">
            スポーツの“盛り上がり”と“偏り”が、ひと目で。
          </h2>
        </div>
        <EhimeHeatmap events={events} />
      </section>

      {/* ② コラボ企画 */}
      <section className="reveal mb-20">
        <div className="mb-6 border-b pb-3">
          <div className="label text-brand">Collaboration</div>
          <h2 className="display mt-1 text-2xl font-bold">コラボ企画</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            近くの学校・ジム・プロを AI が結ぶ合同イベント。賛同が集まれば実施。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {collabEvents.map((e) => (
            <CollabCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      {/* ③ おすすめ（AI 提案の交流イベント＋つながりイベント） */}
      <section className="reveal mb-20">
        <div className="mb-6 flex items-end justify-between border-b pb-3">
          <div>
            <div className="label text-brand">AI Recommendation</div>
            <h2 className="display mt-1 text-2xl font-bold">あなたへのおすすめ</h2>
          </div>
          <Link
            href="/me"
            className="text-muted-foreground hover:text-foreground hidden items-center gap-1 text-sm sm:flex"
          >
            関わりの階段
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <HeroBanner />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {connectEvents.map((e) => (
            <ConnectEventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      {/* ④ イベント一覧 */}
      <section className="reveal">
        <div className="mb-6 border-b pb-3">
          <div className="label text-muted-foreground">Events</div>
          <h2 className="display mt-1 text-2xl font-bold">イベント一覧</h2>
        </div>
        <EventHub />
      </section>
    </main>
  )
}
