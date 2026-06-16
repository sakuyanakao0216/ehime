import Image from 'next/image'
import Link from 'next/link'
import { ActivitySummary } from '@/components/blocks/activity-summary'
import { Stairway } from '@/components/blocks/stairway'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { activityById } from '@/lib/mock/data'
import { me } from '@/lib/mock/me'

export default function MyPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 sm:pb-10">
      {/* プロフィールヘッダー（ヒーロー画像） */}
      <header className="card-soft mt-6 mb-8 overflow-hidden">
        <div className="relative h-32 w-full sm:h-44">
          <Image
            src="/images/generated/mypage.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <div className="label text-white/85">My Sports</div>
            <div className="display text-2xl font-bold text-white sm:text-3xl">マイスポーツ</div>
          </div>
        </div>
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="border-card bg-muted relative z-10 -mt-14 flex size-16 items-center justify-center rounded-2xl border-4 text-2xl font-bold shadow-sm">
            {me.initial}
          </div>
          <div className="ml-auto flex gap-6 sm:gap-8">
            <Stat value={me.stats.watched} label="観戦" />
            <Stat value={me.stats.joined} label="参加" />
            <Stat value={me.stats.helped} label="手伝い" accent />
          </div>
        </div>
      </header>

      {/* 自分のスポーツ活動のまとめ */}
      <section className="mb-8">
        <ActivitySummary />
      </section>

      {/* 好き・得意（嗜好プロファイル） */}
      <section className="card-soft mb-8 p-5">
        <div className="label text-muted-foreground mb-3">好き・得意なスポーツ</div>
        <div className="flex flex-wrap gap-1.5">
          {me.favoriteSports.map((s) => (
            <span key={s} className="bg-secondary/70 rounded-full px-3 py-1 text-sm font-medium">
              {activityById(s)?.name}
            </span>
          ))}
        </div>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{me.sportsHistory}</p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* 関わりの階段 */}
        <div className="card-soft p-5 sm:p-6">
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
