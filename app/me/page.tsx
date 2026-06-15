import Link from 'next/link'
import { Stairway } from '@/components/blocks/stairway'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { activityById } from '@/lib/mock/data'
import { me } from '@/lib/mock/me'
import { emojiFor } from '@/lib/visual'

export default function MyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* プロフィールヘッダー */}
      <Card className="mb-6 gap-0 overflow-hidden py-0">
        <div className="bg-brand flex items-center gap-4 p-5 text-white">
          <div className="flex size-16 items-center justify-center rounded-full bg-white/25 text-2xl font-bold backdrop-blur">
            {me.initial}
          </div>
          <div>
            <h1 className="text-xl font-bold">マイスポーツ</h1>
            <p className="text-sm text-white/90">
              ポイント {me.points}pt ・ 観戦{me.stats.watched}・参加
              {me.stats.joined}・手伝い{me.stats.helped}
            </p>
          </div>
        </div>
        <CardContent className="space-y-4 p-5">
          {/* 好き・得意（嗜好プロファイル） */}
          <div>
            <h2 className="mb-2 text-sm font-bold">好き・得意なスポーツ</h2>
            <div className="flex flex-wrap gap-1.5">
              {me.favoriteSports.map((s) => (
                <span key={s} className="bg-muted rounded-full px-3 py-1 text-sm font-medium">
                  {emojiFor(s)} {activityById(s)?.name}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{me.sportsHistory}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 関わりの階段 */}
        <div>
          <h2 className="mb-1 text-xl font-bold">関わりの階段</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            観るところから、あなたのペースで。一段あがるたびに、できることが増えます。
          </p>
          <Stairway current={me.currentStep} progress={me.progressToNext} />
          <Button asChild className="bg-brand mt-4 rounded-full text-white">
            <Link href="/connect">次の一歩をさがす</Link>
          </Button>
        </div>

        {/* サイド: 行動ログ＆特典 */}
        <aside className="space-y-5">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">さいきんの行動</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {me.recentActivity.map((a) => (
                <div key={a.text} className="flex items-start gap-2 text-sm">
                  <span className="text-lg leading-none">{a.emoji}</span>
                  <div className="min-w-0">
                    <p className="leading-snug">{a.text}</p>
                    <span className="text-muted-foreground text-xs">{a.when}</span>
                  </div>
                </div>
              ))}
              <p className="text-muted-foreground rounded-xl bg-sky-50 p-2.5 text-xs leading-relaxed">
                こうした行動から、AI があなたに合うつながりイベントを提案します。
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">使える特典</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {me.perks.map((p) => (
                <div
                  key={p.text}
                  className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-sm font-medium text-amber-800"
                >
                  <span className="text-lg leading-none">{p.emoji}</span>
                  {p.text}
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
