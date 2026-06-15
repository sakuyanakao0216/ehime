'use client'

import { Citrus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/operator', label: '学校・クラブの方', emoji: '🏫' },
  { href: '/instructor', label: '指導者の方', emoji: '🙌' },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="glass mx-auto flex h-14 max-w-6xl items-center gap-2 rounded-2xl border px-3 shadow-sm">
        <Link href="/" className="mr-1 flex items-center gap-2 font-bold">
          <span className="bg-brand flex size-9 items-center justify-center rounded-xl text-white shadow-sm">
            <Citrus className="size-5" />
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-sm">えひめ部活サポート</span>
            <span className="text-muted-foreground text-[11px] font-normal">
              オールえひめ 広域連携システム
            </span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1.5">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                  active ? 'bg-brand text-white shadow-sm' : 'hover:bg-muted text-foreground/80',
                )}
              >
                <span className="text-base leading-none">{item.emoji}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
          <Link
            href="/instructors"
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium transition-all',
              pathname === '/instructors'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            <Sparkles className="size-4" />
            <span className="hidden md:inline">指導者一覧</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
