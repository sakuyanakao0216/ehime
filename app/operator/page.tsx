import { OperatorDashboard } from '@/components/blocks/operator-dashboard'
import { OrgHeader } from '@/components/blocks/org-header'
import { RegionMeter } from '@/components/blocks/region-meter'
import { RoleBanner } from '@/components/blocks/role-banner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recruitments } from '@/lib/mock/data'

// デモの主役: 宇和島の吹奏楽（南予・急募・オンライン可）
const featured = recruitments.find((r) => r.id === 'r01') ?? recruitments[0]

export default function OperatorPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <RoleBanner
        roleLabel="募集ダッシュボード ・ 学校・クラブ"
        description="AI のおすすめと検索で、匿名の候補を見つけて気軽に相談できます。"
      />

      <OrgHeader />

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <OperatorDashboard featured={featured} />
        </div>

        {/* サイド: 地域の充足状況 */}
        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="display text-base">地域の充足状況</CardTitle>
            </CardHeader>
            <CardContent>
              <RegionMeter />
              <p className="text-muted-foreground mt-4 border-t pt-3 text-xs leading-relaxed">
                南予は指導者が足りていません。<strong>オンライン可</strong>{' '}
                にすると、松山など他地域の候補にも相談できます。
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
