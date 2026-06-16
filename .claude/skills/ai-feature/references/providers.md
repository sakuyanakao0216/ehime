# AI プロバイダ / モデル ID 早見

Vercel AI SDK は **プロバイダ非依存**。AI Gateway 経由なら `provider/model` 形式の文字列 (`AI_MODEL` env) を差し替えるだけでプロバイダを切替できる。コードは変えない。

## モデル ID（`AI_MODEL` に入れる値）

| プロバイダ | モデル | `AI_MODEL` 値 | 向き |
|---|---|---|---|
| Anthropic | Claude Opus 4.8 | `anthropic/claude-opus-4.8` | 最高品質・エージェント・長文推論 |
| Anthropic | Claude Sonnet 4.6 | `anthropic/claude-sonnet-4.6` | バランス |
| Anthropic | Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | 高速・低コスト |
| OpenAI | GPT-5 | `openai/gpt-5` | 汎用 |
| OpenAI | GPT-5 mini | `openai/gpt-5-mini` | 高速・低コスト |
| Google | Gemini 2.5 Flash | `google/gemini-2.5-flash` | **既定**・高速低コスト(プロト向き) |
| Google | Gemini 2.5 Pro | `google/gemini-2.5-pro` | 大コンテキスト・マルチモーダル |
| xAI | Grok 4.3 | `xai/grok-4.3` | 汎用 |

> モデル名は更新が速い。実際に使える ID は AI Gateway のモデル一覧 / 各プロバイダのドキュメントで確認すること。上表は選定の指針。
> **ID 表記の注意**: AI Gateway 経由(`@ai-sdk/gateway`)は**バージョンをドット区切り**で書く(`anthropic/claude-opus-4.8`)。Anthropic ネイティブ API のモデル ID はハイフン(`claude-opus-4-8`)で、両者の二重表記が混乱の元。本表は Gateway 表記。

## AI Gateway 経由のモデル解決

```ts
// lib/ai.ts — モデルと provider オプションを env から 1 箇所で解決する
import { gateway } from '@ai-sdk/gateway'

// AI_MODEL = "google/gemini-2.5-pro" のような creator/model 文字列
export const model = gateway(process.env.AI_MODEL ?? 'google/gemini-2.5-flash')

// AI_PROVIDER_ONLY=vertex で「必ず Vertex 経由」等にプロバイダ固定 (未設定なら既定ルーティング)
const providerOnly = process.env.AI_PROVIDER_ONLY?.split(',').map((s) => s.trim()).filter(Boolean)
export const providerOptions = { gateway: providerOnly?.length ? { only: providerOnly } : {} }
```

> **starter テンプレは `lib/ai.ts`(`model` + `providerOptions` export)を最初から同梱**している。ai-feature は
> **既存の `lib/ai.ts` を上書きせず**、これを import して route / hook / 構造化出力などを足す（拡張する）。
> 無い場合のみ上記を生成する。既定モデルは `google/gemini-2.5-flash`(プロト向きに速くて安い)。
> **生成する `generateText` / `streamText` には `providerOptions` を渡す**こと（プロバイダ固定や BYOK 経路を効かせるため）:
> `streamText({ model, providerOptions, prompt })`。
> なお `only: ['vertex']` は **Google/Gemini モデルを Vertex で動かす**ケース等、**モデルとプロバイダが対応する**ときに使う。

`@ai-sdk/gateway` は `AI_GATEWAY_API_KEY` (または Vercel デプロイ時の OIDC) を読む。ローカルは `.env.local`、本番は Vercel env / `gh secret set` で投入。

## フォールバック / コスト最適化の考え方

- **既定はコスト・速度重視 (gemini-2.5-flash)**。高品質が要る対話/エージェント/長文だけ上位モデル (opus / gpt-5 / gemini-2.5-pro) に `AI_MODEL` で切替
- プレビュー環境は安価なモデル、本番ピッチ用は高品質モデル、と Vercel の環境別 env で出し分け可能
- 1 リクエストで複数モデルを使い分けたい場合のみコード側で `gateway('...')` を直接呼ぶ (基本は env 集約を崩さない)

## 関連

- 実装コードは [patterns.md](./patterns.md)
- 画像生成側のモデル切替は `image-gen` プラグイン (同じ AI Gateway)
