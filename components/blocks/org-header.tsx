import { School } from 'lucide-react'
import { activityById, cityById } from '@/lib/mock/data'
import { myOrg } from '@/lib/mock/org'

/** 募集ダッシュボード上部に置く「自分の組織」情報。 */
export function OrgHeader() {
  const city = cityById(myOrg.cityId)
  return (
    <div className="card-soft mb-6 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-brand/10 text-brand ring-brand/15 flex size-12 shrink-0 items-center justify-center rounded-xl ring-1">
            <School className="size-6" />
          </div>
          <div className="min-w-0">
            <div className="label text-muted-foreground">My Organization</div>
            <h2 className="display mt-0.5 text-lg leading-snug font-bold sm:text-xl">
              {myOrg.name}
            </h2>
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
              <span>{myOrg.type}</span>
              <span className="bg-border h-3 w-px" />
              <span>
                {city?.name}・{myOrg.region}
              </span>
            </div>
          </div>
        </div>

        {/* 状況サマリー */}
        <div className="flex shrink-0 gap-6 sm:gap-8">
          <Stat value={myOrg.activeRecruitments} label="募集中" />
          <Stat value={myOrg.matched} label="マッチ成立" accent />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-muted-foreground text-xs font-medium">主な部活</span>
        {myOrg.activities.map((id) => (
          <span key={id} className="bg-secondary/70 rounded-full px-2.5 py-0.5 text-xs font-medium">
            {activityById(id)?.name ?? id}
          </span>
        ))}
        <span className="text-muted-foreground ml-auto hidden text-xs sm:inline">{myOrg.note}</span>
      </div>
    </div>
  )
}

function Stat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <div className={`display text-2xl leading-none font-bold ${accent ? 'text-brand' : ''}`}>
        {value}
      </div>
      <div className="text-muted-foreground mt-1 text-xs">{label}</div>
    </div>
  )
}
