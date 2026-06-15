import { ActivityFeed } from '@/components/blocks/activity-feed'
import { HowItWorks } from '@/components/blocks/how-it-works'
import { RoleChooser } from '@/components/blocks/role-chooser'

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-20">
      {/* Hero（ひと言で価値を） */}
      <section className="relative py-14 text-center sm:py-20">
        <span className="animate-float pointer-events-none absolute top-8 right-2 text-5xl opacity-80 sm:right-8 sm:text-6xl">
          🍊
        </span>
        <div className="bg-brand mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm">
          オールえひめ ／ 部活サポート
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          困っている部活と、
          <br />
          <span className="text-brand">教えたい人</span>を、サクッと。
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-base leading-relaxed">
          愛媛のどこにいても、専門の指導者に出会える。 AI が県中からぴったりの相手を見つけます。
        </p>
      </section>

      {/* 役割選択: まずここから（唯一の入口） */}
      <section className="mb-12">
        <h2 className="mb-4 text-center text-lg font-bold">まずは、あなたを選んでください 👇</h2>
        <RoleChooser />
      </section>

      {/* コア機能を3ステップで */}
      <section className="mb-12">
        <h2 className="mb-4 text-center text-lg font-bold">つながるまで、かんたん3ステップ</h2>
        <HowItWorks />
      </section>

      {/* 県内のいま（短く） */}
      <section>
        <h2 className="mb-3 text-center text-lg font-bold">いま県内で起きていること 🎉</h2>
        <ActivityFeed limit={3} />
      </section>
    </main>
  )
}
