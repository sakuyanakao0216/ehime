import { Progress } from '@/components/ui/progress'
import { regionStats } from '@/lib/mock/data'
import { cn } from '@/lib/utils'

/** 充足率の色分けと気分（低いほど「みんなで応援しよう」）。 */
function tone(fill: number) {
  if (fill >= 70) return { bar: 'bg-emerald-500', label: 'いい感じ', emoji: '😄' }
  if (fill >= 50) return { bar: 'bg-amber-500', label: 'もう少し', emoji: '🙂' }
  return { bar: 'bg-rose-500', label: '応援募集中', emoji: '🙏' }
}

/** 地域の盛り上がりマップ（東予・中予・南予）。偏在を一目で示す。 */
export function RegionMeter({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {regionStats.map((s) => {
        const t = tone(s.fillRate)
        return (
          <div key={s.region}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-bold">{s.region}</span>
              <span className="flex items-center gap-1">
                <span className="font-bold">{s.fillRate}%</span>
                <span className="text-muted-foreground text-xs">
                  {t.emoji} {t.label}
                </span>
              </span>
            </div>
            <Progress value={s.fillRate} indicatorClassName={t.bar} />
            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
              <span>📣 募集 {s.recruitments}</span>
              <span>🧑‍🏫 指導者 {s.instructors}</span>
              <span>🤝 今月 {s.recentMatches}件</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
