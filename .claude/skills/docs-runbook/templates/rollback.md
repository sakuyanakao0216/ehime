# Rollback — {{PROJECT_NAME}}

本番デプロイで問題が出たときの戻し方。**3 つの選択肢**があり、症状に応じて選ぶ。

## (1) Vercel Instant Rollback (推奨: 最速)

GitHub に触らず、Vercel の過去 deploy を Production に再昇格する。**60 秒以内**に切り戻せる。

1. Vercel → Project → Deployments
2. 直前の正常な deploy を選び `⋯` → **Promote to Production**
3. 完了。git 側は変えていないので、修正 commit を別途 push して再デプロイで治す

**使うべき場面**: 本番障害、データ破損リスクなし、回帰の原因が不明だがすぐ戻したい

## (2) `git revert` (推奨: 原因が明確で履歴を残したい)

```bash
git switch main
git pull
git revert <bad-commit-sha>
git push                  # main への直 push が許可されている場合
# または revert を branch + PR で
git switch -c hotfix/revert-<short>
git revert <bad-commit-sha>
git push -u origin hotfix/revert-<short>
gh pr create --base main --title "revert: <bad commit subject>"
```

**使うべき場面**: 原因 commit が特定済み、複数 commit の塊を戻す、レビュー履歴を残したい

## (3) Forward fix (推奨: 軽微な不具合)

revert より早く直せる場合は、追加 commit で修正してデプロイ。本流。

```bash
git switch -c fix/<issue>
# ...修正...
git push -u origin fix/<issue>
gh pr create --base main --title "fix: <description>"
```

## 判断フロー

```
本番障害が発生
  │
  ├─ 影響範囲が広い / 原因不明 → (1) Vercel Instant Rollback
  ├─ 原因 commit が特定済み    → (2) git revert
  └─ 軽微で原因も明確          → (3) Forward fix
```

## やってはいけないこと

- `git push --force` で main の履歴を書き換える
- 本番 DB に直接 SQL を打つ
- production deployment を `Delete` する (履歴ごと消える)
