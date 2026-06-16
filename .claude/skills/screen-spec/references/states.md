# 画面状態の標準セット（6 状態）

すべての「データを扱う画面」で、この 6 状態の見せ方を決める。実装は `shadcn-ui`、確認は `design-review`/`smoke-test`。

| 状態 | 発生条件 | 推奨 UI | 注意 |
|---|---|---|---|
| **loading** | 取得中 | `skeleton`（レイアウト維持）/ spinner | レイアウトシフトを防ぐため skeleton 推奨 |
| **empty** | 0 件 | 空イラスト + 説明 + **次アクション導線** | 「データがありません」だけで終わらせない |
| **error** | 取得/送信失敗 | エラーメッセージ + **再試行** ボタン | 技術的詳細は出さず、回復手段を出す |
| **success** | 正常 | 通常表示 / 完了トースト（`sonner`） | — |
| **permission** | 権限なし | 403 / 「権限がありません」 | **サーバー側 auth-rules と整合**（UI だけで隠さない） |
| **disabled** | 操作不可（送信中/前提未充足） | ボタン無効 + 理由（tooltip） | なぜ押せないかを示す |

## 実装の対応（shadcn-ui）

```tsx
if (isLoading) return <Skeleton />            // loading
if (error)     return <ErrorState onRetry />  // error
if (!items.length) return <EmptyState />      // empty
return <List items={items} />                 // success
// disabled: <Button disabled={submitting}>、permission: サーバーで弾く + 403 表示
```

## レビュー観点

- `design-review` 軸2/軸8: 各状態がスマホ/タブレット/PC で崩れないか
- `smoke-test`: empty / error を含む主要状態が開けるか（モックで再現）

## 関連
- 権限の正は [firebase-backend の auth-rules](../../firebase-backend/references/auth-roles.md)
