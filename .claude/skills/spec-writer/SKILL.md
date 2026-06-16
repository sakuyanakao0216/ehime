---
name: spec-writer
description: 構想を実装可能な仕様に変換するスキル。「仕様書作って」「PRD」「要件定義」「機能要件」「非機能要件」「受入条件」「ストーリーマップ」「MVP範囲」「優先度整理」「リリース計画」「Issue化して」「Notionに展開」「Jira/Linearに起票」「spec」などのキーワードでトリガする。idea-framing で固めた方向性を、PRD / 機能要件 / 非機能要件 / 画面要件 / API仕様概要 / 受入条件 と、ユーザーストーリーマップ（MVP範囲・優先度・リリース単位）に落とし込み、docs/specs/ に Markdown で生成する。生成した仕様は Notion / GitHub Issue / Linear / Jira へ展開する手順とテンプレも提供する（実連携は各ツールの MCP/手動に委ねる）。
allowed-tools: [Bash, Read, Write, Edit]
---

# spec-writer

## このスキルが解決すること

「作りたいものは決まったが、実装に渡せる粒度になっていない」を埋める。idea-framing（方向性の合意）と app-flow-designer（設計）の **あいだ** に立ち、構想を実装・見積もり・受入の根拠になる仕様に変換する。

1. **PRD 一式**: 機能要件 / 非機能要件 / 画面要件 / API仕様概要 / 受入条件
2. **ストーリーマップ**: MVP範囲・優先度・リリース単位（旧 user-story-map）
3. **外部展開**: docs/specs を Notion / Issue / Linear / Jira に起票する手順とテンプレ（旧 spec-sync）

## 起動方法

### slash command

`/spec [prd|story-map|acceptance|sync]` で起動。

### 自律起動

「仕様書まとめて」「PRD書いて」「受入条件を出して」「MVPの範囲を切って」「Issue化して」などの発話で自動起動。

## 生成物（docs/specs/）

| ファイル | 内容 |
|---|---|
| `prd.md` | 背景 / 目的 / スコープ / 機能要件 / 非機能要件 / 画面要件 / API仕様概要 / リスク |
| `story-map.md` | アクティビティ → ユーザーストーリー → MVP / リリース単位 / 優先度 |
| `acceptance.md` | 受入条件（Given / When / Then） |

ユーザーが `docs/specs/prd.md` など単一ファイルを指定した場合は、まずそのファイルに要点を集約して作成する。長大な周辺ファイル生成は後回しにし、PRD 内に **機能要件** / **非機能要件** / **MVP範囲** / **優先度** / **受入条件** の見出しを必ず含める。

### 前提がある / 非対話のとき(質問だけで止めない)

`docs/discovery/target-definition.md` や `idea-framing` の出力、あるいは構想が入力に含まれている場合、または**ヘッドレス(非対話)で実行された場合**は、**質問を返して終わってはいけない**。与えられた前提から PRD を **仮置きで必ず生成**し(ファイルを Write する)、埋められない箇所は本文に `(前提) …` / `(要確認) …` と明記する。確認したい点は成果物末尾に「確認したい点」として列挙する。「教えてください」だけで成果物ゼロにするのは責務放棄。

テンプレは [references/prd-template.md](./references/prd-template.md) / [references/story-map.md](./references/story-map.md)。

## 外部ツールへの展開

`docs/specs` を正（single source）とし、外部ツールには**そこから派生**させる。各ツールの起票テンプレと手順は [references/sync-targets.md](./references/sync-targets.md)。MCP が接続済みなら自動起票、無ければ貼り付け用テンプレを出す。

## やってはいけないこと

- **前提(ターゲット定義・構想)があるのに、質問だけ返して PRD を生成しない** → 仮置きで必ず成果物を出し、不足は `(要確認)` で示す。質問待ちは前提が**まったく無い**ときだけ
- 仮置き箇所を断定で書く（仮説は `(前提)` と明示し、検証対象を `(要確認)` に分ける）
- 仕様を外部ツールにだけ書いて docs/specs と二重管理にする（docs を正に）
- 受入条件を「正しく動くこと」のような検証不能な書き方にする（Given/When/Then で観測可能に）

## 周辺

- `idea-framing`: 前段（何を作るかの 6 問）
- `app-flow-designer` / `screen-spec` / `data-modeler` / `api-contract`: この仕様を受けた設計
- `feedback-triage`: 「仕様確認」に分類された FB はここに戻す
