import Link from 'next/link'
import { LoyaltyCard } from '@/components/blocks/loyalty-card'
import { Stairway } from '@/components/blocks/stairway'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { activityById } from '@/lib/mock/data'
import { me } from '@/lib/mock/me'

export default function MyPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      {/* プロフィールヘッダー */}
      <header className="mb-10 flex items-center gap-5 border-b pb-8">
        <div className="border-foreground/15 flex size-16 shrink-0 items-center justify-center rounded-full border text-2xl font-bold">
          {me.initial}
        </div>
        <div>
          <div className="label text-brand">My Sports</div>
          <h1 className="display mt-1 text-2xl font-bold">マイスポーツ</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {me.points} pt ・ 観戦 {me.stats.watched} ・ 参加 {me.stats.joined} ・ 手伝い{' '}
            {me.stats.helped}
          </p>
        </div>
      </header>

      {/* ロイヤリティ（ランク・連続・ミッション） */}
      <section className="mb-10">
        <LoyaltyCard />
      </section>

      {/* 好き・得意（嗜好プロファイル） */}
      <section className="mb-10">
        <div className="label text-muted-foreground mb-3">好き・得意なスポーツ</div>
        <div className="flex flex-wrap gap-1.5">
          {me.favoriteSports.map((s) => (
            <span key={s} className="border-border rounded-full border px-3 py-1 text-sm">
              {activityById(s)?.name}
            </span>
          ))}
        </div>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{me.sportsHistory}</p>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* 関わりの階段 */}
        <div>
          <div className="mb-4 border-b pb-3">
            <h2 className="display text-xl font-bold">関わりの階段</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              観るところから、あなたのペースで。一段あがるたびに、できることが増えます。
            </p>
          </div>
          <Stairway current={me.currentStep} progress={me.progressToNext} />
          <Button asChild className="mt-5">
            <Link href="/">次の一歩をさがす</Link>
          </Button>
        </div>

        {/* サイド: 行動ログ＆特典 */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="display text-base">さいきんの行動</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {me.recentActivity.map((a) => (
                <div key={a.text} className="text-sm">
                  <p className="leading-snug">{a.text}</p>
                  <span className="text-muted-foreground text-xs">{a.when}</span>
                </div>
              ))}
              <p className="text-muted-foreground border-t pt-3 text-xs leading-relaxed">
                こうした行動から、AI があなたに合うつながりイベントを提案します。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="display text-base">使える特典</CardTitle>
            </CardHeader>
            <CardContent className="divide-border divide-y">
              {me.perks.map((p) => (
                <div
                  key={p.text}
                  className="flex items-center gap-2 py-2.5 text-sm first:pt-0 last:pb-0"
                >
                  <span className="bg-brand size-1.5 rounded-full" />
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
