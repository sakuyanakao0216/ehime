'use client'

import { Search, Video } from 'lucide-react'
import { useMemo, useState } from 'react'
import { InstructorCard } from '@/components/blocks/instructor-card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { activities, instructors } from '@/lib/mock/data'
import type { Region } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

const REGIONS: (Region | 'すべて')[] = ['すべて', '東予', '中予', '南予']

export default function InstructorsPage() {
  const [activityId, setActivityId] = useState('all')
  const [region, setRegion] = useState<Region | 'すべて'>('すべて')
  const [onlineOnly, setOnlineOnly] = useState(false)

  const filtered = useMemo(() => {
    return instructors.filter((i) => {
      if (activityId !== 'all' && !i.specialties.includes(activityId)) return false
      if (region !== 'すべて' && i.region !== region) return false
      if (onlineOnly && !i.onlineAvailable) return false
      return true
    })
  }, [activityId, region, onlineOnly])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-serif mb-1 text-2xl font-semibold">指導者をさがす</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        市町の枠を越えて、愛媛じゅうの先生から選べます。種目・地域でしぼりこみ。
      </p>

      {/* フィルタ */}
      <div className="bg-card mb-6 flex flex-wrap items-end gap-3 rounded-2xl border p-4 shadow-sm">
        <div className="space-y-1.5">
          <span className="text-muted-foreground text-xs font-medium">種目</span>
          <Select value={activityId} onValueChange={setActivityId}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての種目</SelectItem>
              {activities.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <span className="text-muted-foreground text-xs font-medium">地域</span>
          <div className="flex gap-1">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={cn(
                  'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                  region === r
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant={onlineOnly ? 'default' : 'outline'}
          onClick={() => setOnlineOnly((v) => !v)}
        >
          <Video />
          オンライン可のみ
        </Button>

        <div className="text-muted-foreground ml-auto flex items-center gap-1 text-sm">
          <Search className="size-4" />
          {filtered.length}名
        </div>
      </div>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
          条件に合う指導者が見つかりませんでした。
          <br />
          オンライン可を含めると、地域を越えた候補が見つかることがあります。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i) => (
            <InstructorCard key={i.id} instructor={i} />
          ))}
        </div>
      )}
    </main>
  )
}
