---
name: shadcn-ui
description: shadcn/ui のコンポーネントやブロックを追加するときに起動するスキル。「ボタン作って」「フォーム作って」「ダッシュボード組んで」「サイドバー追加」「テーブル追加」「ログイン画面作って」「shadcn 入れて」「shadcn 追加」「データテーブル作って」「カード作って」「ダイアログ追加」「shadcn 初期化」「components.json が無い」「レスポンシブにして」「スマホ対応」「タブレット対応」などのキーワードでトリガする。`components.json` の有無を確認 → 必要なら `pnpm dlx shadcn@latest init` → 該当コンポーネントの `add` → import + 使用例の生成までを一気通貫で行う。`references/components.md` / `blocks.md` / `patterns.md` / `responsive.md` を参照して、エンタープライズプロトで頻出する組み合わせ (ダッシュボード = sidebar + chart + data-table、ログイン画面 = card + form + auth pattern など) を、スマホ / タブレット / PC のモバイルファーストなレスポンシブ前提で提案する。
allowed-tools: [Bash, Read, Edit, Write]
---

# shadcn-ui

## このスキルが解決すること

shadcn/ui の追加は手順がシンプルだが、毎回:
- `components.json` が無ければ `init` から
- どのコンポーネントが既に入っているか調べる
- `pnpm dlx shadcn@latest add <name>` の正しい name を覚える
- 追加後にどう import するか

を毎回ググるのは時間の無駄。このスキルはユーザの自然言語要求から必要な部品を推測して一気通貫に処理する。

## 起動方法

### 自律起動

「ボタン作って」「ダッシュボード組んで」「テーブル追加」「サイドバー入れて」など、UI 要件に関する発話で自動起動。

### slash command なし

このスキルは slash command を持たない (会話の流れで使われる)。明示的に呼びたい場合は「shadcn-ui を使って」と発話。

## 手順

1. `cat components.json` または Read で components.json の存在確認
2. 無ければ `pnpm dlx shadcn@latest init -y --base-color neutral` を実行 (確認後)
3. ユーザ要求を [references/patterns.md](./references/patterns.md) と照合:
   - 「ダッシュボード」→ `sidebar`, `chart`, `data-table` セット
   - 「ログイン画面」→ `card`, `form`, `input`, `button`, `label`
   - 「設定画面」→ `card`, `tabs`, `form`, `switch`, `slider`
   - 「ファイルアップロード」→ `input`, `button`, `progress`, `dropzone` (community)
4. `components/ui/<name>.tsx` が既に存在するものはスキップ、無いものだけ `pnpm dlx shadcn@latest add <name>`
5. 使用例 (import 文 + 最小 JSX) を生成して提示
6. `components/ui/*` は **直接編集しない** (CLAUDE.md / AGENTS.md の規約)。カスタムは `components/` 直下に派生コンポーネントを作る

## レスポンシブ（スマホ / タブレット / PC）

生成する JSX は **モバイルファースト**を既定にする（無印 = スマホ、`md:`/`lg:`/`xl:` で広げる）。頻出パターン:
- レイアウト: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`、`flex-col md:flex-row`
- ナビ: PC は `sidebar` 常時表示、スマホ/タブレットは `sheet`/`drawer`（collapsible sidebar が楽）
- テーブル: 狭幅は `data-table` をカード表示に切替、ダイアログは PC `dialog` / スマホ `drawer`

確認幅とコード例は [references/responsive.md](./references/responsive.md)。`design-review` 軸2と `smoke-test` のマルチビューポートで二重に担保する。

## 既存実装との重複検出

ユーザが「ボタン作って」と発話したが既に `components/ui/button.tsx` がある場合:
- 既存 button をそのまま使えば良いことを提示
- カスタムバリアントが必要なら `components/ui/button` を base に派生コンポーネントを `components/` 直下に作る

## 周辺 Plugin

- `project-scaffold`: 初回の `init` を兼ねる
- `design-review`: 追加後のデザイン品質チェック

## 参考

- [references/components.md](./references/components.md): 全コンポーネント一覧と用途
- [references/blocks.md](./references/blocks.md): 公式 Block (sidebar-01 等) と用途
- [references/patterns.md](./references/patterns.md): プロト頻出の組み合わせパターン
- [references/responsive.md](./references/responsive.md): スマホ / タブレット / PC のレスポンシブ設計 (Tailwind breakpoint・モバイルファースト・sidebar⇄drawer 等)
