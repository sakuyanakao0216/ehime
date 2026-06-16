/**
 * 種目・カテゴリ → 生成画像（public/images/generated）のマッピング。
 * カードのサムネを種目に連動させ、ミスマッチ（吹奏楽なのにバスケ等）を防ぐ。
 */
import type { EventCategory } from '@/lib/mock/events'

/** 種目ID → 画像。該当があれば最優先で使う。 */
export const activityImage: Record<string, string> = {
  brass: '/images/generated/gakko.png',
  basketball: '/images/generated/collab.png',
  track: '/images/generated/chiiki.png',
  soccer: '/images/generated/soccer.png',
  baseball: '/images/generated/baseball.png',
  volleyball: '/images/generated/volleyball.png',
}

/** イベントカテゴリ → 画像（種目に該当がないときのフォールバック）。 */
export const categoryImage: Partial<Record<EventCategory, string>> = {
  プロ観戦: '/images/generated/kansen.png',
  地域: '/images/generated/chiiki.png',
  学校: '/images/generated/gakko.png',
}

/** コーチング/候補向けの汎用画像。 */
export const COACH_IMAGE = '/images/generated/coach.png'

export function imageForActivity(activityId?: string): string | undefined {
  return activityId ? activityImage[activityId] : undefined
}
