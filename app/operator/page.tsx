import { ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { AiMatchPanel } from '@/components/blocks/ai-match-panel'
import { RecruitmentCard } from '@/components/blocks/recruitment-card'
import { RegionMeter } from '@/components/blocks/region-meter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recruitments } from '@/lib/mock/data'

// デモの主役: 宇和島の吹奏楽（南予・急募・オンライン可）= 偏在をオンラインで埋める好例
const featured = recruitments.find((r) => r.id === 'r01') ?? recruitments[0]
const others = recruitments.filter((r) => r.id !== featured.id && r.status === '募集中').slice(0, 4)

export default function OperatorPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="secondary" className="mb-2">
            運営者ダッシュボード
          </Badge>
          <h1 className="text-2xl font-bold">宇和島市立 城北中学校</h1>
          <p className="text-muted-foreground text-sm">南予 ／ 部活動主任アカウント（デモ）</p>
        </div>
        <Button asChild>
          <Link href="/operator/recruit/new">
            <Plus />
            指導者を募集する
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* メイン: 注力中の募集 + AI 推薦 */}
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">注力中の募集</h2>
            <RecruitmentCard recruitment={featured} />
          </section>

          <section>
            <AiMatchPanel
              autoRun
              criteria={{
                activityId: featured.activityId,
                region: featured.region,
                cityId: featured.cityId,
                requiredDays: featured.requiredDays,
                onlineOk: featured.onlineOk,
                level: featured.level,
              }}
            />
          </section>
        </div>

        {/* サイド: 地域メーター + 他の募集 */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">地域の充足状況</CardTitle>
            </CardHeader>
            <CardContent>
              <RegionMeter />
              <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                南予は充足率が低く「空白あり」。オンライン指導で中予・東予の人材を
                活用すると、移動負担なく解消できます。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">近隣の募集</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {others.map((r) => (
                <Link
                  key={r.id}
                  href="/operator/recruit/new"
                  className="hover:bg-muted flex items-center justify-between gap-2 rounded-md p-2 text-sm transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.org}</span>
                    <span className="text-muted-foreground text-xs">{r.region}</span>
                  </span>
                  <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
