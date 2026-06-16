# Firebase Auth パターン

## useAuth フック

```tsx
// lib/auth/use-auth.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const Ctx = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => onAuthStateChanged(auth, u => { setUser(u); setLoading(false) }), [])
  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
export const logout = () => signOut(auth)
```

## ログイン（メール / Google）

```ts
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export const loginEmail = (email: string, pw: string) =>
  signInWithEmailAndPassword(auth, email, pw)
export const signupEmail = (email: string, pw: string) =>
  createUserWithEmailAndPassword(auth, email, pw)
export const loginGoogle = () => signInWithPopup(auth, new GoogleAuthProvider())
```

UI は `shadcn-ui` の `card` + `form` + `input` + `button` で組む (ログイン画面パターン)。

## 保護ルート

### クライアント側ガード（プロト最短）
```tsx
'use client'
import { useAuth } from '@/lib/auth/use-auth'
import { redirect } from 'next/navigation'

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div>...</div>
  if (!user) redirect('/login')
  return <>{children}</>
}
```

### サーバー側で本気で守るなら
ID トークンを Cookie に載せ、Route Handler / middleware で Admin SDK の `verifyIdToken` で検証する ([admin-and-gcp.md](./admin-and-gcp.md))。プロトはクライアントガードで十分なことが多い。

> Auth とルート保護の API は更新がある。実装時に最新ドキュメントで確認すること。
