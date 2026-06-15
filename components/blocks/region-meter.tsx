import { TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { regionStats } from '@/lib/mock/data'
import { cn } from '@/lib/utils'

/** 充足率の色分け。低いほど注意色（南予の空白を可視化）。 */
function tone(fill: number) {
  if (fill >= 70) return { bar: 'bg-success', label: '充実', text: 'text-success' }
  if (fill >= 50) return { bar: 'bg-warning', label: '要支援', text: 'text-warning' }
  return { bar: 'bg-destructive', label: '空白あり', text: 'text-destructive' }
}

/**
 * 地域の盛り上がりメーター（東予・中予・南予の充足率）。
 * 偏在を一目で示し、県・市町の重点投下の根拠にする。
 */
export function RegionMeter({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {regionStats.map((s) => {
        const t = tone(s.fillRate)
        return (
          <div key={s.region}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="font-medium">{s.region}</span>
              <span className={cn('flex items-center gap-1 font-semibold', t.text)}>
                {s.fillRate}%
                <span className="text-muted-foreground text-xs font-normal">{t.label}</span>
              </span>
            </div>
            <Progress value={s.fillRate} indicatorClassName={t.bar} />
            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
              <span>募集 {s.recruitments}件</span>
              <span>指導者 {s.instructors}名</span>
              <span className="flex items-center gap-0.5">
                <TrendingUp className="size-3" />
                30日で{s.recentMatches}件成立
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
