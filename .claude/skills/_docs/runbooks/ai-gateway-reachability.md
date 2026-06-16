# AI Gateway 到達性 — サーフェス別「生成/推論できるか」

ランタイムで AI Gateway (`ai-gateway.vercel.sh`) を呼ぶ処理(画像生成 = `image-gen`、テキスト/エージェント = `ai-feature`)が、**実行サーフェスによって通る/通らない**。本質は **「鍵の有無」ではなく「そのサーフェスからゲートウェイに到達できるか」**。

## サーフェス別 可否

| サーフェス | 直接生成/推論 | 理由 |
|---|---|---|
| **Claude Code on the web**(claude.ai/code の実行環境) | ❌ できない | リモート sandbox の**ネットワーク許可リストが `ai-gateway.vercel.sh` を遮断(403)**。さらに鍵/OIDC が環境に無い。**鍵があってもネットワークで弾かれる** |
| **VS Code 拡張**(ローカルの Claude Code) | ✅ できる | ローカルはネットワーク開放。`.env.local` に鍵、または OIDC があれば直接実行可(`pnpm gen:*` 等がそのまま動く) |
| **CLI**(ローカル) | ✅ できる | VS Code と同じ |

> OIDC は VS Code でも使える(「無理」ではない): `vercel link` → `vercel env pull` で `VERCEL_OIDC_TOKEN`(12h で失効)が `.env.local` に入り、**鍵を持たなくても**生成できる。失効したら再 pull。([ai-feature の OIDC](../../ai-feature/) / AI SDK なら自動)

## Web 版での回避策

Web 実行環境はゲートウェイに到達できないので、**その場で生成しない**:

1. **プロンプトを出して人が別環境で作る**(ローカル VS Code/CLI、またはログイン済み ChatGPT/Gemini アプリ=キーレス)→ `public/images/` に配置
2. **デプロイ済みプレビューのオンデマンド API で生成**(OIDC が効く**サーバー側**で実行)→ Web の sandbox ではなく Vercel 上で動くため到達できる

## 要点

- **到達性 > 鍵**。「鍵を入れたのに動かない」ときは、まず**そのサーフェスからゲートウェイに到達できるか**を疑う
- 同じ allowlist 由来の詰まり: Vercel MCP OAuth の [vercel-mcp-oauth.md](./vercel-mcp-oauth.md)(`mcp.vercel.com` 側)
- 画像は別モデル(`AI_IMAGE_MODEL`)・キーレス優先。詳細は [image-gen](../../image-gen/)
