import { Flame } from 'lucide-react'
import { me } from '@/lib/mock/me'

/** ロイヤリティ: ランク・連続記録・ミッションで「また参加したい」を生む。 */
export function LoyaltyCard() {
  const { loyalty, missions, points } = me
  return (
    <div className="bg-card border">
      {/* ランク帯 */}
      <div className="flex items-center justify-between gap-4 border-b p-5">
        <div>
          <div className="label text-brand">Member Rank</div>
          <div className="display mt-1 text-2xl font-bold">{loyalty.tier}</div>
        </div>
        <div className="text-right">
          <div className="display text-3xl leading-none font-bold">{points}</div>
          <div className="label text-muted-foreground mt-1">Points</div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* 次ランクへの進捗 */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-medium">
              {loyalty.nextTier} まであと {loyalty.toNextPoints}pt
            </span>
            <span className="text-muted-foreground text-xs">{loyalty.tierProgress}%</span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-brand h-full rounded-full"
              style={{ width: `${loyalty.tierProgress}%` }}
            />
          </div>
        </div>

        {/* 連続記録 */}
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <Flame className="text-brand size-4" />
          <span className="font-bold">{loyalty.streakWeeks}週連続</span>
          <span className="text-muted-foreground text-xs">
            活動中。途切れる前に今週も参加しよう。
          </span>
        </div>

        {/* ミッション */}
        <div>
          <div className="label text-muted-foreground mb-2">今週のミッション</div>
          <div className="divide-border divide-y">
            {missions.map((m) => {
              const done = m.current >= m.goal
              return (
                <div
                  key={m.label}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <div className="min-w-0">
                    <p className={done ? 'text-muted-foreground line-through' : ''}>{m.label}</p>
                    <span className="text-muted-foreground text-xs">
                      {Math.min(m.current, m.goal)}/{m.goal}
                    </span>
                  </div>
                  <span
                    className={
                      done ? 'text-muted-foreground text-xs' : 'text-brand text-sm font-bold'
                    }
                  >
                    {done ? '達成' : `+${m.reward}pt`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
