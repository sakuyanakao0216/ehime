# ローカル polling daemon の設計メモ

Web 限定の Auto-fix を、VS Code / CLI で擬似再現するためのローカル daemon 設計案。**設計提案であり実装の正ではない**（このプラグイン自体が設計ドキュメント）。

## 役割

GitHub Actions の `repository_dispatch`（Preview Comments check failure を検知して発火）を受け取り、ローカルで「Toolbar コメントを直す」ループを手動 1 クリックで起動できる状態にする。

## 構成

```
GitHub Actions (check_suite: Preview Comments check failed)
        │ repository_dispatch / webhook
        ▼
ローカル daemon (polling or webhook 受け) ── 通知 ──▶ VS Code ステータスバー / OS 通知
        │ 1 クリック
        ▼
claude / codex CLI を起動 → vercel-toolbar-loop スキルを呼ぶ
```

## polling 方式（最小）

webhook を公開できない環境向け。GitHub の最新 run / dispatch を一定間隔で問い合わせる。

```bash
#!/usr/bin/env bash
# daemon.sh — 60s ごとに未処理の Toolbar コメントを確認する設計スケッチ
INTERVAL="${POLL_INTERVAL:-60}"
while true; do
  # gh api で最新の repository_dispatch / check run を確認
  pending=$(gh api "repos/$REPO/commits/$SHA/check-runs" \
    --jq '[.check_runs[] | select(.name=="Preview Comments" and .conclusion=="failure")] | length')
  if [ "${pending:-0}" -gt 0 ]; then
    notify "Toolbar コメント未対応あり — /toolbar-pull を起動できます"
  fi
  sleep "$INTERVAL"
done
```

> CLI ループの実装では `sleep` の常駐に注意。実運用では launchd / systemd / VS Code 拡張のバックグラウンドタスクに載せる。

## VS Code 拡張で出すなら

- `StatusBarItem` に未対応件数バッジ
- クリックで `tasks.json` / コマンド経由で `claude -p "/toolbar-pull"` を起動
- 通知は `window.showInformationMessage`

## 通知方式の選択

| 環境 | 推奨 |
|---|---|
| webhook 公開可 | `repository_dispatch` 受け (即時) |
| 公開不可 | polling (上記、60s 程度) |
| VS Code 主軸 | 拡張のステータスバー + コマンド |

## 関連

- [workflows-template/preview-comments-detect.yml](../workflows-template/preview-comments-detect.yml)
- [docs/runbooks/auto-fix-conditions.md](../../_docs/runbooks/auto-fix-conditions.md)
- [docs/comparison/surfaces.md](../../_docs/comparison/surfaces.md)
