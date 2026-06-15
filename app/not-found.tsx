import Link from 'next/link'

// 404 の最小フォールバック画面 (土台)。文言・導線は案件に合わせて拡張してよい。
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-bold tracking-tight">ページが見つかりません</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          URL が変更されたか、ページが存在しません。
        </p>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          トップへ戻る
        </Link>
      </div>
    </main>
  )
}
