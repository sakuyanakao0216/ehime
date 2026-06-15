import { ChevronRight } from 'lucide-react'
import { stairway } from '@/lib/mock/me'
import { cn } from '@/lib/utils'

/**
 * 「関わりの階段」のトップ用ティザー（横並び・コンパクト）。
 * 初見ユーザーに “観る→指導者” の物語を最初に提示する。詳細は /me の Stairway。
 */
export function StairwayTeaser() {
  return (
    <div className="card-soft overflow-hidden p-6 sm:p-7">
      <div className="label text-brand">Stairway</div>
      <h3 className="display mt-1 text-lg font-bold text-balance sm:text-xl">
        “観る人”が、いつのまにか“支える人”に。
      </h3>
      <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed">
        いきなり指導者にならなくていい。ゆるい一歩を積み重ねるほど、関わりが一段ずつ上がる。
      </p>

      <ol className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {stairway.map((s, i) => (
          <li key={s.key} className="flex items-center gap-2 sm:flex-1">
            <div
              className={cn(
                'bg-secondary/60 flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5',
                i === stairway.length - 1 && 'bg-brand/10 ring-brand/20 ring-1',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  i === stairway.length - 1
                    ? 'bg-brand text-brand-foreground'
                    : 'border-border text-muted-foreground border',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-bold whitespace-nowrap">{s.label}</span>
            </div>
            {i < stairway.length - 1 && (
              <ChevronRight className="text-muted-foreground/50 size-4 shrink-0 rotate-90 sm:rotate-0" />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
