import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const roles = [
  {
    href: '/operator',
    emoji: '🏫',
    title: '学校・クラブの方',
    sub: '指導者をさがしたい',
    body: '「専門の指導者がいない…」を解決。募集を出すと、AI が県内からぴったりの先生を提案します。',
    cta: '指導者をさがす',
    gradient: 'from-orange-400 to-rose-500',
  },
  {
    href: '/instructor',
    emoji: '🙌',
    title: '指導者の方',
    sub: '教えて地域に貢献したい',
    body: '空いた時間で OK。近くの・オンラインで関われる募集にサッと応募。感謝と実績が積み上がります。',
    cta: '募集をさがす',
    gradient: 'from-sky-400 to-indigo-500',
  },
]

/** 「あなたはどっち？」— 誰が使うアプリかを最初に明確にする役割選択。 */
export function RoleChooser() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {roles.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          className="lift group bg-card relative overflow-hidden rounded-3xl border p-6 shadow-sm"
        >
          <div
            className={cn(
              'mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl shadow-sm',
              r.gradient,
            )}
          >
            {r.emoji}
          </div>
          <div className="text-muted-foreground text-xs font-medium">{r.sub}</div>
          <h3 className="mt-0.5 text-xl font-bold">{r.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{r.body}</p>
          <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-bold">
            {r.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  )
}
