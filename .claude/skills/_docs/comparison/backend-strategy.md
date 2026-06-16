# バックエンド階層戦略 — Next.js / Firebase / GCP

体験フロー ステージ⑥ (コア機能) の「バックエンド」をどこに置くかの判断基準。原則は **必要になるまで上の Tier に行かない**。プロトはほとんど T1〜T2 で足りる。

関連: [体験フロー × 網羅性](./experience-flow.md) ／ プラグイン `ai-feature` ・ `firebase-backend`

---

## 3 つの Tier

| Tier | 技術 | 適するケース | 入口 |
|---|---|---|---|
| **T1 Next.js native** | Route Handlers + Server Actions | フォーム処理 / サーバー側 AI 呼び出し (キー秘匿) / 軽いプロキシ・整形 / ID トークン検証 | `project-scaffold` の [api-patterns.md](../../project-scaffold/references/api-patterns.md) |
| **T2 Firebase** | Firestore / Auth / Storage / Admin SDK | 永続化 / 認証 / ファイル / 特権書き込み / Webhook 検証 | `firebase-backend` |
| **T3 GCP** | Cloud Functions / Cloud Run / Cloud Scheduler / Cloud Tasks・Pub/Sub | 定期実行 / 長時間ジョブ / キュー / 大量非同期 / スケールする Webhook | `firebase-backend` の [admin-and-gcp.md](../../firebase-backend/references/admin-and-gcp.md) |

Firebase プロジェクト = GCP プロジェクトなので、T2 → T3 は同じプロジェクト内で地続きにスケールできる。

---

## 判断フロー

```
その処理は HTTP リクエスト内で数秒以内に終わる？
  │
  ├ YES ─→ サーバー権限 / 秘密鍵 / 認証検証が必要？
  │          │
  │          ├ NO  ─→ T1  Next.js native
  │          │         (Route Handler / Server Action)
  │          │
  │          └ YES ─→ T2  Firebase
  │                    (Admin SDK を Route Handler で)
  │
  └ NO ──→ 定期実行 / 長時間 / キュー / 大量非同期？
             │
             ├ 定期実行     ─→ T3  Cloud Scheduler + Functions
             ├ 長時間・常駐 ─→ T3  Cloud Run
             └ キュー・非同期─→ T3  Cloud Tasks / Pub/Sub
```

---

## Tier 別の最小スニペット

### T1 — Next.js native（サーバー側 AI 呼び出し例）
キーを隠したいだけなら Firebase すら要らない。Route Handler に閉じる。
```ts
// app/api/summarize/route.ts
import { generateText } from 'ai'
import { model } from '@/lib/ai'   // AI_MODEL を env から解決 (ai-feature)
export async function POST(req: Request) {
  const { text } = await req.json()
  const { text: summary } = await generateText({ model, prompt: `要約して: ${text}` })
  return Response.json({ summary })
}
```

### T2 — Firebase（特権書き込み / Webhook 検証）
```ts
// app/api/webhook/route.ts
import { adminDb } from '@/lib/firebase-admin'  // firebase-backend
export async function POST(req: Request) {
  // 署名検証後にサーバー権限で書き込み
  await adminDb.collection('events').add({ at: Date.now() })
  return new Response('ok')
}
```

### T3 — GCP（定期実行 / 長時間 / キュー）
```ts
// 定期実行: functions/src/index.ts
import { onSchedule } from 'firebase-functions/v2/scheduler'
export const nightly = onSchedule('every day 03:00', async () => { /* 集計 */ })
```
```bash
# 長時間ジョブ: Cloud Run
gcloud run deploy worker --source . --region asia-northeast1
```
詳細・Cloud Tasks/Pub-Sub は [admin-and-gcp.md](../../firebase-backend/references/admin-and-gcp.md)。

---

## アンチパターン

- **Vercel の 60s 制限を無視して重い処理を Route Handler に詰める** → タイムアウト。T3 (Cloud Run / Functions) に出す
- **クライアントから直接 Firestore に特権相当の書き込み** → Security Rules を緩めて穴になる。サーバー (Admin SDK) 経由に
- **プロトの最初から T3 を組む** → オーバーエンジニアリング。まず T1/T2 で動かしてから必要な処理だけ上げる
- **秘密鍵を `NEXT_PUBLIC_*` に置く** → 漏洩。秘匿は `FIREBASE_ADMIN_*` / `AI_GATEWAY_API_KEY` でサーバーのみ

---

## このリポジトリでの担当

| Tier | プラグイン | コマンド |
|---|---|---|
| T1 | project-scaffold (参照のみ) | （参照 api-patterns.md） |
| T2 | firebase-backend | `/firebase [db\|auth\|storage\|admin]` |
| T3 | firebase-backend | `/firebase backend` |
| (AI のサーバー配線) | ai-feature | `/ai-feature` |
