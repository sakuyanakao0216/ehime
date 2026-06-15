import { ConnectEventCard } from '@/components/blocks/connect-event-card'
import { RoleBanner } from '@/components/blocks/role-banner'
import { Stairway } from '@/components/blocks/stairway'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connectEvents } from '@/lib/mock/events'
import { me, stairway } from '@/lib/mock/me'

export default function ConnectPage() {
  const nextStep = stairway[Math.min(me.currentStep + 1, stairway.length - 1)]
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <RoleBanner
        roleLabel="つながる"
        description="観戦やジムが好きなまま、ゆる〜く関わるだけ。気づけばスポーツを支える仲間に。"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* AIが組成するつながりイベント */}
        <div>
          <div className="mb-6 border-b pb-3">
            <div className="label text-brand">AI Recommendation</div>
            <h1 className="font-serif mt-1 text-2xl font-semibold">あなたへのつながりイベント</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              「好き・得意」から、AI が“ちょい手伝い”できる場をおすすめ。まずは気軽に。
            </p>
          </div>
          <div className="space-y-4">
            {connectEvents.map((e) => (
              <ConnectEventCard key={e.id} event={e} />
            ))}
          </div>
        </div>

        {/* 関わりの階段 */}
        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-base">関わりの階段</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Stairway current={me.currentStep} progress={me.progressToNext} />
              <p className="text-muted-foreground border-t pt-3 text-xs leading-relaxed">
                次の一歩は「<strong className="text-foreground">{nextStep.label}</strong>」。
                上のイベントに1つ参加すると、一段あがります。
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
