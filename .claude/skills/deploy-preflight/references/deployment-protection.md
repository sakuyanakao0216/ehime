# デモの公開範囲制御 (Deployment Protection)

ピッチ用プロトは「客には見せたいが、世界には公開したくない」状態が普通。デプロイ前に**誰がアクセスできる状態か**を決めてからデプロイする。

## 判断フロー: 誰に見せるか → 手段

| 見せる相手 | 推奨手段 | プラン |
|---|---|---|
| 自分・チーム (Vercel メンバー) のみ | Vercel Authentication (Deployment Protection) | 全プラン |
| 社外の客 (Vercel アカウント不要) | Shareable Links で保護付きプレビューを共有 | Pro 以上 |
| 社外の客 (本番 URL ごと渡したい) | middleware の Basic 認証 (下記コード) | プラン非依存 |
| 全世界に公開してよい | 保護なし (意図的であることを確認) | — |

> Vercel Deployment Protection の保護スコープ (プレビューのみ / 本番含む) や Password Protection (有料アドオン)・Trusted IPs (Enterprise) の最新仕様は[公式ドキュメント](https://vercel.com/docs/deployment-protection)で確認。**カスタム本番ドメインまで確実に守りたい場合は middleware 方式がプラン非依存で確実**。

## Vercel Deployment Protection (ダッシュボード設定)

1. Vercel Dashboard → Project → Settings → **Deployment Protection**
2. **Vercel Authentication** を有効化 (チームメンバーのみアクセス可)
3. 客に見せるときは **Shareable Link** を発行して URL を共有 (保護は維持される)

設定はダッシュボード側にあるため**ローカルのコードからは検出できない**。`scan-demo-protection.mjs` が warning を出した場合はここを目視確認する。

## middleware Basic 認証 (プラン非依存・本番ドメインも保護)

```ts
// middleware.ts (プロジェクトルート or src/)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;
  if (!user || !pass) return NextResponse.next(); // env 未設定なら素通し (ローカル開発)

  if (auth?.startsWith('Basic ')) {
    const [u, p] = atob(auth.slice(6)).split(':');
    if (u === user && p === pass) return NextResponse.next();
  }
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="demo"' },
  });
}

export const config = {
  // 静的アセットと API は除外 (必要に応じて調整)
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

- `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` は Vercel の env に設定 (`NEXT_PUBLIC_` を**付けない**。命名規約: [env-naming.md](../../_docs/conventions/env-naming.md))
- 客には「URL + ユーザー名 + パスワード」を 1 セットで渡す

## smoke test との両立

保護を有効にすると Playwright の smoke test (項目 9) が 401 で落ちる。回避策:

- **Vercel Authentication / Password Protection の場合**: Protection Bypass for Automation のシークレットを発行し、リクエストヘッダ `x-vercel-protection-bypass` に載せる
- **middleware Basic 認証の場合**: Playwright の `use: { httpCredentials: { username, password } }` を設定する

## 解除タイミング

正式リリースで全世界公開に切り替えるときは、保護解除と同時に `seo-meta` の sitemap / robots (プレビューは noindex) の見直しもセットで行う。
