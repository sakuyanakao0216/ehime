# 画面仕様テンプレート

`docs/design/screens/<screen>.md` の雛形。

```markdown
# 画面: <画面名> (`<route>`)

## 目的
- <この画面で達成すること 1 文>

## 表示項目
| 項目 | 説明 | データ源 |
|---|---|---|
| タイトル | … | orders.title (data-modeler) |

## 操作
| 操作 | トリガ | 結果/遷移先 |
|---|---|---|
| 作成 | ボタン | /create へ遷移 |

## バリデーション
| 入力 | ルール | エラーメッセージ |
|---|---|---|
| email | 必須 / メール形式 | メールアドレスを正しく入力してください |

## 状態（6 状態）
- loading: skeleton で一覧枠を表示
- empty: 「まだありません」+ 作成ボタン
- error: 「読み込みに失敗しました」+ 再試行
- success: 一覧表示
- permission: 権限がない場合は 403（auth-rules 参照）
- disabled: 送信中はボタン無効 + spinner

## 関連
- 導線: docs/design/app-flow.md
- データ: docs/design/data-model.md
```

## 指針

- 表示項目は `data-modeler` のフィールドと 1:1 で対応させる（後で齟齬が出ない）
- 操作の遷移先は `app-flow` の導線と一致させる
- 状態は [states.md](./states.md) の標準セットから該当を必ず埋める
