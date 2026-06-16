---
name: image-gen
description: ピッチ用の画像・アイコン素材を用意するスキル。「画像生成」「image-gen」「アイコン入れて」「ペルソナ画像」「hero 画像」「OG 画像」「サムネ作って」「商品画像」「サービスイメージ」「素材作って」などのキーワードでトリガする。鍵の要らない順に案内する: アイコンは lucide-react / Iconify（生成不要）、静的な写真・hero・OG は「ログイン済みの ChatGPT / Gemini アプリで生成 → public/images/ に配置」（API キー不要）。生成を全自動にしたいときだけ 画像生成 MCP（API キー型）または AI Gateway のビルド時キーを使い、その場合は鍵の置き場所（アプリ env、settings.json ではない）を明示して確認を取る。Claude / Codex の OAuth ログイン自体では画像生成できない（Claude は画像入力=vision のみ）点を前提とする。配置後は public/images/<category>/ への保存と next/image の remotePatterns 配線、商標・実在人物・既存著作物を避けるプロンプト整形も担う。
allowed-tools: [Bash, Read, Write, Edit]
---

# image-gen

## このスキルが解決すること

shadcn だけで組んだ UI は「グレーの線が並ぶワイヤー」になりがちで、ピッチで使えない。実画像 (ペルソナ・サービス hero・サンプル写真) を入れると一気に説得力が出る。このスキルは:

1. **ルート選択**: アイコンは lucide、静的写真はログイン済みアプリで生成→配置、自動化したいときだけ API（鍵）— と**鍵の要らない順**に案内
2. **保存先の管理**: ローカル `public/images/<category>/` or remote CDN URL の `images.remotePatterns` 配線
3. **使えるプロンプトに整形**: カテゴリ別テンプレート + セット一貫性（共通スタイルブロック）でプロ品質のプロンプトを出し、著作権・商標・実在人物の制約も避ける（[references/keyless-prompts.md](./references/keyless-prompts.md)）

## 起動方法

「画像作って」「アイコン入れて」「ペルソナ写真」「hero 画像」「OG 画像」などの発話で自律起動。

## サーフェス別 生成可否（到達性が本質）

| サーフェス | API 直接生成 | 備考 |
|---|---|---|
| **Claude Code on the web** | ❌ | sandbox が `ai-gateway.vercel.sh` を遮断(403)。鍵があっても到達できない → プロンプトを出して人が別環境で作る or デプロイ済みプレビューのサーバー側 API で生成 |
| **VS Code / CLI**(ローカル) | ✅ | ネットワーク開放。`.env.local` の鍵 or OIDC(`vercel link`→`vercel env pull`、12h)で直接実行可 |

**鍵の有無より「そのサーフェスからゲートウェイに到達できるか」が本質。** 詳細・回避策は [docs/runbooks/ai-gateway-reachability.md](../_docs/runbooks/ai-gateway-reachability.md)。
なお**キーレス(ルート1/2)はどのサーフェスでも可**(到達不要)なので、Web ではまずキーレスを使う。

## 生成ルートの選び方（キーレス優先）

用途を見て、上から順に**鍵の要らない/手間の少ない**ルートを提案する。API キーは「実行時に都度生成」または「MCP 無しで生成を自動化」したいと**ユーザーが明示したときだけ**提示し、置き場所（アプリ env、`settings.json` ではない）を添えて確認を取る。

> 前提: **Claude / Codex の OAuth ログイン自体では画像生成できない**（Claude は画像入力=vision のみで、生成モデルを持たない）。生成には下記いずれかの「画像が作れる場所」が要る。

| 優先 | ルート | いつ | 鍵 | 自動化 |
|---|---|---|---|---|
| 1 | **アイコンライブラリ**（lucide-react / Iconify） | アイコン全般 | 不要 | コードのみ（生成しない） |
| 2 | **ログイン済みアプリで生成→配置**（ChatGPT / Gemini アプリ → `public/images/`） | 写真・hero・OG の埋め込み | 不要（各サブスクの OAuth） | 手動（エージェントは配置と配線） |
| 3 | **画像生成 MCP（API キー型）** | 生成を全自動にしたい | API キー（MCP 層・プロジェクトには残らない） | ✅ エージェントが生成→保存 |
| 4 | **ビルド時キー（AI Gateway）** | MCP 無しで自動化 | API キー（シェル/CI のみ・アプリにも settings にも残さない） | ✅ |

- **アイコン** → ルート1（`<Settings />` のように import）。生成も鍵も不要。
- **静的な写真/hero/OG（埋め込み）** → 既定はルート2。下記「ルート2の進め方」に従いプロンプト一式を提示し、ユーザーがログイン済みアプリで生成→`public/images/<category>/` に保存。配置と `next/image` 配線はこのスキルが行う。
- 「サブスク課金のまま・OAuth・全自動」は現状実現手段なし（OAuth 対応の画像 MCP が無いため）。自動化が要る場合のみルート3/4（API キー）を提示し確認。

## ルート2の進め方（キーレス生成の品質はプロンプトで決まる）

「リアルな写真」のような曖昧な依頼文を出さない。**[references/keyless-prompts.md](./references/keyless-prompts.md) のテンプレートを必ず使い**、以下の手順で進める:

1. **アセット計画表を出す**: 必要な画像を「ファイル名 / カテゴリ / 用途 / アスペクト比」の表にしてユーザーと合意する（例: `persona-01..08.webp` 1:1、`hero-01.webp` 16:9、`og-bg.png` 1.91:1）
2. **プロンプト一式を生成**: カテゴリ別テンプレート（ペルソナ / hero / OG 背景 / 商品 / イラスト）に当てはめ、セットは「**共通スタイルブロック（全枚一字一句同じ）+ 被写体行（差し替え）**」の2部構成で出す。写真はレンズ・ライティング・肌質感を写真用語で指定し、「美肌フィルターなし・彩度控えめ」「文字・ロゴ・透かしなし」「実在人物に似せない」を必ず含める
3. **同じチャットで連続生成するよう案内**: 2枚目以降は「1枚目と同じライティング・背景・色味で」を付ける。失敗時はリテイク指示語表（references 内）から修正フレーズを渡す
4. **受入チェック → 変換・配置**: references の受入チェックリスト（文字混入 / 実在人物類似 / セット一貫性 / 細部破綻 / サイズ）で確認後、リサイズ・webp 変換して保存ポリシー通りに配置する

## モデル選択指針（ルート3/4 = API で生成する場合・コスパ別）

`AI_IMAGE_MODEL` で切り替える。単価は変動するので目安（採用前に AI Gateway の Models / 料金で当日確認）:

| モデル ID | 目安単価 | 位置づけ |
|---|---|---|
| `google/imagen-4.0-fast-generate-001` | $0.02/枚 (固定) | **既定・おすすめ**。人物・写真系の品質と価格のバランス |
| `openai/gpt-image-1-mini` | ~$0.002–0.009/枚 (トークン課金) | 最安。枚数を回す試行段階に |
| `xai/grok-imagine-image` | $0.02/枚 (固定) | 固定料金の代替 |
| `google/imagen-4.0-generate-001` | $0.04/枚 | fast で物足りないとき |
| `google/imagen-4.0-ultra-generate-001` | $0.06/枚 | 最高品質 (hero など一点もの) |
| `openai/gpt-image-2` | ~$0.033/枚 | テキスト指示への追従が強い |
| `google/gemini-2.5-flash-image` 系 | — | 通称 Nano Banana (2.5=初代 / `gemini-3.1-flash-image-preview`=Nano Banana 2)。**呼び出し方が別** (下記) ・フリーティア不可 |

### AI Gateway の画像モデルは type が2種類（呼び出し方が違う）

| type | 代表モデル | 呼び出し方 |
|---|---|---|
| `image` | `google/imagen-4.0-*` / `bfl/flux-*` / `openai/gpt-image-*` | `generateImage({ model: gateway.imageModel(id) })` |
| `language` | `google/gemini-*-image` | `generateText({ model: gateway(id) })` → `result.files` から取り出す |

```ts
// ❌ gemini-*-image を generateImage で呼ぶと "language model, not an image model" エラー
// ✅ language type は generateText で呼び、files から画像を取り出す
const result = await generateText({ model: gateway('google/gemini-2.5-flash-image'), prompt })
const file = result.files.find((f) => f.mediaType?.startsWith('image/'))
```

- モデルの type は `curl https://ai-gateway.vercel.sh/v1/models`（認証不要）で確認できる
- **フリーティアの制限**: `imagen-4.0-*` (type: image) はレートリミットあり（**BYOK でも制限される**）。`gemini-*-image` (type: language) は**フリーティアでは使用不可**（Vercel へのクレジット追加 or BYOK が必要）

## 環境変数（ルート3/4 = API で生成する場合のみ・ルート1/2 では不要）

```
AI_GATEWAY_API_KEY=<key>        # Vercel AI Gateway (ai-feature と共有)。Vercel デプロイ時は OIDC で省略可
AI_IMAGE_MODEL=google/imagen-4.0-fast-generate-001  # 画像モデル (上のコスパ表から選択)。言語モデル(AI_MODEL)とは別
```

命名は [docs/conventions/env-naming.md](../_docs/conventions/env-naming.md) に従う（`AI_GATEWAY_API_KEY` はサーバーのみ・`NEXT_PUBLIC_*` 禁止）。

> **鍵は利用側（このプラグインをインポートしたプロジェクト）で設定する。プラグイン自体は鍵を持たない。** 置き場所はルート4＝利用側の手元 env / CI、ルート3＝利用側の MCP 設定（マシン単位で1回）。`.claude/settings.json` には書かない。画像は静的埋め込みなので**生成のときだけ**必要で、デプロイ後のアプリには残らない（対して `ai-feature` 等のランタイム生成はアプリの本番 env に鍵が要る）。

## ルート4で生成スクリプトを作るときの規約（実運用での失敗から）

利用側プロジェクトに `scripts/gen-<purpose>-images.ts` を生成する場合、以下を必ず入れる:

1. **既定モデルは有効な ID にする**: `process.env.AI_IMAGE_MODEL ?? 'google/imagen-4.0-fast-generate-001'`。存在しない/廃止されたモデル ID をフォールバックに書かない（env 未設定で即エラーになる）
2. **モデルの type に合わせて呼び出し API を分岐する**: 既定の imagen 系は `generateImage`、`gemini-*-image` を指定された場合は `generateText` + `result.files` 経路（上記「type が2種類」参照）。type を混同すると "language model, not an image model" で即死する
3. **`.env.local` 不在は明示エラー**: ロードを silent skip せず、`console.error('Error: .env.local が見つかりません。npx vercel env pull を実行してください。')` + `process.exit(1)` で止める（鍵なしで API を叩いて分かりにくい 401 を出さない）
4. **手順 README に `pnpm install` を含める**: clone 直後のプロジェクトでは node_modules が無い。実行手順は `vercel link && vercel env pull` → `pnpm install` → `pnpm gen:<purpose>` の順で書く
5. プロンプト本文はルート2と共通（[references/keyless-prompts.md](./references/keyless-prompts.md) のテンプレート・共通スタイルブロックをそのまま使う）

## 保存ポリシー

- 完成画像は `public/images/<category>/<name>-01.webp` 形式
- カテゴリ: `persona/` / `hero/` / `product/` / `og/` / `icon/`
- 命名: `<purpose>-<index>.webp` (例: `persona-01.webp`)
- 大きさ: 必要解像度の 2x までに留める (LCP 配慮)

## next/image 配線

remote CDN URL を使う場合は `next.config.mjs` に追記:

```js
images: {
  remotePatterns: [{ protocol: 'https', hostname: '<cdn-host>' }]
}
```

## やってはいけないこと

- 実在クライアントのロゴ / 商標を生成
- 実在人物の顔を再現
- 既存著作物 (ブランド広告等) のスタイル模倣

## 周辺

- **アイコンは `lucide-react`（shadcn-ui 同梱）/ Iconify を第一候補**（生成も鍵も不要）
- `shadcn-ui`: hero / card / banner のレイアウトを先に作っておく
- `design-review`: 生成後の色味調整 / 余白チェック
- 鍵の扱いの全体像は [docs/conventions/env-naming.md](../_docs/conventions/env-naming.md)（秘密情報は `NEXT_PUBLIC_*` に置かない／settings.json に書かない）
