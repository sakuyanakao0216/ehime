# AGENTS.md

このファイルは Codex / Antigravity / その他エージェントの作業ガイドライン。
セッション開始時に必ず参照される。**ハウスルールの正本はこの `AGENTS.md`**。
`CLAUDE.md` は `@AGENTS.md` を取り込むだけの import スタブなので、**編集はこの `AGENTS.md` 側に行う**
(CLAUDE.md には内容を書かない)。手動同期は不要。

## プロジェクト概要

- **案件名**: (このテンプレからコピーした際にプロジェクト名に書き換える)
- **テンプレ元**: `vercel-aiagent-coding-skill-starter`
- **参照 Marketplace**: `vercel-aiagent-coding-skill` (`.claude/settings.json` で参照済)
- **性質**: エンタープライズプロト (クライアントピッチ前提)
- **対応サーフェス**: Claude Code (App / Web / CLI / VS Code 拡張) / Codex (App / Web / CLI / VS Code 拡張) / Antigravity (将来)
- **ドキュメント**: アプリ説明は `README.md` / テンプレの使い方 (クイックスタート・プラグイン一覧・env) は `docs/STARTER.md` / ハウスルールは本ファイル

## このテンプレの使い分け (サーフェス別)

| 利用シーン | 主に使うサーフェス | やること |
|---|---|---|
| **簡単修正**: Toolbar コメント → 自動回収 | **Claude Web** (Auto-fix が動く唯一のサーフェス) | Draft PR を作って CIモニタリング ON にしておく |
| **簡単修正**: チャットで「ここ直して」 | **Claude / Codex の App / Web** | スマホ・出先からでも OK。修正後は commit & push まで指示 |
| **詳細修正**: マルチファイル / リファクタ | **VS Code 拡張** (Claude or Codex) または **Antigravity** | 差分プレビュー・breakpoint と並行で AI に依頼 |
| **自動化 / CI** | **CLI** (Claude or Codex) | GitHub Actions / cron から `claude --print` / `codex exec` |
| **トラブル**: 設定 / MCP / Plugin が動かない | どのサーフェスでも `/doctor` (`settings-doctor`) | CLI が最速、Web も可 |

> Auto-fix が動くのは Claude Web だけ、というのが運用設計の最重要ポイント。他サーフェスは「人が起動する手動 loop」になる。詳細は Marketplace の [docs/comparison/surfaces.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/comparison/surfaces.md) を参照。

## 技術スタック

- Next.js 16 App Router (TypeScript strict)
- Tailwind CSS v4 (`@import 'tailwindcss'` 方式)
- shadcn/ui (style: `new-york` / baseColor: `neutral` / RSC: `true`)
- pnpm (corepack 経由)
- Vercel デプロイ前提

## デザイントークン規約

- カラー定義は `app/globals.css` の `:root` と `.dark` に集約
- `@theme inline` ブロックで Tailwind ユーティリティに橋渡し
- **ハードコードした hex 値は本文では使わない** (CSS 変数経由のみ)
- クライアントカラーは `--primary`, `--secondary`, `--accent` で表現
- 8px グリッドベース (`gap-2 / 4 / 6 / 8 / 12 / 16` を基本)

## ディレクトリ規約

> このテンプレは**最小スケルトン**。下記の多くは初期状態には無く、各プラグインが必要時に生成する。

- `lib/utils.ts` → `cn()` ヘルパーのみ（日付/数値/通貨フォーマットは `format-ja` が `lib/format.ts` を生成）
- `lib/ai.ts` → AI モデル client（土台・同梱）。Vercel AI Gateway の言語モデルを `AI_MODEL` から解決（既定 `google/gemini-2.5-flash`）。チャット/エージェント等の route・hook は `ai-feature` がこれを土台に拡張。画像生成は別モデルで `image-gen` 担当
- `lib/ai-usage.ts` → AI 利用量の記録（土台・同梱）。AI 呼び出しのたびに `logAiUsage` で `type:'ai_usage'` の構造化 JSON を出力。Vercel Logs で `ai_usage` を検索すると機能別・モデル別の利用量が見える（請求額は AI Gateway → Observability）。配線は `ai-feature` が行う
- `components/ui/` → shadcn コンポーネント。初期は**無い**。`shadcn-ui` が必要時に `add`（**直接編集しない**、再生成想定）
- `components/` 直下 → 案件固有コンポーネント / `components/blocks/` → ページレベルのブロック
- `lib/mock/` → モックデータ。初期は**無い**。`mockdata-ja` が必要時に生成（faker ja）
- `public/images/` → 画像アセット。アイコンは `lucide`（生成不要）、静的画像は `image-gen` のキーレス手順で配置

### 使い捨てプレースホルダ vs 土台

初回ビルドで**置き換える前提の使い捨て**と、**残す土台**を区別する。使い捨ては**退避(バックアップ)せず直接書き換え/削除してよい**（退避ファイルや未使用ルートグループを残さない）。

- **使い捨て**（直接置換・削除可）: `app/page.tsx`（動作確認用の最小ランディング） / `README.md`（アプリ説明スタブ。中身を案件の説明に書き換える）
- **土台**（残して拡張）: `app/layout.tsx` / `app/globals.css`（デザイントークン） / `app/error.tsx`・`app/not-found.tsx`（最小エラー画面。文言は案件に合わせ拡張） / `app/icon.svg`（仮 favicon。案件カラー決定後に差し替え） / `lib/utils.ts` / `lib/env.ts` / `lib/ai.ts`（AI モデル client） / `lib/ai-usage.ts`（AI 利用量ログ） / 各設定（`next.config.mjs` / `tsconfig.json` / `biome.json` / `.claude/` / `.github/`（CI・PR テンプレ・Dependabot）） / `AGENTS.md` / `docs/STARTER.md`

## プロト前提の割り切り

- `next.config.mjs`: `typescript.ignoreBuildErrors: true` (プロト中は OK)
- `images.unoptimized: true` (外部画像 URL を使う)
- 本番リリース時はこれらを必ず見直す

## 利用可能な Plugin

`.claude/settings.json` で `vercel-aiagent-coding-skill` Marketplace を参照し、**全 38 プラグインを有効化済み**。アプリ開発の体験フロー①構想〜⑪運用に対応 (司令塔 `kickoff` が入口で全体を束ねる):

| ステージ | プラグイン |
|---|---|
| ⓪ 司令塔 | **kickoff** (入口で2パターン選択 A:クイックビルド=最短 / B:構想先行=①構想をフル→プラン→①〜⑪へ受け渡し→dev+プレビュー URL。`/start`) |
| ① 構想 | idea-framing / user-research / target-definition / competitive-analysis / kpi-design / spec-writer |
| ② 設計 | app-flow-designer / screen-spec / data-modeler / api-contract |
| ③ 環境 | project-bootstrap / project-scaffold |
| ④ UI構築 | shadcn-ui |
| ⑤ 素材 | image-gen / mockdata-ja / format-ja |
| ⑥ コア機能 | ai-feature / firebase-backend |
| ⑦ AI品質 | ai-eval / ai-safety-check |
| ⑧ 品質 | design-review / pitch-review / privacy-check / perf-check |
| ⑨ リリース | deploy-preflight / smoke-test / seo-meta |
| ⑩ FB循環 | vercel-toolbar-loop / vscode-autofix-loop / feedback-triage / analytics-events / experiment-plan |
| ⑪ 運用 | settings-doctor / docs-runbook / observability-setup / db-migration / cost-guard |

一覧と入出力例は marketplace の [README](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/README.md) / [docs/examples.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/examples.md) / [experience-flow.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/comparison/experience-flow.md) を参照。例: `/doctor`（設定検証）, `/project-init`（雛形展開）, `/spec`（仕様化）, `/ship` or `/deploy-check`（出荷前チェック）。

## 鍵 / 素材 / 他エージェント

- **API キー**: `.claude/settings.json` には書かない。エージェント認証は OAuth ログイン。ランタイム鍵（`ai-feature` / `firebase-backend` 等）は Vercel env / `gh secret set` に置く。命名は marketplace [docs/conventions/env-naming.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/conventions/env-naming.md)（秘密情報は `NEXT_PUBLIC_*` に置かない）。
- **画像・アイコン**: キーレス優先。アイコンは `lucide`（生成不要）、静的画像はログイン済み ChatGPT/Gemini アプリで生成 → `public/images/` に配置。自動生成したいときだけ API。
- **Codex / Antigravity**: marketplace を直接参照できない（`.claude/settings.json` の marketplace 参照は Claude Code 専用）。多くは **Claude が `docs/` に残した成果物（PRD・設計）を読んで続行**で十分。スキルそのものを使いたいときは adapter でローカル生成（Codex は `.codex/`、Antigravity は `.agents/`／CLI は `.agent/` に出力。いずれも gitignore 済・**非コミット**）。**具体手順は Codex → [docs/CODEX.md](docs/CODEX.md) / Antigravity → [docs/ANTIGRAVITY.md](docs/ANTIGRAVITY.md) を参照**（いずれもこのリポジトリ内だけで完結。GitHub を取りに行かなくてよい）。背景は marketplace [README「他のエージェントでも使う」](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/README.md)。

### AI Gateway 認証（基本 OIDC）

認証は **基本 OIDC（方式B）**。ただし**経路で要否が違う**ので混同しない（実装ミス防止）:

| 経路 | やること | `@vercel/oidc` / `getVercelOidcToken()` |
|---|---|---|
| **AI SDK 経由（本テンプレ `lib/ai.ts` = `@ai-sdk/gateway`）** | Vercel デプロイ=**自動** / ローカル=`vercel link` → `vercel env pull`（`VERCEL_OIDC_TOKEN` は12hで失効→再 pull）。コードは `generateText/streamText({ model, providerOptions, prompt })` のまま | **不要（自動）** |
| Gateway を REST 直叩き / GCP・AWS へ OIDC フェデレーション | `getVercelOidcToken()` で取得（env か runtime ヘッダーを自動吸収。**ヘッダー名を当て推量しない**） | **必要** |
| ローカル / 外部 CI のフォールバック | `AI_GATEWAY_API_KEY`（方式A） | — |

- **禁止**: AI SDK を使う route に `@vercel/oidc` / `getVercelOidcToken()` を足す（過剰・誤り。AI SDK なら無改造で自動）
- **BYOK の注意**: BYOK 登録だけでは**ルーティングは変わらない**（資格情報の登録であって指示ではない。既定だと Google AI Studio 等が選ばれがち）。特定プロバイダに固定するときだけ `AI_PROVIDER_ONLY`（例 `vertex`。未登録プロバイダを指定すると失敗）。通った provider の確認は AI Gateway → Observability。詳細は marketplace [ai-gateway-byok-routing.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/runbooks/ai-gateway-byok-routing.md)

## デプロイ

- Vercel 自動デプロイ (GitHub 連携想定)
- PR ごとにプレビュー URL 自動発行
- 本番ブランチ: `main`
- リージョン: `hnd1` (東京)

## 既定の作業フロー (司令塔)

「◯◯作って」「アプリ作りたい」などの**作成・ビルド依頼**を受けたときの既定動作。
全エージェント (Claude / Codex / Antigravity) 共通のポリシー。**このまま素の依頼でも効く。**

### 1. いきなり作らない — 要件確認 → プラン → 着手

1. **即コードに行かない。** まず不足している要件を **3〜5 問**で確認する (`idea-framing` 相当: 誰が・何を・なぜ・成功条件・スコープ)
2. plan mode が使えるなら**プランを提示し、承認を得てから着手**する
3. 下記**体験フロー①〜⑩のどこを通すか宣言**してから進む。各ステージは対応スキルに受け渡す

```
①構想(idea-framing/user-research/target-definition/competitive-analysis/kpi-design/spec-writer) → ②設計(app-flow-designer/screen-spec/data-modeler/api-contract)
→ ③環境(project-bootstrap/scaffold) → ④UI(shadcn-ui) → ⑤素材(image-gen/mockdata-ja/format-ja)
→ ⑥コア機能(ai-feature/firebase-backend) → ⑦AI品質(ai-eval/ai-safety-check)
→ ⑧品質(design-review/pitch-review/privacy-check/perf-check) → ⑨リリース(deploy-preflight/smoke-test/seo-meta)
→ ⑩FB循環(vercel-toolbar-loop ほか)
   (⑪運用 = settings-doctor/docs-runbook/observability-setup/db-migration/cost-guard は横断・任意)
```

> 毎回①から通す必要はない。依頼の粒度に合わせて**入口ステージを選ぶ** (例: 「ログイン追加」なら②設計の一部 + ⑥コア機能から)。通すステージを宣言してから動く。**⑪運用**は線形フローではなく横断・任意 — 運用寄りの依頼(監視・手順書・設定診断)やリリース後の引き継ぎ時に通す。

### 2. 即作りエスケープ — 「とりあえず作りたい」も許容

「**とりあえず / すぐ / ラフでいい / PoC / 仮で**」等の合図があれば、上記の確認を**省いて最短で作る**。
その場合もプランは **1〜2 行だけ**提示してから着手する (完全に無言で作らない)。

### 3. ブランチで作業 → PR → 完了後にプレビュー URL を出力

**ブランチ**:
- git を自分で制御できる場面 (CLI / ローカル / VS Code) は**既定で単一 `dev`** を使う (`main` には直接 push しない)。
  既存の `dev` を温存して別案を試す兆候 (A/B・大改修・実験) があれば `dev-<用途>` を**提案してから**切る
- **Claude Web/クラウドはセッションが `claude/<slug>` 自動ブランチで始まる** — これはプラットフォーム側の挙動で、
  無理に `dev` へ切り替えない。**そのセッションブランチのまま**作業してよい

**プレビュー URL (push → PR → 発行 → 出力)**:
1. 作業ブランチを push する (`main` 以外)
2. **Draft PR を作成する** (`gh pr create --draft`)。Vercel の GitHub 連携がそのブランチのプレビューを自動ビルドし、PR に URL を貼る
3. URL を取得して**必ず出力**する:
   - 既定: `gh pr view --json statusCheckRollup` (Vercel の `targetUrl`) / `gh pr checks`
   - `.vercel/project.json` があれば Vercel MCP (`list_deployments` → `get_deployment`) も使える
4. ビルド中なら state を伝え、READY になってから URL を提示

> `.vercel/project.json` は `vercel link` 実行時だけ生成され **gitignore 済**。MCP 直接経路を使いたい場合のみ
> `vercel link` を案内する。**ログインやプロジェクト選択など入力が要る操作は、勝手に進めず利用者に入力を依頼する。**

### 4. 詳細手順 (Claude のみ)

Claude は Marketplace の **`kickoff` スキル / `/start` コマンド**で上記を厚い手順 (質問バンク・フロー分岐) として実行する。
Marketplace を参照できない Codex / Antigravity は**本節のポリシーに従う** (それで最低限成立する)。

## 修正時のステアリング運用

機能追加・修正に着手するとき、**作業コンテキストと確定事項を `.steering/` に残す**(積み上げて参照可能にする)。

1. **タスクコンテキストを確立**: 機能名 + 日付 (`YYYYMMDD`) を決める
2. **ステアリングディレクトリを作成**: `.steering/[日付]-[機能名]/` (例: `.steering/20260610-login/`)
3. **md をぶら下げる**(必要に応じ分割)。確定事項・重要事項をまとめていく:
   - `requirements.md` — 要求事項
   - `design.md` — 設計内容
   - `tasklist.md` — 実装内容詳細
   - `infla.md` — GCP など インフラの設定詳細 (秘密値は書かない。env / Secrets で管理)
   - 必要に応じ他の md を追加してよい
4. 実装後、**README など関連ドキュメントを更新**する (必要に応じて `docs/` を新規作成)

- `.steering/` は **git にコミット**する (確定事項としてチーム共有・履歴に残す)
- 各ファイルの雛形は [`.steering/_template/`](.steering/_template/) を参照 (この `_template` はコピーして使う見本。日付付き機能ディレクトリではない)

## Claude への依頼スタイル

- 日本語でやり取り、コード内コメントは日本語 OK
- UI 説明は「クライアントピッチで通る」レベルを目標に
- 仮説駆動で動く (背景・目的を先に確認)
- 不確実な情報を断定的に書かない、根拠を明示
- `console.log` をプロダクション流入させない (実装後は必ず削除)

## Naoya 3 原則

セッション内のコミュニケーション全般で意識する:

1. **相手のペース・尊厳を奪わない**
   - 性急に結論を求めない、相手が考えている間の沈黙を許容
   - 「正解 / 不正解」の二項対立で評価しない

2. **「私が」で意見を背負う**
   - 「一般的には」を多用しない
   - 主張するときは "私の見方では" と一人称で言い切る
   - ただし誘導はしない

3. **形式句を本音 × 具体性に置き換える**
   - 「ご検討」「ご確認」のような形式語を避ける
   - 具体的な行動・対象・期限に分解して問う / 提案する

## Hooks

`.claude/hooks/session-start.sh` でセッション開始時に `pnpm install` を自動実行。
remote 環境 (`CLAUDE_CODE_REMOTE=true`) でのみ動作。

## 禁止事項

- ハードコードしたシークレット (`.env*` で管理し、絶対に commit しない)
- 実在クライアントのロゴ・商標を未許諾で組み込む
- 個人情報を含むモックデータ (実在ドメイン、実在電話番号など)
- `components/ui/*` の直接編集 (shadcn の `add` で再生成する)
