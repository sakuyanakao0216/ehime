import { highlights } from '@/lib/mock/highlights'
import { cn } from '@/lib/utils'

const kindTone: Record<string, string> = {
  結果: 'bg-foreground text-background',
  成立: 'bg-brand text-brand-foreground',
  マッチ: 'bg-emerald-500/15 text-emerald-600',
  ニュース: 'bg-secondary text-secondary-foreground',
}

/** スポーツハイライト: 直近の出来事・ニュースを横スクロールで一望。 */
export function HighlightsStrip() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="bg-brand inline-block size-1.5 animate-pulse rounded-full" />
        <span className="label text-brand">Sports Highlights</span>
        <span className="text-muted-foreground text-xs">いまの愛媛スポーツ</span>
      </div>
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {highlights.map((h) => (
          <article
            key={h.id}
            className="card-soft flex w-64 shrink-0 snap-start flex-col gap-2 p-4 sm:w-72"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{h.emoji}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  kindTone[h.kind] ?? 'bg-secondary',
                )}
              >
                {h.kind}
              </span>
              <span className="text-muted-foreground ml-auto text-[11px]">{h.when}</span>
            </div>
            <p className="text-foreground/90 text-sm leading-relaxed">{h.text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
