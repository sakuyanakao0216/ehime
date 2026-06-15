export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">prototype</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          最小スターター。<code className="rounded bg-muted px-1.5 py-0.5">app/page.tsx</code>{' '}
          から作り始める。 規約は <code className="rounded bg-muted px-1.5 py-0.5">AGENTS.md</code>
          、 スキルは{' '}
          <code className="rounded bg-muted px-1.5 py-0.5">vercel-aiagent-coding-skill</code>{' '}
          を参照。
        </p>
      </div>
    </main>
  )
}
