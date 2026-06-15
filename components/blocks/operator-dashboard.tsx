'use client'

import { Handshake, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AiMatchPanel } from '@/components/blocks/ai-match-panel'
import { CollabCard } from '@/components/blocks/collab-card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { activities, cities, cityById } from '@/lib/mock/data'
import { collabEvents } from '@/lib/mock/events'
import type { Recruitment, Weekday } from '@/lib/mock/types'
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

/** 募集ダッシュボード: 「AIおすすめ」と「AI検索」を1画面に。候補はどちらも匿名。 */
export function OperatorDashboard({ featured }: { featured: Recruitment }) {
  return (
    <Tabs defaultValue="recommend">
      <TabsList className="mb-5 w-full max-w-md">
        <TabsTrigger value="recommend" className="flex-1 gap-1.5">
          <Sparkles className="size-4" />
          AIおすすめ
        </TabsTrigger>
        <TabsTrigger value="search" className="flex-1 gap-1.5">
          <Search className="size-4" />
          AI検索
        </TabsTrigger>
        <TabsTrigger value="collab" className="flex-1 gap-1.5">
          <Handshake className="size-4" />
          コラボ
        </TabsTrigger>
      </TabsList>

      {/* おすすめ: いまの募集に対する自動提案 */}
      <TabsContent value="recommend">
        <p className="text-muted-foreground mb-4 text-sm">
          いまの募集「{featured.org}」に合う候補を、AI が自動で提案します。
        </p>
        <AiMatchPanel
          autoRun
          anonymous
          criteria={{
            activityId: featured.activityId,
            region: featured.region,
            cityId: featured.cityId,
            requiredDays: featured.requiredDays,
            onlineOk: featured.onlineOk,
            level: featured.level,
          }}
        />
      </TabsContent>

      {/* 検索: 条件を指定して候補を探す */}
      <TabsContent value="search">
        <SearchPanel />
      </TabsContent>

      {/* コラボ: 近くの学校・ジム・プロとの統合イベント（成立型） */}
      <TabsContent value="collab">
        <p className="text-muted-foreground mb-4 text-sm">
          指導者だけでなく、近くの学校・ジム・プロと AI
          が統合イベントを企画。賛同が集まれば実施されます。
        </p>
        <div className="space-y-4">
          {collabEvents.map((e) => (
            <CollabCard key={e.id} event={e} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function SearchPanel() {
  const [activityId, setActivityId] = useState('brass')
  const [cityId, setCityId] = useState('uwajima')
  const [days, setDays] = useState<Weekday[]>(['火', '木'])
  const [onlineOk, setOnlineOk] = useState(true)
  const [level, setLevel] = useState<string>('基礎指導')
  const [criteria, setCriteria] = useState<Criteria | null>(null)
  const [runKey, setRunKey] = useState(0)

  function toggleDay(d: Weekday) {
    setDays((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))
  }
  function submit() {
    const region = cityById(cityId)?.region ?? '中予'
    setCriteria({ activityId, region, cityId, requiredDays: days, onlineOk, level })
    setRunKey((k) => k + 1)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* 条件 */}
      <div className="bg-card h-fit space-y-4 rounded-lg border p-4">
        <Field label="種目">
          <Select value={activityId} onValueChange={setActivityId}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activities.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="所在地">
          <Select value={cityId} onValueChange={setCityId}>
            <SelectTrigger className="w-full">
              <SelectValue />
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
        <Field label="活動曜日">
          <div className="flex flex-wrap gap-1.5">
            {WEEKDAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={cn(
                  'flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors',
                  days.includes(d)
                    ? 'bg-foreground text-background border-transparent'
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
        <Field label="オンライン">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={onlineOk ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setOnlineOk(true)}
            >
              可
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
        </Field>
        <Button className="w-full" onClick={submit}>
          <Sparkles />
          AIで候補を検索
        </Button>
      </div>

      {/* 結果（匿名） */}
      <div>
        {criteria ? (
          <AiMatchPanel key={runKey} autoRun anonymous criteria={criteria} />
        ) : (
          <div className="text-muted-foreground flex h-full min-h-56 items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm">
            条件を選んで「AIで候補を検索」を押してください
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      {children}
    </div>
  )
}
