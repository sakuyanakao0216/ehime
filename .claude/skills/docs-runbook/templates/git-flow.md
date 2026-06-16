# Git フロー — {{PROJECT_NAME}}

## branch 戦略

- `main` — 本番デプロイ対象。直 push 禁止、PR マージのみ
- `<type>/<short-name>` 例: `feat/login-form`, `fix/header-overflow`, `chore/ci-cache`
- 1 branch = 1 関心事。長期化したら subbranch に分割

## 通常フロー (Vercel Toolbar コメント駆動を活かす)

```
1. git switch -c feat/<name>
2. 最小実装 → git push -u origin feat/<name>
3. Draft PR を作成 (gh pr create --draft または GitHub Web)
   ※ Auto-fix を使うには Draft でも PR が必須 (branch push だけでは発火しない)
4. Vercel Preview URL の 💬 にコメント / chat に「○○直して」発話
   → Auto-fix or 手動 loop で commit が積まれる
5. レビュー OK → "Ready for review" に昇格 → main にマージ
```

## コミットメッセージ

- 形式: `<type>: <概要>` (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
- 本文: なぜ (Why) を 1-2 文。What はコードを読めば分かるので最小限

## PR 単位の目安

- 100-300 行が目安。それ以上はレビュー疲れで質が落ちる
- 関係ない変更を混ぜない (例: 機能追加 + 全フォーマット = 別 PR)

## やってはいけないこと

- `main` への直 push / force push
- `--no-verify` (pre-commit hook を skip)
- 大量の自動整形 commit を機能 commit と混ぜる
- 他人の commit に対する `--amend`
