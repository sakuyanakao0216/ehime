<!--
このファイルはアプリの README です。コピー後、あなたのプロジェクト説明に書き換えてください。
テンプレ(スターター)の使い方は docs/STARTER.md、ハウスルールは AGENTS.md にあります。
-->

# 広域連携システム（オールえひめ）

愛媛県の部活動・地域クラブの**運営者と指導者を、県主導で広域マッチング**するプラットフォームのプロトタイプ。
指導者不足と地域間の偏りを乗り越え、子どもがどの地域にいても専門的な指導に出会える仕組みを目指します
（2026年12月プロトタイプ → 2027年社会実装）。

## 何ができるか

| 画面 | 視点 | 内容 |
|---|---|---|
| `/` | 共通 | 課題（部活動200減・地域偏在）→ 解決の3つの柱 → 県内アクティビティフィード・地域メーター |
| `/operator` | 運営者 | 募集に対する **AI 推薦候補**（マッチ度・理由・信頼レイヤー）と地域の充足状況 |
| `/operator/recruit/new` | 運営者 | 募集条件を入力 → AI が県全体のプールから候補を提案 |
| `/instructors` | 共通 | 指導者一覧（種目・地域・オンライン可でフィルタ） |
| `/instructor` | 指導者 | マイページ（プロフィール・マッチする募集・研修・感謝の声・貢献バッジ） |

### 差別化の核（調査ベース）

1. **県主導の広域プール** — 市町の壁を越えて人材を融通（小規模市町は構築ゼロで参加）
2. **死蔵させない設計** — 名簿ではなく「毎日関わりたくなる」体験（フィード／感謝／バッジ）
3. **信頼の可視化** — 研修・資格・実績・感謝の声で「どんな人か分からない不安」を解消
4. **オンライン×偏在解消** — 物理的距離を AI マッチングとオンライン指導で無効化

> 調査・インサイト・設計の根拠は [`.steering/20260615-matching-platform/`](.steering/20260615-matching-platform/) に集約。

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
