import { ArrowRight, Handshake, type LucideIcon, School } from 'lucide-react'
import Link from 'next/link'
import { EventHub } from '@/components/blocks/event-hub'
import { HeroBanner } from '@/components/blocks/hero-banner'

const wheels: {
  href: string
  icon: LucideIcon
  tag: string
  title: string
  body: string
}[] = [
  {
    href: '/connect',
    icon: Handshake,
    tag: 'みんなで',
    title: 'つながる',
    body: '観戦やジム好きのまま、学生のイベントにゆる〜く参加。気づけばスポーツを支える側に。',
  },
  {
    href: '/operator',
    icon: School,
    tag: '学校・クラブ',
    title: 'ささえる',
    body: '「人が集まらない・指導者がいない」を投稿。AI が県内の候補から広域でつなぎます。',
  },
]

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

      {/* トップバナー: AI が提案する交流イベント（学生×社会人×プロ） */}
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

      {/* 両輪への入口 */}
      <section>
        <div className="mb-6 border-b pb-3">
          <div className="label text-muted-foreground">Get Involved</div>
          <h2 className="font-serif mt-1 text-2xl font-semibold">楽しむだけじゃない、関われる</h2>
        </div>
        <div className="grid gap-px sm:grid-cols-2">
          {wheels.map((w) => (
            <Link key={w.href} href={w.href} className="lift group bg-card border p-7">
              <w.icon className="size-7" strokeWidth={1.4} />
              <div className="label text-muted-foreground mt-5">{w.tag}</div>
              <h3 className="font-serif mt-1 text-xl font-semibold">{w.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{w.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                ひらく
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
