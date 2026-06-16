# vercel-aiagent-coding-skill

**Vercel Toolbar コメント駆動で自動修正が回るマルチ IDE 向け Skill / Plugin Marketplace**。Claude Code / Codex / Antigravity (将来) 対応を見据えた独自実装。

## このリポジトリの位置付け

```
┌────────────────────────────────────────────────────────────┐
│ vercel-aiagent-coding-skill (この repo / Marketplace)      │
│   plugins/<name>/ を Claude フォーマットで実装             │
│   adapters/ で Codex / Antigravity 用に片方向変換          │
└────────────────────────────────────────────────────────────┘
                          ▲ extraKnownMarketplaces で参照
                          │
┌────────────────────────────────────────────────────────────┐
│ vercel-aiagent-coding-skill-starter (別 repo / Template)   │
│   コピペ起動 → push → Vercel で開発が始まる雛形             │
└────────────────────────────────────────────────────────────┘
```

## クイックスタート (利用側 / Claude Code)

`.claude/settings.json` に以下 1 ブロックを足すだけで Marketplace を参照できる（**ローカルの Claude Code (CLI / VS Code) はクローン不要・ビルド不要でそのまま使える**）:

```json
{
  "extraKnownMarketplaces": {
    "vercel-aiagent-coding-skill": {
      "source": {
        "source": "github",
        "repo": "dentsu-fde/vercel-aiagent-coding-skill"
      }
    }
  }
}
```

プラグインの有効化は `/plugin install`（`--scope project` で `.claude/settings.json` の `enabledPlugins` に書かれる）で管理する。**Web (claude.ai/code) は project スコープの `.claude/settings.json` だけを読む**（ユーザー設定 `~/.claude/...` は使えない）ので、**marketplace 参照とプラグイン有効化をプロジェクトの `.claude/settings.json` にコミット**しておくのが確実。完全な例は [examples/settings.json](./_examples/settings.json) を参照。

> Claude Code は **Web / VS Code 拡張 / CLI** いずれも**同じプロジェクトの `.claude/settings.json`** を読む（CLI / VS Code はユーザースコープや `/plugin` 対話でも有効化可、Web はプロジェクト settings のみ）。Toolbar コメント→**完全自動修正**が効くのは Web のみ。サーフェスの選び方は [docs/comparison/surfaces.md](./_docs/comparison/surfaces.md)。
>
> **⚠️ Web (claude.ai/code) を使う場合**: 上記の marketplace 参照は **ローカル CLI / VS Code でしか install されない**。Web では marketplace の clone がセッション初期化に間に合わず、初回セッションで plugin が無効になりがち（`/reload-plugins` も Web 無効）。Web で確実に使うには、**この Marketplace の skill を `.claude/skills/` へ焼き込んで (vendoring) commit する**:
>
> ```bash
> # 前提: この Marketplace を利用側に取得済み (submodule .marketplace/ か隣接 clone)。
> # 利用側に adapters/ は無いので、取得先のパスから叩く:
> node .marketplace/adapters/claude/build.mjs --out .claude/skills   # 全 plugin を .claude/skills/ へ生成 → commit
> # 隣接 clone なら: node ../vercel-aiagent-coding-skill/adapters/claude/build.mjs --out .claude/skills
> ```
>
> 詳細・仕組みは [adapters/claude/README.md](./_adapters/claude/README.md) を参照。

### API キーについて（重要）

`settings.json` に **API キーを書く必要はない**。鍵の要否は「いつ動くか」で決まる:

- **エージェント（Claude Code / Codex）の認証** … Web はログインセッション、CLI / VS Code は OAuth ログイン（`claude login`）or 環境変数。**設定ファイルに生キー不要**。
- **オーサリング時の外部操作**（Notion / Jira / Slack 連携、Vercel / GitHub 操作）… **OAuth MCP / CLI ログイン**で済む。鍵不要。
- **画像・アイコン素材** … キーレス優先。アイコンは `lucide`（生成不要）、静的画像はログイン済み ChatGPT/Gemini アプリで生成して `public/images/` に配置。**鍵不要**。
- **ランタイム（デプロイ後のアプリが自分で呼ぶサービス）** … AI機能(`ai-feature`)・DB/認証(`firebase-backend`)・計測・監視は **アプリの env に鍵が必要**（`settings.json` ではなく Vercel env / `gh secret set`）。

> **鍵が要る場合の設定場所**: 鍵は常に**利用側（この Marketplace をインポートしたプロジェクト）**で設定する。Marketplace 側は鍵を持たない。
> - 画像など**ビルド時生成**（`image-gen` のルート3/4）→ 利用側の**手元 env / CI** か **MCP 設定**。生成時のみ必要で、静的ファイルになるためデプロイ後アプリには残らない。
> - **ランタイム生成**（`ai-feature` 等）→ 利用側の**アプリ本番 env**（消えない）。
> - いずれも `.claude/settings.json` には書かない。

詳細・命名規約は [docs/conventions/env-naming.md](./_docs/conventions/env-naming.md)、サーフェス別は [docs/comparison/surfaces.md](./_docs/comparison/surfaces.md)。

## 他のサーフェス / エージェントで使う (Claude Web / Codex / Antigravity) — 任意

live な marketplace 参照（`extraKnownMarketplaces` + `enabledPlugins`）が効くのは **ローカル Claude Code (CLI / VS Code) だけ**。それ以外のサーフェス（**Claude Web** / Codex / Antigravity）は marketplace を直接参照できないため、skill を**焼き込む (vendoring)** か、docs ベースで引き継ぐ。

> **⚠️ Claude Web は「コミットする vendoring」で他と逆**: Claude Web は **Claude ネイティブ形式のまま** `.claude/skills/` へ焼き込み、**git にコミット**する（クラウドのセッション初期化に marketplace clone が間に合わないため。手順は上のクイックスタートの警告 / [adapters/claude/README.md](./_adapters/claude/README.md)）。下の方法2の Codex / Antigravity は逆に**コミットせずローカル生成**にしてソースを汚さない。

Claude フォーマット（`plugins/`）が正。Codex / Antigravity は marketplace を直接参照できないため、下の 2 通りで使う。**多くの場合は方法1で十分**。

### 方法1: docs ベースで続ける（最も手軽・推奨）

Claude Code が `docs/` に残した成果物（`spec-writer` の **PRD**・`data-modeler` の設計・`screen-spec` の画面仕様など）を、Codex / Antigravity が**読んで実装を続ける**。スキルのインストール不要・リポジトリも汚れない。チャットの文脈ではなく **docs が引き継ぎ媒体**になる。

```
Claude で開発 → docs/specs・docs/design に仕様/設計を出力
        ↓ 同じ git・同じ docs を開く
Codex / Antigravity が docs を読んで実装を継続（スキル不要）
```

### 方法2: スキルも使う（ローカル生成・**コミットしない**）

`/spec` 等のスキルを Codex / Antigravity でも使いたい場合だけ。adapter で変換するが、**生成物はコミットせずローカル生成**にしてソースを汚さない。

1. このリポジトリを **git submodule** などで取得（例 `.marketplace/`）
2. 利用側プロジェクトの `.gitignore` に生成物を追加:
   ```gitignore
   .codex/
   .antigravity/
   ```
3. `package.json` に生成スクリプトを置く（必要なスキルだけなら `--plugin <name>`）:
   ```json
   {
     "scripts": {
       "gen:codex": "node .marketplace/adapters/codex/build.mjs --out .codex/skills",
       "gen:antigravity": "node .marketplace/adapters/antigravity/build.mjs --out .antigravity/skills"
     }
   }
   ```
4. Codex / Antigravity を使う前に `pnpm gen:codex`（or `gen:antigravity`）。生成された `.codex/skills/` をそのエージェントが読む。**git には入らない**ので別 PJT のソースはきれいなまま。

> Codex は `.codex/`、Antigravity は `.antigravity/` を読む。いずれも**生成物（ビルド成果物）**であってソースではない。Antigravity 版は仕様確定前の暫定プロト（[adapters/antigravity](./_adapters/antigravity/README.md)）。変換の仕組みは [adapters/codex](./_adapters/codex/README.md) も参照。

## どのサーフェスで使うか — 簡単 / 詳細 / 自動化 の 3 軸

| 利用シーン | メイン | 補助 |
|---|---|---|
| **簡単修正** (チャット 1 往復 / Toolbar コメント 1 件) | Claude Code **App / Web**、Codex **App / Web** | スマホ / 出先 / 非開発者 |
| **詳細修正** (マルチファイル / リファクタ) | **VS Code 拡張** (Claude / Codex)、**Antigravity** | エディタ操作と並行で使いたいとき |
| **自動化 / バッチ** | Claude **CLI** / Codex **CLI** | CI / cron / shell script |

> **Vercel Toolbar コメント → 完全自動修正**が動くのは **Claude Web のみ**。他のサーフェスは「人が起動する手動 loop」になる。詳細マトリクスと選び方ガイドは [docs/comparison/surfaces.md](./_docs/comparison/surfaces.md) を参照。

## 含まれる Plugin (38 個) — アプリ開発の体験フロー順

Plugin はアプリ開発の体験フロー **①構想 → ⑪運用** に沿って並べている。各プラグインの**入出力例は [docs/examples.md](./_docs/examples.md)**、ステージの詳細と網羅性は [docs/comparison/experience-flow.md](./_docs/comparison/experience-flow.md)、バックエンドの選び方は [docs/comparison/backend-strategy.md](./_docs/comparison/backend-strategy.md)、環境変数の命名規約は [docs/conventions/env-naming.md](./_docs/conventions/env-naming.md) を参照。

```
⓪司令塔(kickoff) →①構想 →②設計 →③環境 →④UI →⑤素材 →⑥コア機能 →⑦AI品質 →⑧品質 →⑨リリース →⑩FB循環 →⑪運用
```

### ⓪ 司令塔 (オーケストレータ)
| 名前 | 用途 | トリガ |
|---|---|---|
| [`kickoff`](./kickoff/SKILL.md) | 作成依頼を即着手せず、入口で 2 パターン選択(A:クイックビルド=簡易設問で最短 / B:構想先行=①構想をフルに通す)→プラン→①〜⑪への受け渡し→dev 作業→プレビュー URL 出力を束ねる | `/start` |

### ① 構想
| 名前 | 用途 | トリガ |
|---|---|---|
| [`idea-framing`](./idea-framing/SKILL.md) | 「何を作るか」を 6 問で炙り出す構造的問題設定 (Naoya 3 原則ベース) | `/idea-framing` |
| [`user-research`](./user-research/SKILL.md) | ユーザー調査の計画・インタビュー設計・インサイト/JTBD 整理 (誘導しない問い) | `/user-research` |
| [`target-definition`](./target-definition/SKILL.md) | セグメント分け・優先選定・ペルソナ/アンチペルソナでターゲットを確定 | `/target` |
| [`competitive-analysis`](./competitive-analysis/SKILL.md) | 競合/代替の比較・ポジショニング・競争優位 (MOAT) を抽出 | `/competitor` |
| [`kpi-design`](./kpi-design/SKILL.md) | North Star / KPIツリー / ガードレール指標を設計 (計測・実験の上流) | `/kpi` |
| [`spec-writer`](./spec-writer/SKILL.md) | 構想を PRD / 要件 / 受入条件 / ストーリーマップに変換、外部ツール展開手順つき | `/spec` |

### ② 設計
| 名前 | 用途 | トリガ |
|---|---|---|
| [`app-flow-designer`](./app-flow-designer/SKILL.md) | ユーザー導線 / 画面一覧 / 状態遷移 / 主要ユースケース (Mermaid) | `/app-flow` |
| [`screen-spec`](./screen-spec/SKILL.md) | 各画面の目的 / 項目 / 操作 / バリデーションと全状態 (loading/empty/error/…) | `/screen-spec` |
| [`data-modeler`](./data-modeler/SKILL.md) | Firestore / RDB のデータ構造・型・ERD を設計 | `/data-model` |
| [`api-contract`](./api-contract/SKILL.md) | Route Handler / Server Action / 外部API の入出力(zod)・エラー・認証を設計 | `/api-contract` |

### ③ 環境 (動く土台)
| 名前 | 用途 | トリガ |
|---|---|---|
| [`project-bootstrap`](./project-bootstrap/SKILL.md) | テンプレ repo クローン + Vercel project + Secrets + 初回 PR を一気通貫 wizard | `/project-bootstrap` |
| [`project-scaffold`](./project-scaffold/SKILL.md) | Next.js 16 + Tailwind v4 + shadcn の標準スタック展開 | `/project-init` |

### ④ UI構築
| 名前 | 用途 | トリガ |
|---|---|---|
| [`shadcn-ui`](./shadcn-ui/SKILL.md) | shadcn コンポーネント / ブロック追加 (スマホ/タブレット/PC レスポンシブ前提) | 「ボタン作って」等で自律起動 |

### ⑤ 素材 (ピッチ用)
| 名前 | 用途 | トリガ |
|---|---|---|
| [`image-gen`](./image-gen/SKILL.md) | 画像・アイコン素材をキーレス優先で (アイコン=lucide / 静的=ログイン済みアプリ生成→配置 / 自動生成時のみ API) | 自律 |
| [`mockdata-ja`](./mockdata-ja/SKILL.md) | 日本ビジネス文脈に最適化したモックデータ (faker ja + 業界別) | 自律 |
| [`format-ja`](./format-ja/SKILL.md) | 日付 / 数値 / 通貨 / 相対時刻を Intl ベースで `lib/format.ts` に統一 | `/format-ja` |

### ⑥ コア機能 (アプリの中身)
| 名前 | 用途 | トリガ |
|---|---|---|
| [`ai-feature`](./ai-feature/SKILL.md) | Vercel AI SDK で AI 機能 (chat / agent / structured / RAG)。プロバイダ非依存 | `/ai-feature` |
| [`firebase-backend`](./firebase-backend/SKILL.md) | Firebase で DB / 認証 / Storage / Admin SDK / 認証設計、本格処理は GCP へ | `/firebase` `/auth-rules` |

> バックエンドの軽量処理は Next.js ネイティブ (Route Handler / Server Action) で賄う → [backend-strategy.md](./_docs/comparison/backend-strategy.md)

### ⑦ AI品質
| 名前 | 用途 | トリガ |
|---|---|---|
| [`ai-eval`](./ai-eval/SKILL.md) | AI出力の評価項目 / テストケース / 回帰評価 + プロンプト版管理 | `/ai-eval` |
| [`ai-safety-check`](./ai-safety-check/SKILL.md) | 不適切出力 / PII / ハルシネーション / 外部送信データ の点検 | `/ai-safety` |

### ⑧ 品質
| 名前 | 用途 | トリガ |
|---|---|---|
| [`design-review`](./design-review/SKILL.md) | UI/UX デザイン品質を 8 軸チェック (WCAG / 余白 / タイポ / スマホ・タブレット・PC 実機) | `/design-review` |
| [`pitch-review`](./pitch-review/SKILL.md) | CMO / CTO / Creative Director の 3 役視点でピッチ前レビュー | `/pitch-review` |
| [`privacy-check`](./privacy-check/SKILL.md) | PII / ログ / 外部送信 / 保存期間 / 削除方針 の点検 | `/privacy-check` |
| [`perf-check`](./perf-check/SKILL.md) | Core Web Vitals (LCP/CLS/INP) を Lighthouse で計測し next/image / font / bundle の定石で改善 | `/perf-check` |

### ⑨ リリース
| 名前 | 用途 | トリガ |
|---|---|---|
| [`deploy-preflight`](./deploy-preflight/SKILL.md) | デプロイ前プレフライト 10 項目 (typecheck / lint / build / secret / console / smoke / 公開範囲 / etc) | `/deploy-check` (旧 `/ship`) |
| [`smoke-test`](./smoke-test/SKILL.md) | Playwright スモーク (mobile/tablet/desktop) + Vitest ユニット。preflight に統合 | `/smoke-test` |
| [`seo-meta`](./seo-meta/SKILL.md) | Metadata API で title / OGP / Twitter Card / sitemap / robots / JSON-LD を整備し「URL 共有時の見栄え」を最適化 | `/seo-meta` |

### ⑩ フィードバック循環
| 名前 | 用途 | トリガ |
|---|---|---|
| [`vercel-toolbar-loop`](./vercel-toolbar-loop/SKILL.md) | Toolbar コメント → 該当箇所修正 → commit/push → resolve のループ | `/toolbar-pull` |
| [`vscode-autofix-loop`](./vscode-autofix-loop/SKILL.md) | Web 限定の Auto-fix を VS Code / CLI でも擬似再現する**設計提案ドキュメント** | (設計参照) |
| [`feedback-triage`](./feedback-triage/SKILL.md) | ユーザーFBを バグ / 改善 / 要望 / 仕様確認 に分類し優先度付け | `/feedback-triage` |
| [`analytics-events`](./analytics-events/SKILL.md) | GA4 / PostHog / Firebase Analytics のイベント設計・計測ポイント | `/analytics-events` |
| [`experiment-plan`](./experiment-plan/SKILL.md) | A/Bテスト・仮説・成功指標・判定基準を設計 | `/experiment` |

### ⑪ 運用 / 診断
| 名前 | 用途 | トリガ |
|---|---|---|
| [`settings-doctor`](./settings-doctor/SKILL.md) | `.claude/settings.json` の失敗 6 パターン検出 + 修正案 | `/doctor` |
| [`docs-runbook`](./docs-runbook/SKILL.md) | Git flow / Deploy / Rollback / Secrets / Troubleshooting 雛形生成 | `/docs-runbook` |
| [`observability-setup`](./observability-setup/SKILL.md) | エラーログ / 監視項目を設計 + Sentry / Vercel Logs / Crashlytics 導入 | `/observability` |
| [`db-migration`](./db-migration/SKILL.md) | Firestore スキーマ変更の段階移行 (互換読み取り→デュアルライト→バックフィル→掃除) とロールバック設計 | `/db-migration` |
| [`cost-guard`](./cost-guard/SKILL.md) | AI Gateway / Vercel / Firebase の課金見積と支出上限・予算アラート設定で課金事故を防ぐ | `/cost-guard` |

> **v0.2 リネーム**: `office-hours → idea-framing` / `shadcn-helper → shadcn-ui` / `ship → deploy-preflight` (`/ship` は別名として維持)。マーケットプレイス参照側は `enabledPlugins` の更新が必要。
> **v0.3**: ②設計・⑦AI品質ステージを新設し、仕様化 / 設計 / AI品質 / プライバシー / 計測 / 監視 の 12 スキルを追加（17→29）。その後 ⓪司令塔 `kickoff` を追加（→30）。
> **v0.4**: `perf-check`(⑧) / `seo-meta`(⑨) / `db-migration`(⑪) / `cost-guard`(⑪) の 4 スキルを追加（30→34）。`settings-doctor` の検出を 3→6 パターンに拡充、`deploy-preflight` に push ガード hook を追加、`idea-framing` / `design-review` / `pitch-review` に明示コマンドを追加。
> **v0.5**: ①構想にディスカバリー層 `user-research`(`/user-research`) / `target-definition`(`/target`) / `competitive-analysis`(`/competitor`) / `kpi-design`(`/kpi`) を新設（34→38）。`kickoff` を「クイックビルド / 構想先行」2パターンに再構成し、構想先行では①構想をフル経路で通す。marketplace 本体 version を 0.5.0 に更新。

今後の追加と背景は [docs/ARCHITECTURE.md](./_docs/ARCHITECTURE.md) を参照。

## ディレクトリ構成

```
.claude-plugin/marketplace.json   Marketplace 定義 (単一ソース)
plugins/<name>/                   各 Plugin (Claude フォーマットを正とする)
  ├── .claude-plugin/plugin.json
  ├── skills/<name>/SKILL.md
  ├── commands/<cmd>.md
  ├── scripts/                    Plugin 内部スクリプト (Node builtin のみ)
  └── references/                 Skill が参照するドキュメント
adapters/codex/                   SKILL.md → Codex Skills 変換 (最小プロト実装済み)
adapters/antigravity/             SKILL.md → Antigravity 変換 (暫定プロト実装済み)
docs/                             マニュアル / ランブック / 比較表 / 規約 (conventions)
examples/settings.json            利用者向け .claude/settings.json サンプル
```

## 開発

```bash
# マーケットプレイス整合性チェック (JSON / 名前一致 / カウント / リンク健全性)
# CI (.github/workflows/validate.yml) でも push/PR ごとに自動実行される
node scripts/validate.mjs

# アダプタ build smoke (リンク変換・vendoring・stale 掃除の退行検知)
node adapters/codex/build.mjs --out /tmp/codex-out
node adapters/antigravity/build.mjs --out /tmp/ag-out
node adapters/claude/build.mjs --out /tmp/claude-out

# Plugin の検査スクリプトをローカルで叩いて挙動確認
node plugins/settings-doctor/scripts/check.mjs <path-to-settings.json>

# 既存 fixture でテスト (6 失敗パターン全部検出されることを確認)
node plugins/settings-doctor/scripts/check.mjs plugins/settings-doctor/__fixtures__/broken.json
```

## 関連リポジトリ

- [`vercel-aiagent-coding-skill-starter`](https://github.com/dentsu-fde/vercel-aiagent-coding-skill-starter) — この Marketplace を参照するコピペ起動テンプレ
