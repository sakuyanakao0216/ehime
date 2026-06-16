import { OperatorDashboard } from '@/components/blocks/operator-dashboard'
import { OrgHeader } from '@/components/blocks/org-header'
import { RegionStatus } from '@/components/blocks/region-status'
import { RoleBanner } from '@/components/blocks/role-banner'
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
          <RegionStatus />
        </aside>
      </div>
    </main>
  )
}
