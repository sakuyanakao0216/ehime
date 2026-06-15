'use client'

import { MapPin, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { ConsultChat } from '@/components/blocks/consult-chat'
import { Button } from '@/components/ui/button'
import { cityById } from '@/lib/mock/data'
import type { Instructor } from '@/lib/mock/types'

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

export function AiMatchPanel({
  criteria,
  autoRun = false,
  anonymous = false,
}: {
  criteria: MatchCriteria
  autoRun?: boolean
  /** 募集側ビュー: 実名を伏せ「候補 A/B…」で表示し、相談チャットを開く */
  anonymous?: boolean
}) {
  const [results, setResults] = useState<Result[]>([])
  const [source, setSource] = useState<'ai' | 'rule-based' | null>(null)
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)

  const run = useCallback(async () => {
    setLoading(true)
    setChatId(null)
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
    <div>
      {/* 見出し */}
      <div className="mb-4 flex items-end justify-between border-b pb-3">
        <div>
          <div className="label text-brand">AI Matching</div>
          <h2 className="display mt-1 text-xl font-bold">マッチ候補</h2>
        </div>
        <Button onClick={run} disabled={loading} variant="outline" size="sm">
          {loading ? '探しています…' : '再検索'}
        </Button>
      </div>

      {source && !loading && (
        <p className="text-muted-foreground mb-4 text-xs">
          {source === 'ai'
            ? 'AI が県内の候補から条件に合う人を選びました'
            : '条件マッチングで候補を選びました'}
        </p>
      )}

      {loading && (
        <div className="space-y-px">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-muted/50 h-28 animate-pulse border" />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {!loading &&
          results.map((r, idx) => {
            const ins = r.instructor
            const city = cityById(ins.cityId)
            // 募集側ビューは匿名（候補 A/B…）
            const label = anonymous ? `候補 ${String.fromCharCode(65 + idx)}` : ins.name
            const avatarChar = anonymous
              ? String.fromCharCode(65 + idx)
              : ins.name.replace(/\s/g, '').slice(0, 1)
            const chatOpen = chatId === ins.id
            return (
              <article key={ins.id} className="lift card-soft p-5">
                <div className="flex items-start gap-3">
                  <div className="border-foreground/15 text-foreground/80 flex size-11 shrink-0 items-center justify-center rounded-full border text-base font-bold">
                    {avatarChar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <span className="label text-brand">Best Match</span>}
                    </div>
                    <h3 className="display text-base font-bold">{label}</h3>
                    <p className="text-muted-foreground truncate text-xs">{ins.headline}</p>
                    <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="size-3" />
                        {city?.name}
                      </span>
                      {ins.onlineAvailable && <span>オンライン可</span>}
                      <span className="flex items-center gap-0.5">
                        <Star className="size-3 fill-current" />
                        {ins.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {/* マッチ度 */}
                  <div className="text-right">
                    <div className="display text-3xl leading-none font-bold">{r.score}</div>
                    <div className="label text-muted-foreground mt-1">Match</div>
                  </div>
                </div>

                <p className="text-foreground/80 mt-3 text-sm leading-relaxed">{r.reason}</p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {r.highlights.map((h) => (
                    <span key={h} className="text-muted-foreground flex items-center gap-1 text-xs">
                      <span className="bg-brand size-1 rounded-full" />
                      {h}
                    </span>
                  ))}
                </div>

                {anonymous ? (
                  chatOpen ? (
                    <ConsultChat candidateLabel={label} />
                  ) : (
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1" onClick={() => setChatId(ins.id)}>
                        気軽に相談してみる
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="mt-4 flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => setChatId(chatId === ins.id ? null : ins.id)}
                    >
                      相談してみる
                    </Button>
                    <Button variant="outline">プロフィール</Button>
                  </div>
                )}
                {!anonymous && chatOpen && <ConsultChat candidateLabel={ins.name} />}
              </article>
            )
          })}
      </div>
    </div>
  )
}
