/**
 * マッチングのスコアリング。
 * AI（/api/match の generateObject）の結果を補強し、API キー未設定/失敗時は
 * これ単体で必ず推薦結果を返す（プロトのデモが鍵に依存しない）。
 */
import { activityById, cityById, instructors } from './data'
import type { Instructor, Recruitment, Weekday } from './types'

export type MatchResult = {
  instructor: Instructor
  score: number
  reason: string
  highlights: string[]
}

/** 募集条件の最小形（フォーム入力 / 既存 Recruitment の双方を受ける） */
export type MatchCriteria = {
  activityId: string
  region: Recruitment['region']
  cityId?: string
  requiredDays: Weekday[]
  onlineOk: boolean
  level?: Recruitment['level']
}

function dayOverlap(a: Weekday[], b: Weekday[]) {
  if (a.length === 0) return 1
  const set = new Set(b)
  const hit = a.filter((d) => set.has(d)).length
  return hit / a.length
}

/** 1 人の指導者に対するスコアと決め手を算出 */
export function scoreInstructor(ins: Instructor, c: MatchCriteria): MatchResult {
  const highlights: string[] = []
  let score = 0

  // 種目一致（最重要）
  const specialtyMatch = ins.specialties.includes(c.activityId)
  if (specialtyMatch) {
    score += 42
    highlights.push('専門種目が一致')
  } else {
    score += 6
  }

  // 地域近接 or オンラインで距離を無効化
  const online = c.onlineOk && ins.onlineAvailable
  if (ins.cityId === c.cityId) {
    score += 20
    highlights.push('同じ市町')
  } else if (ins.region === c.region) {
    score += 13
    highlights.push('同じ地域')
  } else if (online) {
    score += 15
    highlights.push('オンラインで距離を解消')
  } else {
    score += 3
  }

  // オンライン対応
  if (online) {
    score += 10
    if (!highlights.includes('オンラインで距離を解消')) {
      highlights.push('オンライン指導可')
    }
  }

  // 曜日の重なり
  const overlap = dayOverlap(c.requiredDays, ins.availableDays)
  score += Math.round(overlap * 15)
  if (overlap >= 0.5) highlights.push('活動曜日が合う')

  // 信頼レイヤー
  if (ins.trainingCompleted) {
    score += 8
    highlights.push('県の研修修了')
  }
  score += Math.round((Math.min(ins.yearsExperience, 18) / 18) * 7)
  if (ins.yearsExperience >= 15) highlights.push(`指導歴${ins.yearsExperience}年`)

  // 感謝・評価の後押し
  score += Math.min(Math.round(ins.thanksCount / 12), 5)
  if (ins.thanksCount >= 30) highlights.push(`感謝${ins.thanksCount}件`)
  score += Math.round((ins.rating - 4) * 3)

  score = Math.max(0, Math.min(100, score))

  return {
    instructor: ins,
    score,
    reason: buildReason(ins, c, { specialtyMatch, online, overlap }),
    highlights: highlights.slice(0, 4),
  }
}

function buildReason(
  ins: Instructor,
  c: MatchCriteria,
  ctx: { specialtyMatch: boolean; online: boolean; overlap: number },
) {
  const act = activityById(c.activityId)?.name ?? '本種目'
  const city = cityById(ins.cityId)?.name ?? ins.region
  const parts: string[] = []

  if (ctx.specialtyMatch) {
    parts.push(`${act}を専門とし指導歴${ins.yearsExperience}年`)
  } else {
    parts.push(`${city}を拠点に幅広く指導`)
  }
  if (ctx.online) {
    parts.push('オンライン指導に対応しているため、距離を越えて関われます')
  } else if (ins.region === c.region) {
    parts.push(`${ins.region}在住で移動の負担が小さい`)
  }
  if (ins.trainingCompleted) parts.push('県の研修を修了済みで安心')
  if (ins.thanksCount >= 25) {
    parts.push(`これまで${ins.schoolsSupported}校で${ins.thanksCount}件の感謝`)
  }
  return `${parts.join('。')}。`
}

/** 募集条件に対する上位候補を返す（フォールバック実体） */
export function recommend(c: MatchCriteria, limit = 4): MatchResult[] {
  return instructors
    .map((ins) => scoreInstructor(ins, c))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
