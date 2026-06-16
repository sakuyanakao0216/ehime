'use client'

import type { LucideIcon } from 'lucide-react'
import { CalendarDays, ClipboardList, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

type Item = { href: string; label: string; icon: LucideIcon }

// 参加者（一般ユーザー）向け
const PARTICIPANT_NAV: Item[] = [
  { href: '/', label: 'イベント', icon: CalendarDays },
  { href: '/me', label: 'マイページ', icon: User },
]
// 募集側（学校・クラブ）向け — 別タブとして分離
const OPERATOR_NAV: Item[] = [
  { href: '/operator', label: '募集ダッシュボード', icon: ClipboardList },
]

function isOperatorArea(pathname: string) {
  return pathname.startsWith('/operator') || pathname === '/instructors'
}
function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const operator = isOperatorArea(pathname)
  const nav = operator ? OPERATOR_NAV : PARTICIPANT_NAV
  return (
    <header className="glass sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-5">
        <Link href={operator ? '/operator' : '/'} className="flex items-center gap-2">
          <Logo />
          {operator && (
            <span className="label text-muted-foreground hidden sm:block">募集ダッシュボード</span>
          )}
        </Link>

        <nav className="ml-auto hidden items-center gap-7 sm:flex">
          {nav.map((item) => {
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
          {/* もう一方のユーザーへの控えめな入口 */}
          <Link
            href={operator ? '/' : '/operator'}
            className="text-muted-foreground hover:border-foreground/40 rounded-full border px-3 py-1 text-xs"
          >
            {operator ? '← 参加者画面へ' : '学校・クラブの方'}
          </Link>
        </nav>
      </div>
    </header>
  )
}

/** スマホ用の下部タブナビ（モードに応じて切替）。 */
export function BottomNav() {
  const pathname = usePathname()
  const operator = isOperatorArea(pathname)
  const nav = operator ? OPERATOR_NAV : PARTICIPANT_NAV
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t sm:hidden">
      <div className="flex items-stretch">
        {nav.map((item) => {
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
        {/* モード切替 */}
        <Link
          href={operator ? '/' : '/operator'}
          className="text-muted-foreground flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] tracking-wide"
        >
          {operator ? (
            <>
              <CalendarDays className="size-5" strokeWidth={1.5} />
              参加者
            </>
          ) : (
            <>
              <ClipboardList className="size-5" strokeWidth={1.5} />
              募集する
            </>
          )}
        </Link>
      </div>
    </nav>
  )
}
