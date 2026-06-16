import { ArrowUpRight } from 'lucide-react'
import { socialPosts } from '@/lib/mock/social'
import { cn } from '@/lib/utils'

/** プラットフォームのバッジ（ブランドアイコンに依存しないテキスト表現）。 */
function PlatformBadge({ platform }: { platform: 'x' | 'instagram' }) {
  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
        platform === 'x'
          ? 'bg-foreground text-background'
          : 'bg-gradient-to-br from-rose-500 to-amber-400 text-white',
      )}
    >
      {platform === 'x' ? '𝕏' : 'IG'}
    </span>
  )
}

/** 関連する X / Instagram の投稿（盛り上がりを SNS でも体感）。単列・縦長レイアウト。 */
export function SocialFeed() {
  return (
    <div className="flex flex-col gap-3">
      {socialPosts.map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="lift card-soft group flex gap-3 p-4"
        >
          <PlatformBadge platform={p.platform} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="truncate font-bold">{p.author}</span>
              <span className="text-muted-foreground truncate text-xs">{p.handle}</span>
              <span className="text-muted-foreground/70 ml-auto shrink-0 text-xs">{p.when}</span>
            </div>
            <p className="text-foreground/85 mt-1 text-sm leading-relaxed">{p.text}</p>
          </div>
          <ArrowUpRight className="text-muted-foreground/50 group-hover:text-brand size-4 shrink-0 transition-colors" />
        </a>
      ))}
    </div>
  )
}
