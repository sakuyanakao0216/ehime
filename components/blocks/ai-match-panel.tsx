'use client'

import { MapPin, PartyPopper, Sparkles, Star, Video } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cityById } from '@/lib/mock/data'
import type { Instructor } from '@/lib/mock/types'
import { cn } from '@/lib/utils'
import { avatarGradient, emojiFor } from '@/lib/visual'

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

function scoreColor(score: number) {
  if (score >= 80) return 'from-emerald-400 to-teal-500'
  if (score >= 60) return 'from-orange-400 to-amber-500'
  return 'from-slate-400 to-slate-500'
}

function Confetti() {
  const pieces = ['🎉', '🎊', '🍊', '⭐', '✨', '🎈', '💫', '🧡']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={p}
          className="animate-confetti absolute top-0 text-lg"
          style={{
            left: `${8 + i * 11}%`,
            animationDelay: `${(i % 4) * 0.08}s`,
          }}
        >
          {p}
        </span>
      ))}
    </div>
  )
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

  const run = useCallback(async () => {
    setLoading(true)
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行する
  useEffect(() => {
    if (autoRun) void run()
  }, [])

  return (
    <div className="space-y-4">
      {/* コア機能のわかりやすい見出し */}
      <div className="bg-brand flex items-center gap-3 rounded-2xl p-4 text-white shadow-sm">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/20 text-2xl backdrop-blur">
          ✨
        </span>
        <div className="flex-1">
          <h2 className="font-bold">AI のおすすめ指導者</h2>
          <p className="text-xs text-white/90">条件にぴったりの先生を、理由つきで提案します</p>
        </div>
        <Button
          onClick={run}
          disabled={loading}
          size="sm"
          variant="secondary"
          className="rounded-full"
        >
          {loading ? '探し中…' : 'もう一度'}
        </Button>
      </div>

      {source && !loading && (
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          <Sparkles className="size-3" />
          {source === 'ai' ? 'AI が県内の指導者から選びました' : '条件マッチングで選びました'}
        </p>
      )}

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-muted/50 h-32 animate-pulse rounded-2xl border" />
          ))}
        </div>
      )}

      {!loading &&
        results.map((r, idx) => {
          const ins = r.instructor
          const city = cityById(ins.cityId)
          const isRequested = requested === ins.id
          return (
            <Card key={ins.id} className="lift relative overflow-hidden py-0">
              {isRequested && <Confetti />}
              {idx === 0 && (
                <span className="absolute top-0 left-0 z-10 rounded-br-2xl bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950">
                  👑 イチオシ
                </span>
              )}
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3 pt-3">
                  <div
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white',
                      avatarGradient(ins.id),
                    )}
                  >
                    {ins.name.replace(/\s/g, '').slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{ins.name}</h3>
                    <p className="text-muted-foreground truncate text-sm">{ins.headline}</p>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3" />
                        {city?.name}
                      </span>
                      {ins.onlineAvailable && (
                        <span className="text-info flex items-center gap-0.5">
                          <Video className="size-3" />
                          オンラインOK
                        </span>
                      )}
                      <span className="flex items-center gap-0.5">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {ins.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {/* マッチ度のリング風バッジ */}
                  <div
                    className={cn(
                      'flex size-14 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm',
                      scoreColor(r.score),
                    )}
                  >
                    <span className="text-lg leading-none font-extrabold">{r.score}</span>
                    <span className="text-[9px] opacity-90">マッチ</span>
                  </div>
                </div>

                <p className="bg-primary/5 rounded-xl p-3 text-sm leading-relaxed">
                  {emojiFor(ins.specialties[0])} {r.reason}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {r.highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>

                {isRequested ? (
                  <div className="animate-pop flex items-center gap-2 rounded-xl bg-emerald-500 p-3 text-sm font-bold text-white">
                    <PartyPopper className="size-5" />
                    {ins.name}さんに依頼しました！担当者が調整します 🎉
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      className="bg-brand flex-1 rounded-full text-white"
                      onClick={() => setRequested(ins.id)}
                    >
                      この先生にお願いする
                    </Button>
                    <Button variant="outline" className="rounded-full">
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
