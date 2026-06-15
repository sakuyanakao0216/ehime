'use client'

import { CheckCircle2, MapPin, PartyPopper, Sparkles, Star, Video } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIcon } from '@/components/activity-icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { activityById, cityById } from '@/lib/mock/data'
import type { Instructor } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

type MatchCriteria = {
  activityId: string
  region: '東予' | '中予' | '南予'
  cityId?: string
  requiredDays: string[]
  onlineOk: boolean
  level?: string
}

type Result = {
  score: number
  reason: string
  highlights: string[]
  instructor: Instructor
}

function scoreTone(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-primary'
  return 'text-muted-foreground'
}

export function AiMatchPanel({
  criteria,
  autoRun = false,
}: {
  criteria: MatchCriteria
  autoRun?: boolean
}) {
  const [results, setResults] = useState<Result[]>([])
  const [source, setSource] = useState<'ai' | 'rule-based' | null>(null)
  const [loading, setLoading] = useState(false)
  const [requested, setRequested] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  const run = useCallback(async () => {
    setLoading(true)
    setStarted(true)
    setRequested(null)
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(criteria),
      })
      const data = await res.json()
      setResults(data.results ?? [])
      setSource(data.source ?? null)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [criteria])

  // autoRun: マウント時に一度だけ自動実行（criteria/run は意図的に依存に含めない）
  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行する
  useEffect(() => {
    if (autoRun) void run()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="text-primary size-5" />
          AI 推薦候補
        </h2>
        <Button onClick={run} disabled={loading} size="sm">
          {loading ? '探しています…' : started ? '再検索' : 'AIで指導者を探す'}
        </Button>
      </div>

      {source && !loading && (
        <p className="text-muted-foreground text-xs">
          {source === 'ai'
            ? 'AI が県内の指導者プールから条件に合う候補を選定しました'
            : '条件マッチング（ルールベース）で候補を選定しました'}
        </p>
      )}

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-muted/50 h-28 animate-pulse rounded-xl border" />
          ))}
        </div>
      )}

      {!loading &&
        results.map((r, idx) => {
          const ins = r.instructor
          const city = cityById(ins.cityId)
          const isRequested = requested === ins.id
          return (
            <Card key={ins.id} className="gap-3 py-4">
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="size-11">
                      <AvatarFallback className="bg-primary/15 text-primary font-semibold">
                        {ins.name.replace(/\s/g, '').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {idx === 0 && (
                      <span className="bg-primary text-primary-foreground absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
                        1
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">{ins.name}</h3>
                      <span className="text-muted-foreground flex items-center gap-0.5 text-xs">
                        <Star className="text-warning size-3 fill-current" />
                        {ins.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate text-sm">{ins.headline}</p>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3" />
                        {city?.name}
                      </span>
                      {ins.onlineAvailable && (
                        <span className="text-info flex items-center gap-0.5">
                          <Video className="size-3" />
                          オンライン可
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-2xl leading-none font-bold', scoreTone(r.score))}>
                      {r.score}
                    </div>
                    <div className="text-muted-foreground text-[10px]">マッチ度</div>
                  </div>
                </div>

                <p className="bg-muted/50 rounded-md p-2.5 text-sm leading-relaxed">{r.reason}</p>

                <div className="flex flex-wrap gap-1.5">
                  {r.highlights.map((h) => (
                    <Badge key={h} variant="accent" className="gap-1">
                      <CheckCircle2 className="size-3" />
                      {h}
                    </Badge>
                  ))}
                  {ins.specialties.slice(0, 1).map((s) => {
                    const act = activityById(s)
                    return (
                      act && (
                        <Badge key={s} variant="secondary" className="gap-1">
                          <ActivityIcon name={act.icon} className="size-3" />
                          {act.name}
                        </Badge>
                      )
                    )
                  })}
                </div>

                {isRequested ? (
                  <div className="bg-success/10 text-success animate-in fade-in zoom-in-95 flex items-center gap-2 rounded-md p-2.5 text-sm font-medium">
                    <PartyPopper className="size-4" />
                    {ins.name} さんに指導を依頼しました！担当コーディネーターが調整します🎉
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setRequested(ins.id)}>
                      この指導者に依頼する
                    </Button>
                    <Button size="sm" variant="outline">
                      プロフィール
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
