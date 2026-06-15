/**
 * AI モデル client（土台）。
 *
 * このプロジェクトは Vercel AI Gateway に集約する。プロバイダ別キーは持たず、
 * `AI_GATEWAY_API_KEY`（Vercel デプロイ時は OIDC で省略可）で全プロバイダに届き、
 * 使うモデルは `AI_MODEL`（`creator/model` 形式）の文字列を変えるだけで切り替わる。
 * BYOK（自社の OpenAI / Anthropic / Vertex 契約）は Vercel ダッシュボード側に登録し、ここには現れない。
 *
 * 既定はプロト向けに速くて安い gemini-2.5-flash。環境ごとに `AI_MODEL` で上書きする
 * （ローカル=.env.local / プレビュー・本番=Vercel env）。
 *
 * チャット・エージェント・構造化出力・RAG などの route / hook は `ai-feature` プラグインが
 * このファイルを土台に生成・拡張する（`model` をそのまま import して使う）。
 * 呼び出しごとのトークン利用量の記録は `lib/ai-usage.ts` の `logAiUsage` で行う（こちらも土台）。
 *
 * ここで export する `model` は**言語モデル**（text / chat / agent / structured 用）。
 * 画像生成は**別モデル・別 API**（`generateImage` + `AI_IMAGE_MODEL`、例 `google/imagen-4.0-fast-generate-001`）で、
 * `image-gen` プラグインが担当する（キーレス手順を優先）。混ぜないこと。
 */
import { gateway } from '@ai-sdk/gateway'

/** 言語モデル。`AI_MODEL` 未設定時は gemini-2.5-flash。 */
export const model = gateway(process.env.AI_MODEL ?? 'google/gemini-2.5-flash')

/**
 * AI Gateway の provider オプション。`generateText` / `streamText` の `providerOptions` に渡す。
 *
 * `AI_PROVIDER_ONLY`（カンマ区切り）を設定すると、そのプロバイダだけに**固定**する。
 * 例: `AI_PROVIDER_ONLY=vertex` → 必ず自分の Vertex AI（BYOK）経由で呼び、
 * Google AI Studio 等へフォールバックしない。未設定なら Gateway 既定のルーティング。
 *
 * BYOK 資格情報自体は Vercel ダッシュボード（AI Gateway → Bring Your Own Key）側に登録する。
 * 使い方: `streamText({ model, providerOptions, prompt })`
 */
const providerOnly = process.env.AI_PROVIDER_ONLY?.split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const providerOptions = {
  gateway: providerOnly?.length ? { only: providerOnly } : {},
}
