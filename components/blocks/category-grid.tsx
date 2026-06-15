import Link from 'next/link'
import { activities } from '@/lib/mock/data'
import { cn } from '@/lib/utils'
import { emojiFor, gradientFor } from '@/lib/visual'

/** ジモティ/メルカリ風の種目カテゴリーグリッド。絵文字タイルでブラウズの入口に。 */
export function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-7">
      {activities.map((a) => (
        <Link
          key={a.id}
          href="/instructors"
          className="lift group bg-card flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center shadow-sm"
        >
          <span
            className={cn(
              'flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-sm',
              gradientFor(a.id),
            )}
          >
            {emojiFor(a.id)}
          </span>
          <span className="text-xs font-medium leading-tight">{a.name}</span>
        </Link>
      ))}
    </div>
  )
}
