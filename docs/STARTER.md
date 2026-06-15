# スターター利用ガイド (vercel-aiagent-coding-skill-starter)

> このファイルは**テンプレの使い方ガイド**。アプリの README ではない。コピー先のプロジェクトでは
> [`README.md`](../README.md) をアプリ説明に書き換え、本ガイドは参照用に残すか削除してよい。
> ハウスルール (規約・司令塔・禁止事項) は [`AGENTS.md`](../AGENTS.md)。

**コピペ起動できる最小スターター**。デモ画面や UI は同梱せず、**必要最低限の設定ファイル＋空に近いランディング**だけ。`vercel-aiagent-coding-skill` Marketplace を参照済みで、Claude Code から 38 プラグイン（司令塔 `kickoff` + 体験フロー①構想〜⑪運用）がすぐ使える。UI・スキルが生成するファイルは**必要時に追加**する前提。

## 同梱（最小）

- Next.js 16 App Router (TypeScript strict) / Tailwind CSS v4 (`@import 'tailwindcss'`)
- 依存は最小限: `next` / `react` / `tailwind` / `cn()` 用の `clsx` + `tailwind-merge`、AI 土台の `ai` + `@ai-sdk/gateway`、計測の `@vercel/analytics` + `@vercel/speed-insights`（Radix・recharts・faker 等は shadcn-ui / 各プラグインが必要時に追加）
- `app/`（`layout.tsx` / `page.tsx` 最小ランディング / `globals.css` テーマトークン / `error.tsx`・`not-found.tsx` 最小エラー画面 / `icon.svg` 仮 favicon）, `lib/utils.ts`（`cn()`）, `lib/ai.ts`（AI モデル client 土台 — AI Gateway 経由・`AI_MODEL` で切替）
- `.env.example`（環境変数の雛形・コミット対象） / `lib/env.ts`（型安全な env アクセサ）— 詳細は[環境変数 / API キー](#環境変数--api-キー)
- `.claude/settings.json` — Marketplace 参照 + **38 プラグイン有効化済**
- `.mcp.json` — Vercel / GitHub MCP（`${GITHUB_TOKEN}` placeholder）
- `.github/` — CI（biome check / typecheck / build。`ignoreBuildErrors` の防波堤）・PR テンプレート・Dependabot（依存更新 PR を自動作成。ノイズなら weekly → monthly に）
- 計測（キーレス）: `@vercel/analytics` + `@vercel/speed-insights` を layout に配置済み。**アプリ画面には何も出ない** — Vercel ダッシュボード → プロジェクト → **Analytics / Speed Insights タブで Enable を 1 回押す**と、ページビュー・流入元・Core Web Vitals が見られる
- `CLAUDE.md` + `AGENTS.md` — ハウスルール（`CLAUDE.md` は `@AGENTS.md` import スタブ）

## 共通セットアップ — まず自分の repo にコピーする（唯一の必須）

> ⚠️ **このリポジトリは「フォーマット（テンプレ）」。直接編集して使うものではない。** 案件ごとに **自分の repo にコピーしてから**、そのコピー側で作業する。以降のクイックスタート（A/B/C）は**すべてコピーした repo に対して**行う（このテンプレ本体には push しない）。

CLI が使えるなら:

```bash
gh repo create my-prototype --template FDE-project/vercel-aiagent-coding-skill-starter --clone --private
```

**CLI が無くても画面だけで完結できる。** GitHub のテンプレ repo を開き **「Use this template」→「Create a new repository」**。`gh` / `vercel` / `pnpm` をローカルに入れなくても、以降は各サーフェスの画面（claude.ai/code・Vercel・GitHub ダッシュボード）で操作できる。

> 必須はここまで。ローカル起動（`pnpm install` / `pnpm dev`）・Vercel デプロイ・Secrets 登録は、それを必要とするサーフェスの節（下記）に含めた。共通で先回りして用意する必要はない。

## クイックスタート（サーフェス別）

サーフェスごとに得意分野が違う（`AGENTS.md` の使い分け表と対応）。**簡単修正・出先なら A**、**マルチファイル・リファクタなら B**、**自動化・CI なら C**。いずれも対象は**上でコピーした自分の repo**（テンプレ本体ではない）。

### A. Claude Web — 簡単修正 / 出先 / Auto-fix

Toolbar コメント駆動の **Auto-fix が動く唯一のサーフェス**。ローカル環境は不要、スマホ・出先からでも回せる。

1. [claude.ai/code](https://claude.ai/code) で **GitHub と連携**する — 初回は「Connect GitHub」から GitHub にサインインし、**Claude GitHub App をインストール**する（PAT 登録は不要）
2. App インストール時の **Repository access で、コピーした自分の repo へのアクセスを許可**する（`All repositories` か、`Only select repositories` で対象 repo を選択）。あとから追加する場合は GitHub の **Settings → Applications → Claude → Repository access** で許可を増やす
   > repo が claude.ai/code の一覧に出てこないときは、ほぼこの Repository access 未許可が原因（組織 repo は組織オーナーの承認が要ることもある）
3. claude.ai の **Connectors で Vercel を接続**（または `/mcp` で `vercel` を Authenticate）。Toolbar コメントを Claude が読む/解決するのに必要（GitHub 連携だけだと「未解決あり」は分かるが本文は読めない）
4. Vercel ダッシュボードで repo を Import → **Project Settings → Toolbar → Pre-Production Deployments を Enabled**
5. `main` 以外の作業 branch を push → **Draft PR** を作る（CI モニタリングを ON に）
6. プレビュー URL の Vercel Toolbar にコメント → Claude Web が回収して修正を push

> Auto-fix の CI 検知ワークフロー（`vscode-autofix-loop` 由来）は GitHub Actions 組込の `GITHUB_TOKEN` で動くので、自前の PAT 登録は不要。PAT が要るのは CLI/ローカルの Claude に **GitHub MCP** で操作させたい場合だけ（→ [環境変数 / API キー](#環境変数--api-キー)）。発火条件・切り分けは marketplace [auto-fix-conditions.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/runbooks/auto-fix-conditions.md)。

> チャットで「ここ直して」と頼んで commit & push まで指示する使い方もこの A。

### B. VS Code 拡張 — 詳細修正 / マルチファイル

差分プレビュー・breakpoint と並行で依頼できる。リファクタや複数ファイル横断向き。

1. **コピーした自分の repo** を clone して `code .`
2. VS Code 拡張「Claude Code」を入れてサインイン
3. `pnpm install` → `pnpm dev`（→ localhost:3000）
4. サイドパネルから依頼（例:「ダッシュボード組んで」）。差分を見ながら適用

> ローカルでは session-start hook は走らない（`CLAUDE_CODE_REMOTE=true` のときだけ自動 install）。初回は手動で `pnpm install`。

### C. CLI — 自動化 / CI / cron

headless 実行で GitHub Actions・cron から回す用途。

```bash
npm install -g @anthropic-ai/claude-code
claude            # コピーした repo 直下で起動 → 初回サインイン
/doctor           # 設定 / MCP / Plugin の検証

# 対話せず回す（CI / cron）
claude -p "出荷前チェックして"
```

> プレビューデプロイを CLI から打つなら `vercel link` → `vercel`（`main` push 時は git 連携で自動デプロイされるので必須ではない）。
> Codex CLI なら `AGENTS.md` をそのまま読む（`codex exec "..."`）。詳細は下記「他のエージェント」。

## よく使う入力（全サーフェス共通）

| やりたいこと | 入力 |
|---|---|
| **何か作りたい（迷ったらここ）** | `/start`（司令塔。要件確認→プラン→フロー→dev+プレビュー URL。最短なら `/start --quick`） |
| 何を作るか整理 → 仕様化 | `/idea-framing` → `/spec` |
| 構想を深掘り（任意） | `/user-research` / `/target` / `/competitor` / `/kpi` |
| Next.js 雛形を展開 | `/project-init` |
| UI を組む（shadcn・レスポンシブ） | 「ダッシュボード組んで」等 |
| AI機能 / DB・認証 | `/ai-feature` / `/firebase` |
| 出荷前チェック | `/deploy-check`（旧 `/ship`） |
| 設定トラブル | `/doctor` |

全 38 プラグインと入出力例は Marketplace の
[README](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/README.md) /
[docs/examples.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/examples.md) /
[experience-flow.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/comparison/experience-flow.md) を参照。

> 補足: 機能追加・修正に着手するときは `.steering/[日付]-[機能名]/` に要件・設計・タスクを残す（積み上げて参照可能に）。
> 運用ルールは [AGENTS.md「修正時のステアリング運用」](../AGENTS.md)、雛形は [`.steering/_template/`](../.steering/_template/)。

## 他のエージェント（Codex / Antigravity）— 任意

marketplace は Claude 専用参照。Codex / Antigravity は **Claude が `docs/` に残した成果物（PRD・設計）を読んで続行**するのが最も手軽。

### スキルそのものを使いたいとき — 「スキルを生成して」と言うだけ

Codex / Antigravity にスキル本体を使わせたい場合、**エージェントに「スキルを生成して」と頼めばよい**。adapter がマーケットプレイスの `SKILL.md` を各エージェント形式に変換し、所定のディレクトリへ書き出す。

| エージェント | 生成先 | 1 行で実行するなら |
|---|---|---|
| **Codex** | `.codex/skills/` | `node ../vercel-aiagent-coding-skill/adapters/codex/build.mjs --out .codex/skills/` |
| **Antigravity** | `.agents/skills/`（CLI は `.agent/skills/`） | `node ../vercel-aiagent-coding-skill/adapters/antigravity/build.mjs` |

- 生成物（`.codex/` `.agents/` `.agent/`）は `.gitignore` 済・**非コミット**。各自ローカルで生成し、マーケットプレイス更新時は再実行するだけ
- マーケットプレイス本体（`vercel-aiagent-coding-skill`）が**このリポジトリの隣**に clone されている前提。無ければ clone してから実行
- 手順の詳細: Codex → [docs/CODEX.md](CODEX.md) / Antigravity → [docs/ANTIGRAVITY.md](ANTIGRAVITY.md)（このリポジトリ内で完結）

背景は marketplace の「他のエージェントでも使う」節を参照。

## 環境変数 / API キー

API キーなどの秘密は **コードに直接書かない・git にコミットしない**。代わりに「環境変数」というファイルに置き、コードはそれを読むだけにする。これだけ守れば事故らない。

### まず: 鍵が無くても動く範囲

**何も設定しなくても、アプリの起動と UI 開発はできる。** 鍵は「その機能を使うときだけ」必要。

| 鍵なしで OK | 鍵が必要 |
|---|---|
| `pnpm dev` でアプリ起動・ランディング表示 | **AI 機能を動かす**（チャット等） → `AI_GATEWAY_API_KEY` |
| 画面・UI を組む（shadcn / レイアウト / デザイン） | **DB・ログイン**を使う → Firebase のキー |
| **git push → Vercel 自動デプロイ・プレビュー URL** | **Claude に GitHub 操作を MCP でさせる**（任意） → `GITHUB_TOKEN` |
| **Auto-fix の CI ループ**（Actions 組込トークンで動く） | 監視・計測・画像の自動生成 → 各キー |
| Claude / Codex に依頼（認証は OAuth ログイン） | |

> つまり「まず触ってみる」段階では鍵は不要。**git 連携・Vercel デプロイ・Auto-fix も自前の鍵は要らない**（Vercel の GitHub 連携と Actions 組込トークンで動く）。上の右側の機能を足したくなったら、そのキーだけ設定すればよい。

### ローカルで使い始める（3 ステップ）

```bash
cp .env.example .env.local       # ① 雛形をコピー
# ② .env.local を開き、使うキーのコメント(#)を外して値を貼る
pnpm dev                         # ③ 起動。.env.local は自動で読まれる
```

- **`.env.local`** … あなたの手元の実値を書くファイル。`.gitignore` 済なので **commit されない**（＝安全）。
- **`.env.example`** … キー名だけの見本。これは commit する（チームが「何の鍵が要るか」を見るため）。
- 新しいキーを足したら、両方に書く（`.env.local` に実値・`.env.example` にダミー）。
- 本番（Vercel）の値は `.env.local` ではなく **Vercel の管理画面** か `gh secret set` に登録する。

> **キー名の頭の `NEXT_PUBLIC_` に注意**: これが付くとブラウザに丸見えになる。公開してよい値（URL 等）だけに付け、**API キーなどの秘密には絶対に付けない**。

### 用意済みのキー

| 用途 | キー | プラグイン |
|---|---|---|
| アプリの公開 URL | `NEXT_PUBLIC_APP_URL` | 共通 |
| **AI（Claude / GPT / Gemini など）** | `AI_GATEWAY_API_KEY` ＋ `AI_MODEL` | `ai-feature` / `image-gen` |
| DB・認証（Firebase） | `NEXT_PUBLIC_FIREBASE_*` ＋ `FIREBASE_ADMIN_*` | `firebase-backend` |
| GitHub MCP（任意） | `GITHUB_TOKEN` | `.mcp.json`（Claude に GitHub 操作させる時のみ） |
| 監視・計測（任意） | `SENTRY_*` / `NEXT_PUBLIC_GA_ID` 他 | `observability-setup` / `analytics-events` |

詳しい命名ルールは marketplace の [env-naming.md](https://github.com/FDE-project/vercel-aiagent-coding-skill/blob/main/docs/conventions/env-naming.md)。

### AI のキーは 1 つだけ（Vercel AI Gateway）

AI は **`AI_GATEWAY_API_KEY` 1 つ**で Claude / GPT / Gemini など全部に届く。プロバイダごとに別々のキーは要らない。使うモデルは **`AI_MODEL` の文字を変えるだけ**で切り替わる（コードは触らない）。

```bash
# .env.local
AI_GATEWAY_API_KEY="..."                 # ↓ 下記の手順で取得した値
AI_MODEL="anthropic/claude-opus-4.8"     # Gemini にするなら google/gemini-2.5-pro (ID はドット区切り)
```

**キーの取り方**: [Vercel ダッシュボード](https://vercel.com) → 上部 **AI Gateway** → **Create Key** → 出た値を `AI_GATEWAY_API_KEY` に貼る。利用にはクレジットが必要（カード登録で `$5` 無料分が付く）。

> ⚠️ `AI_GATEWAY_API_KEY` は **Vercel Gateway の鍵**であって、あなたの OpenAI / Anthropic のキーではない。`.env` には常にこの Gateway キーを置く。

#### 自社の provider キー（自分の OpenAI / Anthropic 契約）を使いたい場合 — BYOK

`.env` には入れない。**Vercel ダッシュボード側に登録**するだけで、コードも `.env` も変えずに切り替わる。

1. Vercel → **AI Gateway → Bring Your Own Key (BYOK)**（`vercel.com/[team]/~/ai-gateway/byok`）
2. 使う provider（Anthropic / OpenAI / Google など）の **Add** → 自社のキーを貼る → **Enabled** を ON → **Test Key**
3. 以降そのリクエストは**あなたの契約**で処理（課金も自社側）。キーが失敗すると Vercel クレジットへ自動フォールバックするため、**残高は少し残す**

> `.env` は `AI_GATEWAY_API_KEY`（入場券）＋ `AI_MODEL` のまま。「どの契約で provider を呼ぶか」は Gateway 側で決まる。

### 画像・アイコン

なるべく鍵を使わない。アイコンは `lucide`（鍵不要）、写真などはログイン済みの ChatGPT / Gemini で作って `public/images/` に置く。詳細は [AGENTS.md](../AGENTS.md)。

## ライセンス

Private（社内利用想定）。配布する際はライセンスを別途設定。
