---
name: screen-spec
description: 各画面の詳細仕様と全状態を定義するスキル。「画面仕様」「画面定義」「表示項目」「入力バリデーション」「エラー状態」「空状態」「ローディング状態」「画面の状態設計」「state-design」「screen-spec」などのキーワードでトリガする。app-flow-designer の画面一覧を入力に、各画面の目的・表示項目・操作・バリデーションと、loading / empty / error / success / permission(権限なし) / disabled の全状態（旧 state-design を吸収）を docs/design/screens/ に定義する。ここで決めた状態が shadcn-ui の実装と design-review・smoke-test の確認対象になる。
allowed-tools: [Bash, Read, Write, Edit]
---

# screen-spec

## このスキルが解決すること

「正常系の画面」だけ作って、空・エラー・権限なし・ローディングが抜けたまま実装 → ピッチで「データ無いとどうなるの?」で詰む。各画面を **全状態込み**で定義し、実装とレビューの抜け漏れを防ぐ。

1. **画面の中身**: 目的 / 表示項目 / 操作 / バリデーション
2. **全状態**: loading / empty / error / success / permission / disabled（旧 state-design）
3. **実装・レビューへ接続**: shadcn-ui で組み、design-review/smoke-test で確認

## 起動方法

### slash command
`/screen-spec [<画面名>|all|states]` で起動。

### 自律起動
「ログイン画面の仕様」「この画面の空状態どうする」「バリデーション定義」「画面の状態を設計」などで自動起動。

## 画面仕様の構成（docs/design/screens/<screen>.md）

| 節 | 内容 |
|---|---|
| 目的 | この画面で達成すること（1 文） |
| 表示項目 | 何を見せるか（データ源は data-modeler と対応） |
| 操作 | ボタン/リンク/フォームと遷移先（app-flow と対応） |
| バリデーション | 入力規則とエラーメッセージ |
| 状態 | 下記 6 状態それぞれの見せ方 |

## 画面状態セット（必須 6 状態）

[references/states.md](./references/states.md) の標準に従い、各画面で**該当する状態を必ず明記**する:

| 状態 | いつ | 見せ方の例 |
|---|---|---|
| loading | データ取得中 | skeleton / spinner |
| empty | データ 0 件 | 空イラスト + 次アクション導線 |
| error | 取得/送信失敗 | エラーメッセージ + 再試行 |
| success | 正常 | 通常表示 / トースト |
| permission | 権限なし | 403 表示（auth-rules と整合） |
| disabled | 操作不可 | ボタン無効 + 理由 |

## やってはいけないこと

- 正常系だけ定義して empty/error/permission を省く
- バリデーションのエラーメッセージを「不正な値です」のような無情報にする
- 権限なし状態を画面側だけで判断（サーバー側 `auth-rules` と必ず整合）

## 周辺

- `app-flow-designer`: 画面一覧（この入力）
- `data-modeler`: 表示項目のデータ源
- `shadcn-ui`: 状態を含めた実装（responsive と合わせる）
- `design-review` / `smoke-test`: 状態の確認・回帰
