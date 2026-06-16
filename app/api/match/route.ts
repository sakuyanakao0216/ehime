/**
 * AI 広域マッチング API。
 *
 * 募集条件（種目・地域・市町・曜日・オンライン可否・レベル）を受け取り、
 * 指導者プールから上位候補をスコア + 推薦理由 + 決め手タグ付きで返す。
 *
 * - 既定: `lib/ai.ts` の Gateway モデル + AI SDK `generateObject`（Zod で構造化）
 * - フォールバック: AI 鍵未設定 / 失敗時は `lib/mock/match.ts` のスコアリングで必ず返す
 *   （プロトのデモが鍵に依存しないようにする）
 * - 利用量は `logAiUsage({ feature: 'match' })` で記録
 */
import { generateObject } from 'ai'
import { z } from 'zod'
import { model, providerOptions } from '@/lib/ai'
import { logAiUsage } from '@/lib/ai-usage'
import { activityById, cityById, instructors } from '@/lib/mock/data'
import { type MatchCriteria, recommend } from '@/lib/mock/match'

export const runtime = 'nodejs'

const criteriaSchema = z.object({
  activityId: z.string(),
  region: z.enum(['東予', '中予', '南予']),
  cityId: z.string().optional(),
  requiredDays: z.array(z.enum(['月', '火', '水', '木', '金', '土', '日'])),
  onlineOk: z.boolean(),
  level: z.enum(['初心者歓迎', '基礎指導', '競技志向']).optional(),
})

const aiResultSchema = z.object({
  candidates: z
    .array(
      z.object({
        instructorId: z.string().describe('指導者ID（候補リストの id をそのまま）'),
        score: z.number().min(0).max(100).describe('マッチ度 0-100'),
        reason: z.string().describe('なぜ合うかの日本語の説明（1〜2文）'),
        highlights: z.array(z.string()).describe('決め手の短いタグ 2〜4個'),
      }),
    )
    .describe('マッチ度の高い順に最大4名'),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = criteriaSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'invalid criteria' }, { status: 400 })
  }
  const criteria = parsed.data as MatchCriteria

  // フォールバック結果は常に用意（AI 成功時も instructor の実データ合流に使う）
  const fallback = recommend(criteria, 4)

  const hasGatewayAuth = Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
  if (!hasGatewayAuth) {
    return Response.json({ source: 'rule-based', results: serialize(fallback) })
  }

  try {
    const act = activityById(criteria.activityId)?.name ?? criteria.activityId
    const cityName = criteria.cityId ? cityById(criteria.cityId)?.name : undefined

    // 候補プール（AI に渡す文脈。氏名は伏せ ID で扱わせる）
    const pool = instructors.map((i) => ({
      id: i.id,
      region: i.region,
      city: cityById(i.cityId)?.name,
      specialties: i.specialties.map((s) => activityById(s)?.name ?? s),
      qualifications: i.qualifications,
      trainingCompleted: i.trainingCompleted,
      yearsExperience: i.yearsExperience,
      onlineAvailable: i.onlineAvailable,
      availableDays: i.availableDays,
      thanksCount: i.thanksCount,
      rating: i.rating,
    }))

    const { object, usage } = await generateObject({
      model,
      providerOptions,
      schema: aiResultSchema,
      system:
        'あなたは愛媛県「広域連携システム」のマッチング担当です。部活動・地域クラブの募集条件に対し、' +
        '指導者プールから最適な候補を選びます。重視する観点: ①種目の専門性 ②地域の近さ、ただしオンライン可なら距離は無効化 ' +
        '③活動曜日の一致 ④県研修の修了など信頼性 ⑤これまでの感謝・実績。' +
        '愛媛は地域偏在が課題のため、オンラインで南予・東予の空白を埋められる候補を積極的に評価してください。' +
        '理由は保護者にも伝わる平易な日本語で。',
      prompt:
        `# 募集条件\n` +
        `- 種目: ${act}\n- 地域: ${criteria.region}\n- 市町: ${cityName ?? '指定なし'}\n` +
        `- 必要な曜日: ${criteria.requiredDays.join('・') || '指定なし'}\n` +
        `- オンライン指導: ${criteria.onlineOk ? '可' : '対面のみ'}\n` +
        `- レベル: ${criteria.level ?? '指定なし'}\n\n` +
        `# 指導者プール（この中から id で選ぶ）\n` +
        JSON.stringify(pool),
    })

    logAiUsage({ feature: 'match', usage })

    // AI の選定（id とスコア・理由）に instructor の実データを合流
    const results = object.candidates
      .map((c) => {
        const ins = instructors.find((i) => i.id === c.instructorId)
        if (!ins) return null
        return {
          instructor: ins,
          score: Math.round(c.score),
          reason: c.reason,
          highlights: c.highlights.slice(0, 4),
        }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.score - a.score)

    if (results.length === 0) {
      return Response.json({ source: 'rule-based', results: serialize(fallback) })
    }
    return Response.json({ source: 'ai', results: serialize(results) })
  } catch {
    // 失敗してもデモは止めない
    return Response.json({ source: 'rule-based', results: serialize(fallback) })
  }
}

// instructor 全量を返すと重いので必要分だけ整形
function serialize(
  results: {
    instructor: (typeof instructors)[number]
    score: number
    reason: string
    highlights: string[]
  }[],
) {
  return results.map((r) => ({
    score: r.score,
    reason: r.reason,
    highlights: r.highlights,
    instructor: r.instructor,
  }))
}
