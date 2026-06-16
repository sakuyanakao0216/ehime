# AI Gateway BYOK ルーティング — 「BYOK を登録したのに自分の契約を通らない」

AI 呼び出しは `lib/ai.ts` → Vercel AI Gateway 経由で、コードは `google/gemini-2.5-flash` のような**モデル指定だけ**を渡す。このモデルは Gateway 上で**複数のプロバイダ**(Google AI Studio / Vertex AI など)が提供しており、**どのプロバイダを通すかは Gateway のルーティングが決める**。

ここがハマりどころ: **BYOK で Vertex の資格情報をダッシュボードに登録しても、それだけでは「Vertex を優先して使え」という指示にはならない**。BYOK は「この契約で呼んでよい」という資格情報の登録であって、ルーティング指示ではない。既定ルーティングのままだと Google AI Studio 側が選ばれがちで、「BYOK を入れたのに自社契約に請求が来ない」という見え方になる。

## 直し方 (コード変更不要・env 1つだけ)

スターター (`lib/ai.ts`) にはこのためのスイッチが最初から入っている:

```ts
const providerOnly = process.env.AI_PROVIDER_ONLY?.split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const providerOptions = {
  gateway: providerOnly?.length ? { only: providerOnly } : {},
}
```

`AI_PROVIDER_ONLY` 未設定 → `gateway: {}` → 既定ルーティング(フォールバックあり)、という動き。

1. Vercel ダッシュボード → 対象プロジェクト → **Settings → Environment Variables** に `AI_PROVIDER_ONLY=vertex` を追加(**Preview と Production の両方**)
2. 再デプロイ(次の push で自動。すぐ反映したければ **Redeploy**)
3. 確認: Vercel ダッシュボード → **AI Gateway → Observability**(ログ)で、各リクエストの **provider が `vertex` になっているか**を見る

## 注意 (2点)

- **前提**: BYOK の Vertex 資格情報が **AI Gateway → Bring Your Own Key に登録済み**であること。未登録のまま `only: ['vertex']` を指定すると**リクエストが失敗する**(フォールバック先を自分で断っているため)
- `only` は**固定**であってフォールバック抑止とセット。可用性よりも「必ず自社契約・自社リージョンを通す」が要件のときに使う。要件がなければ未設定(既定ルーティング)のままが無難

## 要点

- **BYOK 登録 ≠ ルーティング指示**。「どの契約で呼ぶか」は BYOK、「どのプロバイダを通すか」は `AI_PROVIDER_ONLY`(= `providerOptions.gateway.only`)と役割が分かれている
- 切り分けは Observability のログが最速: provider 列を見れば「どこを通ったか」が一目で分かる
- 関連: 認証そのもの(OIDC / API キー)の整理はスターター AGENTS.md「AI Gateway 認証」、到達性の問題は [ai-gateway-reachability.md](./ai-gateway-reachability.md)
