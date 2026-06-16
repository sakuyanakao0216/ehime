# 環境変数 命名規約

全プラグインが env を扱うときに従う共通ルール。クライアント露出事故を防ぎ、Secrets の出し入れを一貫させるのが目的。

## 大原則：公開可否を接頭辞で区別する

| 接頭辞 | 公開範囲 | バンドル | 用途 |
|---|---|---|---|
| `NEXT_PUBLIC_*` | **クライアントに露出** | JS に埋め込まれる | 公開してよい設定のみ（Firebase クライアント config、公開 URL など） |
| (接頭辞なし) | **サーバーのみ** | 露出しない | 秘密鍵・トークン・Admin 認証情報 |

> **秘密情報を `NEXT_PUBLIC_` に置かない**。これが最重要ルール。`AI_GATEWAY_API_KEY` や `FIREBASE_ADMIN_PRIVATE_KEY` を `NEXT_PUBLIC_*` にしてはいけない。

## 命名フォーマット

```
[NEXT_PUBLIC_]<DOMAIN>_<KEY>
```

- **UPPER_SNAKE_CASE**（大文字 + アンダースコア）
- `<DOMAIN>`：機能領域を表す接頭辞（プロバイダ / サービス名）。同じ機能の変数は同じ接頭辞でまとめる
- `<KEY>`：用途。`URL` / `TOKEN` / `API_KEY` / `ID` / `MODEL` など役割語で終える

## ドメイン接頭辞の一覧（このリポジトリ）

| ドメイン | 接頭辞 | 例 | 公開 |
|---|---|---|---|
| AI (Vercel AI SDK / Gateway) | `AI_` | `AI_GATEWAY_API_KEY` / `AI_MODEL` / `AI_IMAGE_MODEL` | サーバー |
| Firebase クライアント | `NEXT_PUBLIC_FIREBASE_` | `NEXT_PUBLIC_FIREBASE_API_KEY` 他 | クライアント |
| Firebase Admin | `FIREBASE_ADMIN_` | `FIREBASE_ADMIN_PRIVATE_KEY` 他 | サーバー |
| GitHub | `GITHUB_` | `GITHUB_TOKEN` | サーバー |

新しいサービスを足すときは **新しい `<DOMAIN>_` 接頭辞を 1 つ決めて全変数を揃える**（バラバラの語を混ぜない）。

## 役割語（`<KEY>` 末尾）の使い分け

| 役割語 | 意味 |
|---|---|
| `_URL` | エンドポイント |
| `_TOKEN` / `_API_KEY` | 認証情報（必ずサーバー側） |
| `_ID` | 識別子（project id 等） |
| `_MODEL` | モデル指定など切替パラメータ |
| `_SECRET` | 署名検証用シークレット（サーバー側） |

## 運用ルール

- `.env.example` に**キー名だけ**（値は空 or ダミー）をコミットし、実値はコミットしない
- 実値は `gh secret set <NAME>` / Vercel env（`project-bootstrap` の流儀）で投入
- 改行を含む値（Admin 秘密鍵）は `\n` エスケープで 1 行化し、コード側で `.replace(/\\n/g, '\n')`
- env を増やしたら本ドキュメントの接頭辞表に追記する

## チェック

- `deploy-preflight` の secret スキャンが、コミットに混入した秘密値を検出する
- `NEXT_PUBLIC_` に秘密語（`TOKEN`/`SECRET`/`PRIVATE_KEY`）が付いていたら設計ミス

## 関連

- `ai-feature` / `firebase-backend` / `image-gen` の各「環境変数」節
- Secrets 投入導線は `project-bootstrap`
