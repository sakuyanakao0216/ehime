# エラー監視ツール導入（旧 error-monitoring）

代表 3 ツールの最小導入。env 命名は [env-naming.md](../../_docs/conventions/env-naming.md)。

## Sentry（汎用・推奨）

```bash
pnpm add @sentry/nextjs
pnpm dlx @sentry/wizard@latest -i nextjs
```
- env: `SENTRY_DSN`（サーバー）/ `NEXT_PUBLIC_SENTRY_DSN`（クライアント）/ `SENTRY_AUTH_TOKEN`（ソースマップ, 秘匿）
- `beforeSend` で **PII をスクラブ**（privacy-check）
- リリース/ソースマップ連携でスタックトレースを可読に

```ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  beforeSend(event) { /* PII 除去 */ return event },
})
```

## Vercel（ホスティング統合）

- **Vercel Logs**: Functions / Route Handler のログを標準で確認
- **Speed Insights**: `pnpm add @vercel/speed-insights` → `<SpeedInsights />`（Core Web Vitals）
- **Web Analytics**: `@vercel/analytics`（ただし詳細な行動計測は analytics-events）
- 追加 env 不要なものが多く、プロトの初手に向く

## Firebase Crashlytics

- 主にモバイル(RN/Flutter)向け。Web は Sentry / Vercel が一般的
- Firebase を使うプロジェクトで GCP 側ログと統一したい場合は Cloud Logging / Error Reporting も選択肢

## 選び方

| 状況 | 推奨 |
|---|---|
| まず最小で | Vercel Logs + Speed Insights |
| ちゃんとエラー追跡 | Sentry |
| GCP/Firebase 中心・モバイル | Crashlytics / Cloud Error Reporting |

> 各 SDK / ウィザードは更新が速い。導入時に最新ドキュメントで確認すること。
