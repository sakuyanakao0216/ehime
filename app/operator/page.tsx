import { Plus } from 'lucide-react'
import Link from 'next/link'
import { AiMatchPanel } from '@/components/blocks/ai-match-panel'
import { RecruitmentCard } from '@/components/blocks/recruitment-card'
import { RegionMeter } from '@/components/blocks/region-meter'
import { RoleBanner } from '@/components/blocks/role-banner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recruitments } from '@/lib/mock/data'

// デモの主役: 宇和島の吹奏楽（南予・急募・オンライン可）= 偏在をオンラインで埋める好例
const featured = recruitments.find((r) => r.id === 'r01') ?? recruitments[0]

export default function OperatorPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <RoleBanner
        roleLabel="ささえる ・ 学校・クラブ"
        description="宇和島市立 城北中学校 さん、こんにちは。困りごとを出すと、県内の指導者候補から広域でつなぎます。"
      />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">あなたの募集</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            AI が匿名の候補を提案。気軽に相談してから決められます。
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/instructors">候補をさがす</Link>
          </Button>
          <Button asChild>
            <Link href="/operator/recruit/new">
              <Plus />
              新しく募集する
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* メイン: いまの募集 + AI 推薦 */}
        <div className="space-y-6">
          <RecruitmentCard recruitment={featured} />
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
        </div>

        {/* サイド: 地域メーター */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">地域の充足状況</CardTitle>
            </CardHeader>
            <CardContent>
              <RegionMeter />
              <p className="text-muted-foreground mt-4 border-t pt-3 text-xs leading-relaxed">
                南予は指導者が足りていません。<strong>オンライン可</strong>{' '}
                にすると、松山など他地域の先生にもお願いできます。
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
