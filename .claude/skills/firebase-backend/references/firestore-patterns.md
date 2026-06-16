# Firestore パターン

## 初期化 `lib/firebase.ts`

```ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApp() : initializeApp(config)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
```

## 型付き CRUD ヘルパー

`mockdata-ja` が生成する型 (`lib/mock/<domain>/types.ts`) をそのまま使うと、モック → 実 DB の差し替えが楽になる。

```ts
// lib/repo/orders.ts
import { db } from '@/lib/firebase'
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore'
import type { Order } from '@/lib/mock/ec/types'  // mockdata-ja の型を再利用

const col = collection(db, 'orders')

export async function listOrders(customerId: string): Promise<Order[]> {
  const q = query(col, where('customerId', '==', customerId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Order)
}

export async function createOrder(input: Omit<Order, 'id'>) {
  return addDoc(col, { ...input, createdAt: serverTimestamp() })
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  return updateDoc(doc(col, id), patch)
}

export async function removeOrder(id: string) {
  return deleteDoc(doc(col, id))
}
```

## コレクション設計のコツ（プロト）

- まずは**フラットなトップレベルコレクション**で始める (`orders`, `users`)。サブコレクションは必要になってから
- 一覧で使うフィールドだけ持ち、集計はクライアントか Admin SDK で
- `createdAt` / `updatedAt` は `serverTimestamp()` で統一
- 名寄せ用 ID (`customerId` 等) は `mockdata-ja` の ID 一貫性ルールに合わせる

## リアルタイム購読（必要なら）

```ts
import { onSnapshot, query, collection } from 'firebase/firestore'
onSnapshot(query(collection(db, 'orders')), snap => {
  // setState(snap.docs.map(...))
})
```

> API は SDK バージョンで変わる。実装時に firebase-js-sdk の最新ドキュメントで確認すること。
