/**
 * AI 利用量の記録（土台）。
 *
 * AI 呼び出し（`generateText` / `streamText` / `generateObject` / `embed`）のたびに
 * `logAiUsage` を呼ぶと、`type: 'ai_usage'` の構造化 JSON を 1 行 console.log する。
 * Vercel にデプロイすると Vercel Logs に流れるので、**ダッシュボード → Logs で
 * `ai_usage` を検索**すれば機能別・モデル別のトークン利用量が見える。
 *
 * - 正確な**請求額**は Vercel ダッシュボード → AI Gateway → **Observability**
 *   （リクエスト別の model / tokens / cost / provider）で確認する。
 *   このログは「アプリのどの機能が・どれだけ使ったか」の内訳を出すためのもの。
 * - 配線の仕方（chat / structured / agent / RAG 各パターン）は `ai-feature` プラグインが
 *   このファイルを土台に行う（`import { logAiUsage } from '@/lib/ai-usage'`）。
 * - `feature` は呼び出し元の機能名（例: 'chat' / 'extract' / 'rag'）。集計の軸になるので
 *   route ごとに固定の文字列を渡す。
 */

/** AI SDK v5 の usage 形。`streamText` の `onFinish` や `generateText` の戻り値から渡す。 */
type AiUsage = {
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
}

export function logAiUsage({
  feature,
  usage,
  model,
}: {
  feature: string
  usage?: AiUsage
  model?: string
}) {
  console.log(
    JSON.stringify({
      type: 'ai_usage',
      feature,
      model: model ?? process.env.AI_MODEL ?? 'google/gemini-2.5-flash',
      inputTokens: usage?.inputTokens ?? 0,
      outputTokens: usage?.outputTokens ?? 0,
      totalTokens: usage?.totalTokens ?? 0,
      at: new Date().toISOString(),
    }),
  )
}
