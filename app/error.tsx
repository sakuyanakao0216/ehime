'use client'

// ランタイムエラー時の最小フォールバック画面 (土台)。
// Next のデフォルトのままだと実機デモ中のクラッシュ表示がピッチで弱いため同梱。
// 文言・導線は案件に合わせて拡張してよい。デザイントークン以外の色は使わない。
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">エラーが発生しました</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          一時的な問題の可能性があります。再試行しても解決しない場合は時間をおいてアクセスしてください。
          {error.digest && <span className="mt-2 block text-xs">エラー ID: {error.digest}</span>}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          再試行
        </button>
      </div>
    </main>
  )
}
