# インフラ設定 — [機能名]

> 雛形。`.steering/[YYYYMMDD]-[機能名]/infla.md` にコピーして埋める。
> **秘密値は書かない**（実値は env / Vercel env / `gh secret` で管理。ここはキー名・構成のみ）。

## 利用リソース

(GCP / Vercel / Firebase など。例: Cloud Run, Firestore, Cloud Scheduler)

## 環境変数（キー名のみ）

- `AI_GATEWAY_API_KEY` …
- `FIREBASE_ADMIN_*` …
- (命名規約は marketplace docs/conventions/env-naming.md)

## デプロイ / 権限

(デプロイ経路、リージョン、必要な IAM / サービスアカウント権限)

## 注意 / ランブック

(運用上の注意、復旧手順への参照)
