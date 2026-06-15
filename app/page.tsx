import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { EventHub } from '@/components/blocks/event-hub'
import { cn } from '@/lib/utils'

const wheels = [
  {
    href: '/connect',
    emoji: '🤝',
    tag: 'みんなで',
    title: 'つながる',
    body: '観戦やジム好きのまま、学生のイベントにゆる〜く参加。気づけばスポーツを支える側に。',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    href: '/operator',
    emoji: '🏫',
    tag: '学校・クラブ',
    title: 'ささえる',
    body: '「人が集まらない・指導者がいない」を投稿。AI が県内の候補から広域でつなぎます。',
    gradient: 'from-orange-400 to-rose-500',
  },
]

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20">
      {/* Hero: スポーツ情報ハブとしての位置づけ */}
      <section className="relative py-10 text-center sm:py-14">
        <span className="animate-float pointer-events-none absolute top-4 right-4 text-4xl opacity-80 sm:text-5xl">
          🍊
        </span>
        <div className="bg-brand mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm">
          オールえひめ スポーツ
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
          愛媛のスポーツ、
          <span className="text-brand">ぜんぶここに。</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-base leading-relaxed">
          今日のプロ観戦も、地域の体験会も、学校の試合も。
          見て、行って、お得に楽しむうちに、スポーツを支える仲間になれる。
        </p>
      </section>

      {/* メイン: イベント情報ハブ（リスト＆地図・割引） */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold">スポーツイベントをさがす 🗓️</h2>
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
                  'mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-sm',
                  w.gradient,
                )}
              >
                {w.emoji}
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
