# PRD テンプレート

`docs/specs/prd.md` に生成する雛形。空欄は会話 / idea-framing 出力から埋める。

```markdown
# PRD: <プロダクト/機能名>

## 背景・課題
- 誰の / どんな課題か（idea-framing のペルソナ・痛みを引用）

## 目的・成功条件
- このプロトで何が言えれば勝ちか（定量があれば数値）

## スコープ
- やること / やらないこと（Non-goals を必ず書く）

## 機能要件
| ID | 機能 | 説明 | 優先度 (MoSCoW) |
|---|---|---|---|
| F-1 | … | … | Must |

## 非機能要件
| 観点 | 要件 |
|---|---|
| パフォーマンス | 初回表示 < 2.5s (LCP) など |
| セキュリティ | 認証必須 / PII 取扱（privacy-check と連携） |
| 可用性 | プロト段階の割り切り |
| アクセシビリティ | WCAG 2.2 AA（design-review と連携） |
| レスポンシブ | スマホ/タブレット/PC（shadcn-ui responsive と連携） |

## 画面要件（概要）
- 画面一覧（詳細は screen-spec へ）

## API仕様（概要）
- 主要エンドポイント / データの出入り（詳細は api-contract へ）

## リスク・不確実性
- idea-framing の不確実性 TOP3 とその検証計画
```

## 書き方の指針

- **Non-goals を必ず書く**（スコープの暴走を防ぐ）
- 機能要件は MoSCoW（Must/Should/Could/Won't）で優先度を付け、`story-map.md` の MVP と整合させる
- 非機能要件は他スキルの観点（design-review / privacy-check / smoke-test）に接続する
