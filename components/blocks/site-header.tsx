'use client'

import type { LucideIcon } from 'lucide-react'
import { CalendarDays, Handshake, School, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'イベント', icon: CalendarDays },
  { href: '/connect', label: 'つながる', icon: Handshake },
  { href: '/operator', label: 'ささえる', icon: School },
  { href: '/me', label: 'マイページ', icon: User },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="glass mx-auto flex h-14 max-w-5xl items-center gap-2 rounded-2xl border px-3 shadow-sm">
        <Link href="/" className="mr-1 flex items-center gap-2.5">
          <span className="bg-brand flex size-8 items-center justify-center rounded-xl font-extrabold text-white shadow-sm">
            S
          </span>
          <span className="leading-none">
            <span className="block text-sm font-bold tracking-tight">スポえひめ</span>
            <span className="text-muted-foreground hidden text-[10px] font-medium tracking-wide sm:block">
              ALL EHIME SPORTS
            </span>
          </span>
        </Link>
        {/* デスクトップナビ */}
        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

/** スマホ用の下部タブナビ。 */
export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
      <div className="glass mx-3 mb-3 flex items-center justify-around rounded-2xl border py-1.5 shadow-lg">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <item.icon className={cn('size-5', active && 'fill-primary/15')} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
