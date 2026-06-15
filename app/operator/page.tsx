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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <RoleBanner
        emoji="🏫"
        roleLabel="学校・クラブの方"
        description="宇和島市立 城北中学校 さん、こんにちは。困っている部活に指導者を見つけましょう。"
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">あなたの募集</h1>
          <p className="text-muted-foreground text-sm">
            出している募集に、AI がぴったりの指導者を提案します。
          </p>
        </div>
        <Button asChild className="bg-brand rounded-full text-white">
          <Link href="/operator/recruit/new">
            <Plus />
            新しく募集する
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* メイン: いまの募集 + AI 推薦 */}
        <div className="space-y-6">
          <RecruitmentCard recruitment={featured} />
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
        </div>

        {/* サイド: 地域メーター */}
        <aside className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">地域の盛り上がり 🗺️</CardTitle>
            </CardHeader>
            <CardContent>
              <RegionMeter />
              <p className="text-muted-foreground mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed">
                💡 南予は指導者が足りていません。
                <strong>オンラインOK</strong> にすると、松山など他地域の先生にもお願いできます。
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
