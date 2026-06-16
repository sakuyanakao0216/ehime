# Admin SDK + GCP バックエンド

Firebase プロジェクト = GCP プロジェクト。Next.js で収まらない処理はここに載せる。階層の判断は [backend-strategy.md](../../_docs/comparison/backend-strategy.md) を参照。

## Firebase Admin SDK（サーバー特権）

導入: `pnpm add firebase-admin`

```ts
// lib/firebase-admin.ts — Route Handler / Server Action のみで import すること
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })

export const adminDb = getFirestore(app)
export const adminAuth = getAuth(app)
```

用途:
- **特権書き込み** (Security Rules を迂回したサーバー集計)
- **ID トークン検証** `await adminAuth.verifyIdToken(token)` (保護 API)
- **Webhook 署名検証** → 検証後に `adminDb` で書き込み

```ts
// app/api/webhook/route.ts
import { adminDb } from '@/lib/firebase-admin'
export async function POST(req: Request) {
  const sig = req.headers.get('x-signature')
  // ... 署名検証 ...
  await adminDb.collection('events').add({ received: true })
  return new Response('ok')
}
```

---

## GCP へ載せる（T3）

### 定期実行 — Cloud Functions (Scheduled)
```ts
// functions/src/index.ts
import { onSchedule } from 'firebase-functions/v2/scheduler'
export const nightlyAggregate = onSchedule('every day 03:00', async () => {
  // 集計・クリーンアップなど
})
```
```bash
firebase deploy --only functions
```

### 長時間ジョブ — Cloud Run
```bash
gcloud run deploy my-worker --source . --region asia-northeast1 --no-allow-unauthenticated
```
HTTP リクエストの 60s 制限を超える重い処理・常駐ワーカー向け。

### キュー / 非同期 — Cloud Tasks
```ts
import { CloudTasksClient } from '@google-cloud/tasks'
const client = new CloudTasksClient()
await client.createTask({
  parent: client.queuePath(project, 'asia-northeast1', 'my-queue'),
  task: { httpRequest: { httpMethod: 'POST', url: WORKER_URL, body: Buffer.from(JSON.stringify(payload)) } },
})
```

### イベント配信 — Pub/Sub
大量 fan-out / マイクロサービス間連携が要るときのみ。プロトでは過剰になりがち。

---

## CLI 最小手順

```bash
npm i -g firebase-tools
firebase login
firebase use <project-id>          # Firebase = GCP プロジェクト
gcloud auth login
gcloud config set project <project-id>
```

## 判断（どこに置くか）

| 処理 | 置き場所 |
|---|---|
| 数秒で終わる / リクエスト駆動 | Next.js Route Handler (+ Admin SDK) |
| 定期実行 | Cloud Scheduler + Functions |
| 長時間 / 常駐 | Cloud Run |
| 大量非同期 | Cloud Tasks / Pub/Sub |

> Functions / Run / Tasks の API・CLI は更新がある。実装時に最新ドキュメントで確認すること。
