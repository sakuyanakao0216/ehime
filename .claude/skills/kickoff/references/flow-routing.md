# フロー分岐ルーティング (ステージ → 担当スキル)

依頼に応じて**通すステージだけ**を選び、宣言してから順に受け渡す。毎回①から通さない。

## ステージ対応表

| # | ステージ | 担当スキル | 主な成果物 |
|---|---|---|---|
| ① | 構想 | `idea-framing` / `user-research` / `target-definition` / `competitive-analysis` / `kpi-design` / `spec-writer` | 暫定ステートメント / `docs/discovery/*` (調査・ターゲット・競合・KPI) / `docs/specs/*` (PRD・受入条件) |
| ② | 設計 | `app-flow-designer` / `screen-spec` / `data-modeler` / `api-contract` | `docs/design/*` (画面遷移・画面仕様・データモデル・API) |
| ③ | 環境 | `project-bootstrap` / `project-scaffold` | repo / Next.js + Tailwind + shadcn 雛形 |
| ④ | UI | `shadcn-ui` | `components/` `app/` の画面実装 |
| ⑤ | 素材 | `image-gen` / `mockdata-ja` / `format-ja` | 画像・モックデータ・整形ヘルパー |
| ⑥ | コア機能 | `ai-feature` / `firebase-backend` | AI 機能 / DB・認証・ストレージ |
| ⑦ | AI品質 | `ai-eval` / `ai-safety-check` | 評価・安全性チェック |
| ⑧ | 品質 | `design-review` / `pitch-review` / `privacy-check` | レビュー指摘 |
| ⑨ | リリース | `deploy-preflight` / `smoke-test` | 出荷前チェック (`/deploy-check`) |
| ⑩ | FB循環 | `vercel-toolbar-loop` / `feedback-triage` / `analytics-events` / `experiment-plan` | コメント対応・計測・実験 |
| ⑪ | 運用(横断・任意) | `settings-doctor` / `docs-runbook` / `observability-setup` | 設定診断・Runbook・監視。線形フローではなく横断 |

## 構想先行フル経路 (パターンB の①)

「方向性から相談」「ピッチに出す」「新規事業」など構想を固めてから作る依頼では、①構想を次の順で通す。各 `docs/` を確認しながら進み、既に固まっている工程は確認のみで飛ばす:

```
idea-framing → user-research → target-definition → competitive-analysis → kpi-design → spec-writer
```

| 順 | スキル | 役割 | 出力 |
|---|---|---|---|
| 1 | `idea-framing` | 6 問で仮説を軽く立てる | 暫定ステートメント / 不確実性 TOP3 |
| 2 | `user-research` | 仮説をユーザーの言葉で裏取り | `docs/discovery/user-research.md` |
| 3 | `target-definition` | 最初に狙う一群を絞る | `docs/discovery/target-definition.md` |
| 4 | `competitive-analysis` | 競合・代替を比較し優位を言語化 | `docs/discovery/competitive-analysis.md` |
| 5 | `kpi-design` | 成功を測る NSM/KPIツリー | `docs/discovery/kpi-design.md` |
| 6 | `spec-writer` | PRD / 受入条件に落とす | `docs/specs/*` |

> target を先に置いてから競合分析する(比較軸が対象・用途で決まりブレないため)。

## 入口の選び方 (例)

| 依頼 | 通すステージ |
|---|---|
| 「方向性から相談したい」「ピッチに出す新規事業」 | ①構想フル経路(構想先行) → ②以降 |
| 「新規アプリをゼロから」 | ①→②→③→④(→⑤⑥) フル |
| 「この画面のUI作って」 | ④ (必要なら⑤素材) |
| 「ログイン/DB入れて」 | ②設計の一部 + ⑥ firebase-backend |
| 「AIチャット機能つけて」 | ⑥ ai-feature (+ ⑦AI品質) |
| 「出すぞ、最終チェック」 | ⑧品質 → ⑨リリース |
| 「プレビューのコメント直して」 | ⑩ vercel-toolbar-loop |
| 「監視/手順書/設定診断したい」「引き継ぎ準備」 | ⑪運用(横断・単独でも可) |

## 原則

- 入口ステージと通す範囲を**最初に宣言**してから動く
- 各ステージは対応スキルに委譲。成果物 (`docs/` や実装) を確認してから次へ
- クイックビルド(パターンA)では最小ステージ (多くは④や⑥) に直行し、事後に通したステージを 1 行報告
- 構想先行(パターンB)では上記「構想先行フル経路」で①を通してから②以降へ
