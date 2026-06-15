<!--
このファイルはアプリの README です。コピー後、あなたのプロジェクト説明に書き換えてください。
テンプレ(スターター)の使い方は docs/STARTER.md、ハウスルールは AGENTS.md にあります。
-->

# スポえひめ（オールえひめ スポーツ）

愛媛のスポーツ情報を集約する**スポーツ情報ハブ**を入口に、スポーツ好きの大人を
ゆるい関わりから**指導者候補へ育て**、学校・クラブの**足元のニーズを広域でマッチング**する
プラットフォームのプロトタイプ（2026年12月プロト → 2027年社会実装）。

## コンセプト：両輪モデル

- **Wheel A（中長期・候補の創出）**: スポーツ情報ハブで集客 → 嗜好データ → AI が「つながりイベント」
  （大人×学生×プロ）を企画 → `観る→参加→ちょい手伝い→継続→指導者` の**関わりの階段**で候補を増やす。
- **Wheel B（足元・いまのニーズ）**: 学校・クラブのリクエスト × 候補リストを**広域マッチング**。

> 構想の詳細は [`.steering/20260615-matching-platform/concept-v2.md`](.steering/20260615-matching-platform/concept-v2.md)。

## 何ができるか

| 画面 | 役割 | 内容 |
|---|---|---|
| `/` | 共通 | スポーツ情報ハブ（今日/今週末/今月のイベントをリスト＆地図・割引、種目/カテゴリで絞る）＋両輪への入口 |
| `/connect` | 利用者 | Wheel A: AI つながりイベント（大人×学生×プロ）＋関わりの階段 |
| `/me` | 利用者 | マイスポーツ（嗜好プロファイル・関わりの階段・行動ログ・特典） |
| `/operator` | 学校・クラブ | Wheel B: ささえる。募集 → **AI 広域マッチング**（マッチ度・理由） |
| `/operator/recruit/new` | 学校・クラブ | 募集条件を入力 → AI が県全体のプールから候補を提案 |
| `/instructors` | 共通 | 指導者候補の一覧（種目・地域・オンライン可でフィルタ） |

### AI の位置づけ

1. **つながりイベントの自動企画**（嗜好データ × 学校ニーズ × 地域）
2. **関わりの次の一歩レコメンド**（階段を一段上げる）
3. **足元マッチング**（ニーズ × 候補 = `/api/match`）

## AI マッチング

`POST /api/match` が `lib/ai.ts`（Vercel AI Gateway）+ AI SDK `generateObject` で候補をスコア・理由付きで返す。
**AI 鍵が未設定/失敗のときは `lib/mock/match.ts` のルールベースに自動フォールバック**するので、鍵なしでもデモが動く。
本番の鍵は Vercel env（`AI_GATEWAY_API_KEY` / OIDC）で設定。

## ローカル起動

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

> データはすべて `lib/mock/`（faker ja）のモック。実 DB・実認証は社会実装フェーズで配線。

## 開発の進め方

- **何か作りたいとき**: Claude Code で `/start`（司令塔。要件確認 → プラン → フロー → dev ブランチ作業 → プレビュー URL。最短なら `/start --quick`）
- **Codex / Antigravity でスキルを使いたいとき**: エージェントに **「スキルを生成して」** と頼むだけ（adapter が `.codex/skills/` ・ `.agents/skills/` に書き出す）。手順は [docs/CODEX.md](docs/CODEX.md) / [docs/ANTIGRAVITY.md](docs/ANTIGRAVITY.md)
- **環境変数 / API キー**: [docs/STARTER.md「環境変数 / API キー」](docs/STARTER.md#環境変数--api-キー)
- **テンプレの使い方全体**（サーフェス別クイックスタート・プラグイン一覧）: [docs/STARTER.md](docs/STARTER.md)
- **ハウスルール / 既定の作業フロー（司令塔）/ 規約 / 禁止事項**: [AGENTS.md](AGENTS.md)

## 技術スタック

Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui / pnpm / Vercel。詳細は [AGENTS.md](AGENTS.md)。

---

> 🧰 このリポジトリは [`vercel-aiagent-coding-skill-starter`](docs/STARTER.md) から作成。テンプレの全機能と使い方は [docs/STARTER.md](docs/STARTER.md) を参照。
