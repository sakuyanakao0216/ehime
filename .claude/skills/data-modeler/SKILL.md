---
name: data-modeler
description: アプリのデータ構造を設計するスキル。「データモデル」「データ設計」「コレクション設計」「スキーマ設計」「ERD」「ER図」「テーブル設計」「型定義」「Firestore設計」「data-model」などのキーワードでトリガする。app-flow-designer / screen-spec で洗い出したエンティティから、Firestore のコレクション/ドキュメント設計（または RDB のテーブル設計）、TypeScript 型定義、ERD 相当（Mermaid erDiagram）を docs/design/data-model.md に出力する。これは設計であり、実際の CRUD/Rules 実装は firebase-backend、モックデータ生成は mockdata-ja が担う。型はそれらと共有する。
allowed-tools: [Bash, Read, Write, Edit]
---

# data-modeler

## このスキルが解決すること

データ構造をコードで決め打ちすると、画面要件やクエリと食い違って作り直しになる。**設計として**コレクション/型/関係を一枚に固め、実装（firebase-backend）とモック（mockdata-ja）の共通の正にする。

1. **コレクション/テーブル設計**: 何をどう持つか、関係、インデックス観点
2. **型定義**: TypeScript 型を生成（mockdata-ja / firebase-backend と共有）
3. **ERD**: Mermaid erDiagram で関係を可視化

## 起動方法

### slash command
`/data-model [firestore|rdb|erd|types]` で起動。

### 自律起動
「データモデルを設計」「コレクション設計して」「ER図」「型を定義」などで自動起動。

## 出力（docs/design/data-model.md）

- エンティティ一覧（フィールド / 型 / 必須 / 説明）
- コレクション/テーブル構成（Firestore は [firestore-modeling.md](./references/firestore-modeling.md)）
- **ERD**（ER 図。見出しに `ERD` という語を入れる。[erd.md](./references/erd.md)）
- 生成する型は `lib/types/<domain>.ts`（または mockdata-ja の `lib/mock/<domain>/types.ts` を正にする）

## 設計 vs 実装の分離

| 役割 | 担当 |
|---|---|
| **設計**（構造・関係・型・ERD） | このスキル（data-modeler） |
| 実装（CRUD・Security Rules） | `firebase-backend` |
| モックデータ生成 | `mockdata-ja` |

3 者は**同じ型**を共有する（二重定義しない）。

## やってはいけないこと

- Firestore で RDB 的な過度な正規化（読み取りパターン優先で非正規化を許容）
- 設計と実装で型を二重管理する（型は 1 箇所、ここを正に）
- インデックスやクエリ制約を無視した設計（Firestore の複合インデックス制約に注意）

## 周辺

- `app-flow-designer` / `screen-spec`: エンティティと表示項目の入力
- `firebase-backend`: この設計を CRUD/Rules に実装
- `mockdata-ja`: この型でモックを生成
- `api-contract`: この型を I/O に使う
