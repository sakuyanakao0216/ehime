import {
  FlaskConical,
  Footprints,
  type LucideIcon,
  Mic2,
  Music,
  Palette,
  PenTool,
  Swords,
  Trophy,
  Volleyball,
  Waves,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const map: Record<string, LucideIcon> = {
  Volleyball,
  Footprints,
  Swords,
  Waves,
  Music,
  PenTool,
  Palette,
  Mic2,
  FlaskConical,
}

/** 種目アイコン。data.ts の Activity.icon 名で解決（未知名は Trophy にフォールバック）。 */
export function ActivityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Trophy
  return <Icon className={cn('size-4', className)} />
}
