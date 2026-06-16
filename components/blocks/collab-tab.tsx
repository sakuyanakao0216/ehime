'use client'

import { Plus, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { CollabCard } from '@/components/blocks/collab-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { activities, activityById, cities, cityById } from '@/lib/mock/data'
import { type CollabEvent, type CollabPartner, collabEvents } from '@/lib/mock/events'
import { myOrg } from '@/lib/mock/org'
import { cn } from '@/lib/utils'

const PARTNERS: CollabPartner[] = ['学校', 'ジム', 'プロ']
const partnerLabel = (p: CollabPartner) =>
  p === '学校' ? '近くの学校' : p === 'ジム' ? '地域のジム' : 'プロ'

/** コラボタブ: 既存のコラボ提案の閲覧＋自分の組織でコラボを企画（作成）。 */
export function CollabTab() {
  const [mine, setMine] = useState<CollabEvent[]>([])
  const [creating, setCreating] = useState(false)

  // フォーム
  const [activityId, setActivityId] = useState(myOrg.activities[0] ?? 'brass')
  const [cityId, setCityId] = useState(myOrg.cityId)
  const [dateLabel, setDateLabel] = useState('')
  const [partners, setPartners] = useState<CollabPartner[]>(['学校'])
  const [minToOpen, setMinToOpen] = useState(3)

  function togglePartner(p: CollabPartner) {
    setPartners((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }

  function create() {
    if (partners.length === 0) return
    const act = activityById(activityId)
    const city = cityById(cityId)
    const names = partners.map(partnerLabel)
    const ev: CollabEvent = {
      id: `co-mine-${mine.length + 1}`,
      title: `合同${act?.name ?? '活動'} — ${partners.join(' × ')}`,
      activityId,
      cityId,
      dateLabel: dateLabel.trim() || '日程調整中',
      partners,
      partnerLabel: names.join(' / '),
      aiReason: `${city?.name ?? '地域'}周辺の${names.join('・')}と連携。単独では人数・専門性が足りない活動も、合同なら成立します。`,
      joined: 1,
      minToOpen,
    }
    setMine((prev) => [ev, ...prev])
    setCreating(false)
    setDateLabel('')
    setPartners(['学校'])
  }

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          近くの学校・ジム・プロと AI が統合イベントを企画。賛同が集まれば実施されます。
        </p>
        <Button
          size="sm"
          variant={creating ? 'outline' : 'default'}
          onClick={() => setCreating((v) => !v)}
        >
          {creating ? (
            <>
              <X className="size-4" />
              閉じる
            </>
          ) : (
            <>
              <Plus className="size-4" />
              コラボを企画する
            </>
          )}
        </Button>
      </div>

      {/* 企画フォーム */}
      {creating && (
        <div className="card-soft mb-5 space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
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
            <Field label="開催地">
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
            <Field label="日程（任意）">
              <Input
                value={dateLabel}
                onChange={(e) => setDateLabel(e.target.value)}
                placeholder="例: 7/20(日) 午前・オンライン併用"
              />
            </Field>
            <Field label="成立に必要な団体数">
              <Select value={String(minToOpen)} onValueChange={(v) => setMinToOpen(Number(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}団体
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="連携したい相手">
            <div className="flex flex-wrap gap-1.5">
              {PARTNERS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePartner(p)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    partners.includes(p)
                      ? 'bg-foreground text-background border-transparent'
                      : 'bg-background hover:bg-muted',
                  )}
                >
                  {partnerLabel(p)}
                </button>
              ))}
            </div>
          </Field>

          <Button className="w-full" onClick={create} disabled={partners.length === 0}>
            <Sparkles className="size-4" />
            このコラボを企画する
          </Button>
        </div>
      )}

      {/* コラボ一覧（自分の企画を先頭に） */}
      <div className="space-y-4">
        {mine.map((e) => (
          <CollabCard key={e.id} event={e} mine />
        ))}
        {collabEvents.map((e) => (
          <CollabCard key={e.id} event={e} />
        ))}
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
