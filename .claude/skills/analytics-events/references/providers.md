# プロバイダ別 計測実装（GA4 / PostHog / Firebase Analytics）

`docs/analytics/events.md` の設計を実装に落とす例。env 命名は [env-naming.md](../../_docs/conventions/env-naming.md) に従う。

## 共通: 計測ラッパ

プロバイダ差を吸収する 1 関数に集約し、画面側はそこだけ呼ぶ（差し替え可能に）。

```ts
// lib/analytics.ts
export function track(event: string, props?: Record<string, string | number>) {
  // PII を入れない（privacy-check）。送信先は env で切替
  // ここで GA4 / PostHog / Firebase のいずれかに委譲
}
```

## GA4（gtag）

```ts
// 計測: gtag('event', 'sign_up', { method: 'google' })
```
- env: `NEXT_PUBLIC_GA_ID`（公開可）
- Next.js は `@next/third-parties/google` の `<GoogleAnalytics gaId=... />` が手軽

## PostHog

```ts
import posthog from 'posthog-js'
posthog.capture('sign_up', { method: 'google' })
```
- env: `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST`
- 自動キャプチャは便利だが PII 取り込みに注意（マスキング設定）

## Firebase Analytics

```ts
import { logEvent, getAnalytics } from 'firebase/analytics'
logEvent(getAnalytics(), 'sign_up', { method: 'google' })
```
- `firebase-backend` の `lib/firebase.ts` を再利用
- SSR では analytics を遅延初期化（`isSupported()`）

## 注意

- 計測キー（`NEXT_PUBLIC_*`）は公開前提。秘密値ではない
- PII 非混入を privacy-check で確認
- 同意管理（同意前は計測しない）が要る場合は consent gating

> 各 SDK の API・自動計測仕様は更新される。実装時に最新ドキュメントで確認すること。
