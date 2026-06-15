/**
 * 環境変数アクセスの基盤 (公開設定のみ)。
 *
 * サーバー専用の秘密キー (AI_GATEWAY_API_KEY / FIREBASE_ADMIN_* 等) は、それを使う
 * ai-feature / firebase-backend が生成するコード側 (lib/ai.ts など) で読む想定なので
 * ここには置かない (最小スケルトン方針)。鍵の一覧と命名規約は
 * .env.example / marketplace docs/conventions/env-naming.md を参照。
 */

/** ブラウザに露出してよい公開設定。NEXT_PUBLIC_* のみ。 */
export const publicEnv = {
  /**
   * アプリの公開 URL (OGP / リダイレクト先などに使う)。layout.tsx の metadataBase が参照。
   * 解決順: NEXT_PUBLIC_APP_URL → Vercel が自動注入する URL → (dev のみ) localhost。
   * Vercel 上では env 未設定でも動く。Vercel 外の本番 (self-host 等) だけ明示設定を必須化する
   * (localhost に落ちると OGP/redirect が静かに壊れるため throw で気づかせる)。
   * getter なので「使った箇所だけ」評価される。
   */
  get appUrl(): string {
    const value = process.env.NEXT_PUBLIC_APP_URL
    if (value) return value
    // Vercel デプロイ: 本番ドメイン → デプロイ毎 URL の順でフォールバック (サーバー側でのみ入る)
    const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
    if (vercelUrl) return `https://${vercelUrl}`
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '環境変数 "NEXT_PUBLIC_APP_URL" が本番で未設定です。Vercel env に公開 URL を設定してください。',
      )
    }
    return 'http://localhost:3000'
  },
} as const
