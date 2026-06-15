const steps = [
  {
    emoji: '📝',
    step: 'STEP 1',
    title: '困りごとを出す',
    body: '学校・クラブが「こんな指導者がほしい」を投稿。種目と曜日を選ぶだけ。',
  },
  {
    emoji: '✨',
    step: 'STEP 2',
    title: 'AI がおすすめを提案',
    body: '県内の指導者から、ぴったりの人を理由つきで自動で提案。距離はオンラインで解消。',
  },
  {
    emoji: '🤝',
    step: 'STEP 3',
    title: 'サッとつながる',
    body: 'ワンタップで依頼・応募。対面でもオンラインでも、すぐに活動スタート。',
  },
]

/** コア機能を「3ステップ」で誰でも分かるように見せる（タイミー的なシンプルさ）。 */
export function HowItWorks() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div key={s.step} className="relative">
          <div className="bg-card h-full rounded-2xl border p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="bg-brand flex size-10 items-center justify-center rounded-xl text-2xl">
                {s.emoji}
              </span>
              <span className="text-primary text-xs font-bold">{s.step}</span>
            </div>
            <h3 className="font-bold">{s.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.body}</p>
          </div>
          {i < steps.length - 1 && (
            <span className="text-primary/40 absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 text-2xl sm:block">
              ›
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
