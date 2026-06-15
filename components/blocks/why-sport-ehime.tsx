import { MapPinned, Sparkles, TrendingUp } from 'lucide-react'

/**
 * 差別化（＝“つくる側”）をトップ最初に提示するセクション。
 * 競合（イベスポえひめ/スポーツエントリー/愛顔スポーツ/スポカレ等）は「見る／申し込む」アグリゲーター。
 * 本アプリは AI が参加・関わり・場を“創り”、偏在という政策課題に接続する点を一目で伝える。
 * 文言は concept-v3 / competitive-analysis（正本）に準拠。
 */

const POINTS = [
  {
    icon: Sparkles,
    tag: 'CREATE',
    title: '場を“創る”',
    body: '一覧で終わらない。観戦やジムの「好き」から、AI が学生×社会人×プロの交流イベントを組成。集まれば開催する成立型で、空振りなく機会を生む。',
  },
  {
    icon: TrendingUp,
    tag: 'GROW',
    title: '関わりの階段',
    body: '観る → 参加 → ちょい手伝い → 継続 → 指導者。重い「指導」ではなく、ゆるい一歩から。支える人を“探す”のではなく“育てる”。',
  },
  {
    icon: MapPinned,
    tag: 'CONNECT',
    title: '偏在を解消',
    body: '県全体の人材プール × オンライン指導で、市町の壁と物理的な距離を越える。東予・南予の「空白の種目」を、広域マッチングで埋める。',
  },
] as const

export function WhySportEhime() {
  return (
    <div>
      <div className="mb-6 border-b pb-3">
        <div className="label text-brand">Why スポえひめ</div>
        <h2 className="display mt-1 text-2xl font-bold text-balance">
          見るだけのアプリと、ここが違う。
        </h2>
        <p className="text-muted-foreground mt-1.5 max-w-xl text-sm leading-relaxed">
          愛媛のスポーツ情報サービスは数あれど、その多くは「見る／申し込む」だけ。 スポえひめは、
          <span className="text-foreground font-medium">AI が参加・関わり・場を“創る”</span>
          ことで、指導者不足という地域課題に挑む“つくる側”です。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {POINTS.map((p) => {
          const Icon = p.icon
          return (
            <article key={p.tag} className="lift card-soft group p-6">
              <div className="bg-brand/10 text-brand ring-brand/15 flex size-12 items-center justify-center rounded-xl ring-1">
                <Icon className="size-6" />
              </div>
              <div className="label text-muted-foreground mt-4">{p.tag}</div>
              <h3 className="display mt-1 text-lg font-bold">{p.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.body}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
