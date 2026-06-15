import { Sparkles } from 'lucide-react'
import { ConnectEventCard } from '@/components/blocks/connect-event-card'
import { RoleBanner } from '@/components/blocks/role-banner'
import { Stairway } from '@/components/blocks/stairway'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connectEvents } from '@/lib/mock/events'
import { me, stairway } from '@/lib/mock/me'

export default function ConnectPage() {
  const nextStep = stairway[Math.min(me.currentStep + 1, stairway.length - 1)]
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <RoleBanner
        emoji="🤝"
        roleLabel="つながる"
        gradient="from-emerald-400 to-teal-500"
        description="観戦やジムが好きなまま、ゆる〜く関わるだけ。気づけばスポーツを支える仲間に。"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* AIが組成するつながりイベント */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="text-primary size-5" />
            あなたへのつながりイベント
          </h1>
          <p className="text-muted-foreground mb-4 text-sm">
            あなたの「好き・得意」から、AI が“ちょい手伝い”できる場をおすすめ。
            むずかしいことは抜き、まずは気軽に。
          </p>
          <div className="space-y-3">
            {connectEvents.map((e) => (
              <ConnectEventCard key={e.id} event={e} />
            ))}
          </div>
        </div>

        {/* 関わりの階段 */}
        <aside className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">あなたの関わりの階段 🪜</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Stairway current={me.currentStep} progress={me.progressToNext} />
              <p className="rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800">
                次の一歩は「<strong>{nextStep.label}</strong>」。
                上のイベントに1つ参加すると、一段あがります。
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
