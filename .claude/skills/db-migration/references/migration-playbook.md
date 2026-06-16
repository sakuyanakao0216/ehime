# Firestore 段階移行プレイブック

例: `users.name`（文字列）を `users.profile.displayName` に移す移行で各段階を示す。

## 段階 1: 後方互換読み取り

新コードが**新旧どちらの形式も読める**正規化層を、書き込み変更より先にデプロイする。

```ts
// lib/normalize.ts — 読み取り口を 1 箇所に集約しておくと移行が楽
export function normalizeUser(data: DocumentData): User {
  return {
    profile: {
      // 新形式があれば使い、なければ旧形式から組み立てる
      displayName: data.profile?.displayName ?? data.name ?? '',
    },
    // schemaVersion を持たせると残存確認クエリが書きやすい
    schemaVersion: data.schemaVersion ?? 1,
  }
}
```

## 段階 2: デュアルライト

新規・更新の書き込みを新形式に切替。旧読み取りコードが残っている期間は旧フィールドにも併記する（完全移行まで `name` も書く）。

```ts
await setDoc(ref, {
  profile: { displayName },
  name: displayName, // 旧形式併記（段階 4 で削除）
  schemaVersion: 2,
}, { merge: true })
```

- Security Rules に新フィールドの検証を追加（firebase-backend）

## 段階 3: バックフィル（Admin SDK）

`scripts/migrations/002-user-profile.ts` のような単独スクリプト。**必ず dry-run から**。

```ts
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const DRY_RUN = process.env.DRY_RUN !== 'false' // デフォルト dry-run

initializeApp({ credential: cert(/* FIREBASE_ADMIN_* env から */) })
const db = getFirestore()

async function main() {
  let migrated = 0
  // 旧形式のみを対象に、ページングしながら処理
  let last: FirebaseFirestore.QueryDocumentSnapshot | undefined
  for (;;) {
    let q = db.collection('users').where('schemaVersion', '<', 2)
      .orderBy('schemaVersion').limit(300)
    if (last) q = q.startAfter(last)
    const snap = await q.get()
    if (snap.empty) break

    const batch = db.batch() // batch は最大 500 書き込み
    for (const doc of snap.docs) {
      const data = doc.data()
      batch.update(doc.ref, {
        profile: { displayName: data.name ?? '' },
        schemaVersion: 2,
      })
    }
    if (!DRY_RUN) await batch.commit()
    migrated += snap.size
    last = snap.docs[snap.docs.length - 1]
    console.log(`${DRY_RUN ? '[dry-run] ' : ''}migrated: ${migrated}`)
  }
}
main()
```

実行手順:

```bash
npx tsx scripts/migrations/002-user-profile.ts                 # dry-run（件数と対象を確認）
DRY_RUN=false npx tsx scripts/migrations/002-user-profile.ts   # 本実行
```

- `schemaVersion` フィールドが無い既存データは、`where` で拾えないことがある（フィールド不在はクエリに出ない）。その場合は全件走査して判定する
- 大量データは Cloud Run jobs / ローカル長時間実行のどちらで回すか先に決める

## 検証（verify）

```ts
// 旧形式の残存件数（0 になったら段階 4 へ）
const remain = await db.collection('users').where('schemaVersion', '<', 2).count().get()
console.log('remaining:', remain.data().count)
```

- 件数 0 + アプリの読み取りエラーが出ていない（observability-setup）ことを確認
- 数日〜は新旧併記のまま寝かせる

## 段階 4: 掃除

1. 互換読み取り（`?? data.name`）と旧フィールド併記を削除
2. バックフィルと同型のスクリプトで `name` を `FieldValue.delete()`
3. Security Rules から旧フィールドの記述を削除

## 移行記録テンプレ（docs/ops/migrations/NNN-<name>.md）

```markdown
# 002: users.name → profile.displayName

- 目的 / 背景:
- 対象: users コレクション（約 N 件）
- 段階: 1 互換読み取り (PR#) → 2 デュアルライト (PR#) → 3 バックフィル (実行日時/件数) → 4 掃除 (PR#)
- dry-run 結果: 対象 N 件
- verify: 残存 0 件 @ 日時
- ロールバック条件: 読み取りエラー率が上がったら段階 2 まで revert（段階 4 以降は不可）
```

> Admin SDK の API（count() 集計、BulkWriter 等）はバージョン差がある。大量データで BulkWriter を使う場合は公式で確認すること。
