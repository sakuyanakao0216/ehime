import Image from 'next/image'
import { ActivityIcon } from '@/components/activity-icon'
import { RegionMeter } from '@/components/blocks/region-meter'
import { imageForActivity } from '@/lib/activity-images'
import { activityById } from '@/lib/mock/data'
import { activeOrgs } from '@/lib/mock/org'

/** 地域の充足状況: 地図イラスト＋偏在メーター＋活動的な組織ピックアップ。 */
export function RegionStatus() {
  return (
    <div className="card-soft overflow-hidden">
      {/* ヘッダー（地図イラスト） */}
      <div className="relative h-24">
        <Image src="/images/generated/map.png" alt="" fill sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/15" />
        <div className="absolute bottom-3 left-4">
          <div className="label text-white/85">Region</div>
          <div className="display text-base font-bold text-white">地域の充足状況</div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <RegionMeter />

        <p className="text-muted-foreground border-t pt-4 text-xs leading-relaxed">
          南予は指導者が足りていません。<strong>オンライン可</strong>{' '}
          にすると、松山など他地域の候補にも相談できます。
        </p>

        {/* 活動的な組織ピックアップ */}
        <div className="border-t pt-4">
          <div className="label text-muted-foreground mb-3">活動的な組織</div>
          <div className="space-y-3">
            {activeOrgs.map((o) => {
              const img = imageForActivity(o.activityId)
              const act = activityById(o.activityId)
              return (
                <div key={o.id} className="flex items-center gap-3">
                  <div className="bg-muted text-foreground/70 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    {img ? (
                      <Image src={img} alt="" fill sizes="40px" className="object-cover" />
                    ) : (
                      act && <ActivityIcon name={act.icon} className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{o.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {o.region}・{o.note}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-brand text-sm font-bold">{o.recentMatches}</div>
                    <div className="text-muted-foreground text-[10px]">成立</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
