'use client'

import { Building2, Citrus, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/operator', label: '運営者', icon: Building2 },
  { href: '/instructors', label: '指導者をさがす', icon: Users },
  { href: '/instructor', label: '指導者マイページ', icon: Citrus },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link href="/" className="mr-2 flex items-center gap-2 font-bold">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Citrus className="size-5" />
          </span>
          <span className="leading-tight">
            広域連携システム
            <span className="text-muted-foreground ml-1.5 hidden text-xs font-normal sm:inline">
              オールえひめ
            </span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <item.icon className="size-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
