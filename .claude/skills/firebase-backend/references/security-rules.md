# Firestore / Storage Security Rules

**鉄則**: プロト用 Rules を本番にそのまま昇格させない。最低でも「認証済みのみ」、本番は「所有者のみ」に絞る。

## プロト用（認証済みユーザーなら読み書き可）

`firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;  // プロト用。本番昇格前に必ず絞る
    }
  }
}
```

## 本番用（所有者のみ + コレクション別）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /orders/{orderId} {
      allow read: if request.auth != null && resource.data.customerId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.customerId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.customerId == request.auth.uid;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 明示しないものは全て拒否
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Storage Rules

`storage.rules`:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{file=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024;  // 10MB 上限
    }
  }
}
```

## デプロイ

```bash
firebase deploy --only firestore:rules,storage
```

## 危険検知（deploy-preflight と連携）

`allow read, write: if true;` が `firestore.rules` / `storage.rules` に残ったまま本番デプロイしようとしたら止める、というチェックは `deploy-preflight` の prod-config 系スキャンに足せる (将来)。
