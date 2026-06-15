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
    <header className="glass sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="bg-brand size-2.5 rounded-[2px]" />
          <span className="leading-none">
            <span className="font-serif block text-base font-semibold tracking-wide">
              スポえひめ
            </span>
          </span>
        </Link>
        {/* デスクトップナビ（テキスト＋下線アクティブ） */}
        <nav className="ml-auto hidden items-center gap-7 sm:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative py-1 text-sm transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {active && <span className="bg-brand absolute -bottom-px left-0 h-0.5 w-full" />}
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
    <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t sm:hidden">
      <div className="flex items-stretch">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] tracking-wide transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <item.icon className="size-5" strokeWidth={active ? 2 : 1.5} />
              {item.label}
              {active && <span className="bg-brand h-0.5 w-5 rounded-full" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
