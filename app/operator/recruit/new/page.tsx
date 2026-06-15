'use client'

import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AiMatchPanel } from '@/components/blocks/ai-match-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { activities, cities, cityById } from '@/lib/mock/data'
import type { Weekday } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

const WEEKDAYS: Weekday[] = ['月', '火', '水', '木', '金', '土', '日']
const LEVELS = ['初心者歓迎', '基礎指導', '競技志向'] as const

type Criteria = {
  activityId: string
  region: '東予' | '中予' | '南予'
  cityId?: string
  requiredDays: string[]
  onlineOk: boolean
  level?: string
}

export default function NewRecruitPage() {
  const [activityId, setActivityId] = useState('brass')
  const [cityId, setCityId] = useState('uwajima')
  const [days, setDays] = useState<Weekday[]>(['火', '木'])
  const [onlineOk, setOnlineOk] = useState(true)
  const [level, setLevel] = useState<string>('基礎指導')
  const [criteria, setCriteria] = useState<Criteria | null>(null)
  const [runKey, setRunKey] = useState(0)

  function toggleDay(d: Weekday) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  function submit() {
    const region = cityById(cityId)?.region ?? '中予'
    setCriteria({ activityId, region, cityId, requiredDays: days, onlineOk, level })
    setRunKey((k) => k + 1)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Badge variant="secondary" className="mb-2">
        指導者を募集
      </Badge>
      <h1 className="font-serif mb-1 text-2xl font-semibold">
        募集条件を入力すると、AI が候補を提案します
      </h1>
      <p className="text-muted-foreground mb-6 text-sm">
        条件を選んで「AI に候補を出してもらう」を押すだけ。県全体の人材プールから探します。
      </p>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* 入力フォーム */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">募集条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Field label="種目">
              <Select value={activityId} onValueChange={setActivityId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="種目を選ぶ" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}（{a.kind}）
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="学校・クラブの所在地">
              <Select value={cityId} onValueChange={setCityId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="市町を選ぶ" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}（{c.region}）
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="活動する曜日">
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors',
                      days.includes(d)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted',
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="求めるレベル">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="オンライン指導">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={onlineOk ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setOnlineOk(true)}
                >
                  可（推奨）
                </Button>
                <Button
                  type="button"
                  variant={!onlineOk ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setOnlineOk(false)}
                >
                  対面のみ
                </Button>
              </div>
              <p className="text-muted-foreground mt-1.5 text-xs">
                オンライン可にすると、地域を越えた専門指導者も候補になります。
              </p>
            </Field>

            <Field label="背景・困りごと（任意）">
              <Textarea
                placeholder="例: 顧問の異動で専門指導者が不在に。廃部を避けたい。"
                rows={3}
              />
            </Field>

            <Button className="w-full" onClick={submit}>
              <Sparkles />
              AI に候補を出してもらう
            </Button>
          </CardContent>
        </Card>

        {/* 結果 */}
        <div>
          {criteria ? (
            <AiMatchPanel key={runKey} autoRun criteria={criteria} />
          ) : (
            <div className="text-muted-foreground flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed p-8 text-center text-sm">
              左の条件を入力して
              <br />
              「AI に候補を出してもらう」を押してください
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
