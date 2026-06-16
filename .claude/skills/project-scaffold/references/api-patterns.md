# Next.js ネイティブ API パターン（バックエンド T1）

DB も認証も要らない「サーバー側のちょっとした処理」は Next.js だけで完結する。Firebase/GCP に行く前にここで足りないか確認する。階層判断は [backend-strategy.md](../../_docs/comparison/backend-strategy.md)。

## Route Handler（REST 的なエンドポイント）

```ts
// app/api/contact/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  // バリデーション → 送信 / 整形 / 外部 API プロキシ
  return Response.json({ ok: true })
}

export async function GET() {
  return Response.json({ status: 'healthy' })
}
```

向き: Webhook 受け / 外部 API プロキシ (キー秘匿) / ヘルスチェック / サーバー側 AI 呼び出し (`ai-feature`)。

## Server Action（フォーム送信を関数で）

```ts
// app/actions.ts
'use server'
export async function submitContact(formData: FormData) {
  const email = formData.get('email')
  // サーバーで処理。戻り値はクライアントに返る
  return { ok: true }
}
```

```tsx
// フォームから直接呼ぶ
<form action={submitContact}>
  <input name="email" />
  <button>送信</button>
</form>
```

向き: フォーム処理 / mutation。`useFormStatus` でローディング表示。

## いつ T1 を超えるか

| 必要になったもの | 行き先 |
|---|---|
| データを保存して後で読みたい | T2 Firebase (`firebase-backend`) |
| ログイン / ユーザー管理 | T2 Firebase Auth |
| ファイル保存 | T2 Firebase Storage |
| 定期実行 / 長時間 / キュー | T3 GCP |

## 注意

- Route Handler / Server Action は **Vercel の実行時間制限 (~60s)** を超えられない。重い処理は T3 へ
- 秘密鍵は環境変数 (サーバーのみ)。`NEXT_PUBLIC_*` には置かない
- App Router の API は更新がある。実装時に Next.js 最新ドキュメントで確認すること
