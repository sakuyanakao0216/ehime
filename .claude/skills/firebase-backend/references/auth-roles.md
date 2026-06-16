# 認証・ロール・権限の設計

ロールと権限を**設計として**先に固め、`security-rules.md`（実装）と `screen-spec` の permission 状態に接続する。

## ロール定義

| ロール | 説明 | 付与方法 |
|---|---|---|
| `admin` | 全データ管理・他ユーザー操作 | Custom Claims（サーバーで付与） |
| `member` | 自分のデータの CRUD | 既定（サインアップ時） |
| `guest` | 閲覧のみ / 未ログイン | 未認証 |

ロールは `users/{uid}.role` と **Auth の Custom Claims** の二重持ちが基本（Rules は Claims、UI は Firestore を参照）。

## 権限マトリクス（例）

| リソース / 操作 | guest | member | admin |
|---|---|---|---|
| orders 自分の read | ✗ | ✓ | ✓ |
| orders 他人の read | ✗ | ✗ | ✓ |
| orders create | ✗ | ✓(自分) | ✓ |
| users 管理 | ✗ | ✗ | ✓ |

## 管理者権限・サーバー特権の境界

- **クライアントで判定する権限**（UI 出し分け）≠ **強制する権限**（Security Rules / Admin SDK）
- 管理者操作は Rules で `request.auth.token.role == 'admin'` を要求、かつ重要処理は Admin SDK（サーバー）で実行
- Custom Claims の付与は Admin SDK（`setCustomUserClaims`）で。クライアントから付与不可

## 実装への接続

- Rules 実装 → [security-rules.md](./security-rules.md)（`role` を条件に追加）
- UI の権限なし表示 → `screen-spec` の **permission 状態**
- API の認証要否 → `api-contract` の各エンドポイント

```
// Security Rules でのロール参照例
allow write: if request.auth != null && request.auth.token.role == 'admin';
```

## やってはいけないこと

- UI で隠すだけ（Rules / サーバーで強制しないと素通り）
- Custom Claims をクライアントで設定しようとする（必ず Admin SDK）

> Firebase Auth の Custom Claims / Rules の仕様は更新がある。実装時に最新ドキュメントで確認すること。
