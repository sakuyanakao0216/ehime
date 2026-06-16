# Runbooks

実機検証で踏んだハマりどころと回復手順。

- [auto-fix-conditions.md](./auto-fix-conditions.md) — Auto-fix が動く / 動かない条件
- [ai-gateway-reachability.md](./ai-gateway-reachability.md) — サーフェス別「生成/推論できるか」(Web は Gateway に到達不可・到達性が本質)
- [ai-gateway-byok-routing.md](./ai-gateway-byok-routing.md) — BYOK 登録だけではルーティングは変わらない(Vertex 固定は `AI_PROVIDER_ONLY`・確認は Observability)
- [vercel-mcp-oauth.md](./vercel-mcp-oauth.md) — "Host not in allowlist" 対策
- [settings-failure-cases.md](./settings-failure-cases.md) — `.claude/settings.json` parse 失敗パターン（実機検証の代表 3 例。`/doctor` の自動検出は 6 パターン）
