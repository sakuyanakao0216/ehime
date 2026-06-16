---
name: app-flow-designer
description: アプリのユーザー導線と画面構成を設計するスキル。「導線設計」「ユーザーフロー」「画面遷移」「画面一覧」「状態遷移」「ユースケース」「フロー図」「app-flow」「サイトマップ」などのキーワードでトリガする。spec-writer の仕様を受けて、ユーザー導線（Mermaid flowchart）・画面一覧（route と役割）・主要オブジェクトの状態遷移（Mermaid stateDiagram）・主要ユースケースの手順を docs/design/app-flow.md に出力する。ここで固めた画面一覧と状態が screen-spec / data-modeler / api-contract の入力になる。
allowed-tools: [Bash, Read, Write, Edit]
---

# app-flow-designer

## このスキルが解決すること

画面をいきなり作り始めると「この画面どこから来てどこへ行く?」が後で破綻する。実装前に **導線・画面一覧・状態遷移**を 1 枚に固め、設計の共通言語にする。

1. **ユーザー導線**: 入口から主要ゴールまでの流れを Mermaid flowchart で
2. **画面一覧**: route / 役割 / 認証要否 / 主要アクション
3. **状態遷移**: 注文・申請などのオブジェクトのライフサイクルを Mermaid stateDiagram で
4. **主要ユースケース**: 代表シナリオの手順

## 起動方法

### slash command
`/app-flow [flow|screens|states|usecase]` で起動。

### 自律起動
「導線を設計して」「画面遷移を整理」「状態遷移図」「画面一覧を出して」などで自動起動。

## 出力（docs/design/app-flow.md）

```markdown
## 画面一覧
| route | 画面 | 役割 | 認証 | 主要アクション |
|---|---|---|---|---|
| /login | ログイン | 認証 | 不要 | ログイン |
| /(dashboard) | ダッシュボード | KPI 表示 | 必要 | 一覧/作成 |

## 導線（Mermaid）
（flowchart）

## 状態遷移（Mermaid）
（stateDiagram-v2）
```

図の書き方は [references/flow-patterns.md](./references/flow-patterns.md)。

## やってはいけないこと

- 全画面を網羅しようとして MVP の主導線がぼやける（`story-map` の MVP に絞る）
- 状態遷移を実装の都合で増やす（ユーザーから見た状態に絞る）

## 周辺

- `spec-writer`: 前段の仕様（画面要件・ストーリーマップ）
- `screen-spec`: 各画面の詳細仕様（この一覧を入力にする）
- `data-modeler` / `api-contract`: 状態遷移・導線から必要データ/APIを導く
- `shadcn-ui`: 画面一覧をレイアウト実装に落とす
