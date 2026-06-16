---
name: firebase-backend
description: プロト用のサーバーレス・バックエンドを Firebase で立ち上げるスキル。「DB入れて」「データベース」「認証つけて」「ログイン機能」「サインイン」「Firebase連携」「Firestore」「ファイルアップロード」「ユーザー登録」「定期実行」「バッチ」「Cloud Functions」「Webhook受けたい」「権限設計」「ロール設計」「管理者権限」「auth-rules」「firebase-backend」などのキーワードでトリガする。Firestore (DB) / Firebase Auth (認証) / Storage (ファイル) のクライアント層、Admin SDK によるサーバー特権処理、Security Rules の 2 段雛形を一気通貫で構築し、Next.js で収まらない処理 (定期実行・長時間ジョブ・キュー) は GCP (Cloud Functions / Run / Scheduler / Tasks) へスケールする案内をする。クライアント config は NEXT_PUBLIC_FIREBASE_*、Admin 秘密鍵は FIREBASE_ADMIN_* に分離する。
allowed-tools: [Bash, Read, Write, Edit]
---

# firebase-backend

## このスキルが解決すること

プロトに「ログイン」「データ保存」「ファイルアップロード」が要るとき、サーバー構築に時間をかけたくない。Firebase はサーバー管理不要で、Vercel(Next.js) と相性が良く、Firestore = GCP プロジェクトなので必要なら GCP へそのままスケールできる。このスキルは:

1. **クライアント層を最短で**: Firestore / Auth / Storage を型付きで配線
2. **サーバー層 (権限) を安全に**: Admin SDK を Route Handler でのみ使い、特権書き込み・Webhook 検証
3. **本格バックエンドへの出口**: Next.js で収まらない処理を GCP に載せる判断と雛形を案内

## 起動方法

### slash command

`/firebase [db|auth|storage|admin|backend|all]` で起動。

### 自律起動

「DB入れて」「認証つけて」「ログイン機能」「ファイルアップロード」「定期実行のジョブ」などの発話で自動起動。

## クライアント層（最短経路）

導入: `pnpm add firebase`

1. **初期化** `lib/firebase.ts` — `NEXT_PUBLIC_FIREBASE_*` から config を読み、`app` / `db` / `auth` / `storage` を export
2. **Firestore** — 型付き CRUD ヘルパー。型は `mockdata-ja` の `lib/mock/<domain>/types.ts` と揃え、モック → 実 DB に差し替え可能にする ([references/firestore-patterns.md](./references/firestore-patterns.md))
3. **Auth** — メール / Google ログイン + `useAuth` フック + 保護ルート (middleware or layout) ([references/auth-patterns.md](./references/auth-patterns.md))
4. **Storage** — ファイルアップロード + ダウンロード URL 取得

## サーバー層（権限・本格 BE）

導入: `pnpm add firebase-admin`

- **Admin SDK** は `FIREBASE_ADMIN_*` (サービスアカウント) を使い、**Route Handler / Server Action のみ**で初期化 ([references/admin-and-gcp.md](./references/admin-and-gcp.md))
- 用途: Security Rules を迂回する特権書き込み / 外部 Webhook の署名検証 / サーバー側集計 / `ai-feature` の RAG ストア更新
- クライアントには絶対に出さない (秘密鍵)

## 認証設計（ロール / 権限 / 管理者）— `/auth-rules`

ロール・権限・管理者権限・Security Rules を**設計として**先に固めてから実装する。詳細は [references/auth-roles.md](./references/auth-roles.md)。

- ロール（admin / member / guest）と権限マトリクスを定義
- ロールは `users/{uid}.role` と Auth Custom Claims の二重持ち（Rules は Claims、UI は Firestore）
- **UI で隠すだけ**にせず、必ず Security Rules / Admin SDK で強制
- UI の権限なし表示は `screen-spec` の permission 状態、API の認証要否は `api-contract` と整合

## GCP へのスケール

HTTP リクエスト内で完結しない処理 (定期実行 / 長時間 / キュー / 大量バッチ) は Next.js に置かず GCP に載せる。Firebase プロジェクト = GCP プロジェクトなのでそのまま使える:

- **定期実行** → Cloud Scheduler + Cloud Functions (`onSchedule`)
- **長時間ジョブ** → Cloud Run
- **キュー / 非同期** → Cloud Tasks / Pub/Sub
- **スケールする Webhook** → Cloud Functions (HTTP)

判断軸と最小スニペットは [references/admin-and-gcp.md](./references/admin-and-gcp.md) と [docs/comparison/backend-strategy.md](../_docs/comparison/backend-strategy.md)。

## Security Rules

[references/security-rules.md](./references/security-rules.md) にプロト用と本番用の 2 段雛形を用意。**プロト用 (`if request.auth != null` 程度) を本番にそのまま昇格させない**。

## 環境変数

```
# クライアント (公開されてよい / NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# サーバー (秘匿 / Admin SDK)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...   # 改行は \n エスケープ
```

Secrets は `project-bootstrap` 同様 `gh secret set` / Vercel env で投入。命名は [docs/conventions/env-naming.md](../_docs/conventions/env-naming.md) に従う（`NEXT_PUBLIC_FIREBASE_*` は公開可、`FIREBASE_ADMIN_*` はサーバーのみ）。

## やってはいけないこと

- Security Rules を `allow read, write: if true;` のまま本番投入
- Admin SDK の秘密鍵 (`FIREBASE_ADMIN_PRIVATE_KEY`) をクライアントや `NEXT_PUBLIC_*` に置く
- クライアントから特権処理を直接呼ぶ (必ず Route Handler 経由)

## 周辺

- `mockdata-ja`: Firestore に入れる前にモックで型と画面を固める
- `ai-feature`: 会話履歴・RAG ベクトルストアの永続化先
- `project-bootstrap`: Secrets 投入の導線
- バックエンド階層の選び方は [docs/comparison/backend-strategy.md](../_docs/comparison/backend-strategy.md)
