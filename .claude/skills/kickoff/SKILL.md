---
name: kickoff
description: 作成・ビルド依頼の「司令塔(オーケストレータ)」。「アプリ作りたい」「◯◯作って」「プロト立ち上げたい」「何から作る」「画面作って」「機能追加して」「kickoff」「司令塔」「/start」などでトリガする。いきなり実装に走らず、入口で 2 パターンを選ぶ。パターンA「クイックビルド」は簡易設問(1〜3問)で最短で形にする(「とりあえず/すぐ/ラフ/PoC」合図 or /start --quick)。パターンB「構想先行」はまず①構想をフルに通す(idea-framing → user-research → target-definition → competitive-analysis → kpi-design → spec-writer)。その後プランを提示して承認を得て、体験フロー①構想〜⑩FB循環のどこを通すか宣言して各ステージスキル(app-flow-designer / shadcn-ui / ai-feature / firebase-backend / deploy-preflight ほか)へ受け渡す。作業は dev ブランチで行い、完了後に Vercel プレビュー URL を取得して出力する。単一コンポーネントの追加や単発の UI 修正は shadcn-ui 等の各スキルが直接対応し、複数ステップにわたる新規アプリ / 機能開発のみ kickoff が起動する。
---

# kickoff (司令塔)

## このスキルが解決すること

「◯◯作って」と言われて**いきなり実装に走る**と、要件のズレで後から全部やり直しになる。一方で毎回フル要件定義を強いると「とりあえず触りたい」スピード感を殺す。kickoff は依頼を受けたときの**入口の交通整理**を担い、

1. 要件の不足を**最小の質問**で埋め、
2. **プランを合意**してから、
3. 体験フロー①〜⑩の**どのステージを通すか宣言**して各スキルに受け渡し、
4. **dev ブランチで作業 → 完了後にプレビュー URL を出力**する

までを一貫したループにする。「とりあえず作りたい」用途には**確認を省く逃げ道**も用意する。

> このスキルは Marketplace 側の「厚い手順」。同じ既定動作はテンプレ(starter)の `AGENTS.md`「既定の作業フロー(司令塔)」にもポリシーとして書かれており、Codex / Antigravity はそちら(Marketplace 非参照)で同等に動く。

## 起動方法

- `/start` (明示。`--quick` で確認スキップ = パターンA直行)
- 「アプリ作りたい」「◯◯作って」「プロト立ち上げ」「画面作って」「機能追加して」「何から作る」(自律)

## 手順

### 0. パターン判定 (クイックビルド / 構想先行)

入口で 2 パターンのどちらで進めるかを決める。

- **パターンA: クイックビルド** — 簡易な設問でサクッと作る。依頼文に「**とりあえず / すぐ / ラフでいい / PoC / 仮で / ざっくり**」等の合図、または `/start --quick` のとき。→ 手順 1A → 4
- **パターンB: 構想先行** — まず構想をしっかり固めてから作る。「方向性から相談したい」「ピッチに出す」「新規事業」「じっくり詰めたい」等、または不確実性が大きい依頼。→ 手順 1B → 2 → 3

判断に迷うときは一言で確認する (「**サクッと形にしますか? それとも構想をしっかり固めてから作りますか?**」)。

### 1A. 要件確認 (パターンA: クイックビルド)

[references/question-bank.md](./references/question-bank.md) のコア質問から、依頼の粒度に応じて **最小限 (1〜3 問)** だけ投げる。
全部聞かない。既に依頼文で埋まっている項目は飛ばす。Naoya 3 原則 (相手のペース尊重 / 「私が」で意見を背負う / 形式句を避ける) に従う。→ 手順 4 で最短ビルド。

### 1B. 構想ディスカバリー (パターンB: 構想先行)

①構想をフルに通す。[references/flow-routing.md](./references/flow-routing.md) の「構想先行フル経路」を宣言してから、次の順で各スキルに受け渡し、各 `docs/` を確認しながら進む:

```
idea-framing → user-research → target-definition → competitive-analysis → kpi-design → spec-writer
```

「まず問いを立てる(idea-framing) → 調査/分析で深める(user-research → target-definition → competitive-analysis → kpi-design) → PRD化(spec-writer)」の流れ。依頼の段階で既に固まっている工程は飛ばしてよい (例: ターゲットが明確なら target-definition は確認のみ)。完了後、手順 2〜3 へ。

### 2. プラン提示 → 承認

- plan mode が使えるならプランを提示し、**承認を得てから着手**する
- プランには「**どのステージを通すか**」(手順 3) と「**dev ブランチ名**」「成果物(画面/ファイル)」を含める

### 3. フロー分岐 (どのステージを通すか宣言)

[references/flow-routing.md](./references/flow-routing.md) の対応表で、依頼に必要なステージと担当スキルを選び、**宣言してから**順に受け渡す。

```
①構想 → ②設計 → ③環境 → ④UI → ⑤素材 → ⑥コア機能 → ⑦AI品質 → ⑧品質 → ⑨リリース → ⑩FB循環
                                                                  (⑪運用 = 横断・任意)
```

- 毎回①から通さない。**入口ステージを依頼の粒度で選ぶ** (例: 「ログイン追加」→ ②設計の一部 + ⑥ firebase-backend)
- **⑪運用** (settings-doctor / docs-runbook / observability-setup) は線形フローではなく**横断・任意**。依頼が運用寄り (監視・手順書・設定診断) のとき、またはリリース後の引き継ぎで通す
- 各ステージは対応スキルに委譲し、成果物 (docs/ や実装) を確認しながら次へ

### 4. クイックビルド (パターンA の本体)

確認を省いて最短で作る。ただし**プランは 1〜2 行だけ**提示してから着手する (完全に無言で作らない)。
通したステージは事後に 1 行で報告する。途中で構想を固め直したくなったらパターンBに切り替えてよい。

### 5. ブランチ作業 → PR → プレビュー URL 出力

- ブランチ: git を制御できる場面 (CLI/ローカル/VS Code) は**既定で単一 `dev`**。別案検証は `dev-<用途>` を提案してから。
  **Claude Web はセッションの `claude/<slug>` 自動ブランチで始まる**ので無理に切り替えず、そのまま作業してよい (`main` 直 push はしない)
- **push → Draft PR 作成 → PR からプレビュー URL を取得して必ず出力**する。手順は [references/preview-url.md](./references/preview-url.md)
  (既定は `gh pr create --draft` → `gh pr view`。`.vercel/project.json` があれば MCP 直接経路も可。`vercel link` 等で入力が要る操作は利用者に依頼)

## 出力フォーマット

```
## パターン: クイックビルド / 構想先行
## 確認した要件: (箇条書き / クイックビルド時は省略可)
## 通すステージ: ②設計 → ④UI → ⑥コア機能 (など、宣言。構想先行なら①構想フル経路から)
## 作業ブランチ: dev (or dev-<用途>)
## 成果物: app/..., components/... (構想先行は docs/discovery/* も)
## プレビュー: https://<project>-<hash>-<scope>.vercel.app
```

## 周辺 Plugin

- ①構想ディスカバリー (構想先行で通す): `idea-framing` `user-research` `target-definition` `competitive-analysis` `kpi-design` `spec-writer`
- 各ステージの実体: `app-flow-designer` `screen-spec` `data-modeler` `api-contract` `shadcn-ui` `image-gen` `mockdata-ja` `format-ja` `ai-feature` `firebase-backend` `ai-eval` `ai-safety-check` `design-review` `pitch-review` `privacy-check` `deploy-preflight` `smoke-test` `vercel-toolbar-loop`
- 全体像: [docs/comparison/experience-flow.md](../_docs/comparison/experience-flow.md)
- リリース前チェック: `deploy-preflight` (`/deploy-check`)
