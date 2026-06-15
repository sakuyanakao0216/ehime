import { ArrowRight, Handshake, type LucideIcon, School } from 'lucide-react'
import Link from 'next/link'
import { EventHub } from '@/components/blocks/event-hub'
import { cn } from '@/lib/utils'

const wheels: {
  href: string
  icon: LucideIcon
  tag: string
  title: string
  body: string
  gradient: string
}[] = [
  {
    href: '/connect',
    icon: Handshake,
    tag: 'みんなで',
    title: 'つながる',
    body: '観戦やジム好きのまま、学生のイベントにゆる〜く参加。気づけばスポーツを支える側に。',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    href: '/operator',
    icon: School,
    tag: '学校・クラブ',
    title: 'ささえる',
    body: '「人が集まらない・指導者がいない」を投稿。AI が県内の候補から広域でつなぎます。',
    gradient: 'from-orange-500 to-rose-600',
  },
]

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      {/* Hero: スポーツ情報ハブとしての位置づけ */}
      <section className="py-12 sm:py-16">
        <div className="text-primary mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
          <span className="bg-primary inline-block h-px w-6" />
          All Ehime Sports
        </div>
        <h1 className="max-w-2xl text-4xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-6xl">
          愛媛のスポーツが、
          <br />
          <span className="text-brand">ひとつになる。</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed sm:text-lg">
          今日のプロ観戦も、地域の体験会も、学校の試合も。
          見て、行って、楽しむうちに、スポーツを支える仲間になれる。
        </p>
      </section>

      {/* メイン: イベント情報ハブ（リスト＆地図・割引） */}
      <section className="mb-16">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">スポーツイベントをさがす</h2>
        </div>
        <EventHub />
      </section>

      {/* 両輪への入口 */}
      <section>
        <h2 className="mb-1 text-center text-xl font-bold">楽しむだけじゃない、関われる</h2>
        <p className="text-muted-foreground mb-5 text-center text-sm">
          あなたの「好き」が、子どもたちのスポーツを支える力になります。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {wheels.map((w) => (
            <Link
              key={w.href}
              href={w.href}
              className="lift group bg-card relative overflow-hidden rounded-3xl border p-6 shadow-sm"
            >
              <div
                className={cn(
                  'mb-3 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm',
                  w.gradient,
                )}
              >
                <w.icon className="size-6" />
              </div>
              <div className="text-muted-foreground text-xs font-medium">{w.tag}</div>
              <h3 className="text-xl font-bold">{w.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{w.body}</p>
              <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-bold">
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
