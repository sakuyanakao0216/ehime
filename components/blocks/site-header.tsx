'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/connect', label: 'つながる', emoji: '🤝' },
  { href: '/operator', label: 'ささえる', emoji: '🏫' },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="glass mx-auto flex h-14 max-w-5xl items-center gap-2 rounded-2xl border px-3 shadow-sm">
        <Link href="/" className="mr-1 flex items-center gap-2 font-bold">
          <span className="bg-brand flex size-9 items-center justify-center rounded-xl text-lg text-white shadow-sm">
            🍊
          </span>
          <span className="leading-none">
            <span className="block text-sm">スポえひめ</span>
            <span className="text-muted-foreground hidden text-[11px] font-normal sm:block">
              オールえひめ スポーツ
            </span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <NavLink href="/" active={pathname === '/'} emoji="🗓️" label="イベント" />
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              emoji={item.emoji}
              label={item.label}
            />
          ))}
          <Link
            href="/me"
            aria-label="マイページ"
            className={cn(
              'flex size-9 items-center justify-center rounded-full text-sm font-bold transition-all',
              pathname === '/me' ? 'bg-brand text-white shadow-sm' : 'bg-muted hover:bg-muted/70',
            )}
          >
            🙂
          </Link>
        </nav>
      </div>
    </header>
  )
}

function NavLink({
  href,
  active,
  emoji,
  label,
}: {
  href: string
  active: boolean
  emoji: string
  label: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
        active ? 'bg-brand text-white shadow-sm' : 'hover:bg-muted text-foreground/80',
      )}
    >
      <span className="text-base leading-none">{emoji}</span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}
