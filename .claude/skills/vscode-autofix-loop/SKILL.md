---
name: vscode-autofix-loop
description: Claude Web 限定の Auto-fix を VS Code 拡張 / CLI / Codex 等の「Auto-fix が動かないサーフェス」で擬似的に再現する設計のスキル。GitHub Actions の `check_suite` トリガで Vercel Preview Comments check の failure を検知し、`repository_dispatch` で notification を打ち、ローカルの daemon / VS Code 拡張のステータスバーから手動 1 クリック起動するパターンを提案する。「Auto-fix を VS Code でも使いたい」「Web 以外でも自動修正したい」「CLI で Toolbar コメント polling」「fde-toolbar-pull 自動化」などの依頼で起動。Web の Auto-fix が組織アカウントで使えない / VS Code を主軸にしたい 場合の代替設計を提示する。
allowed-tools: [Bash, Read, Write, Edit]
---

# vscode-autofix-loop

## このスキルが解決すること

Claude Web の Auto-fix は便利だが、以下の制約がある:
- **Web 限定** (App / CLI / VS Code 拡張 / Codex / Antigravity では動かない)
- **組織アカウント**だと Vercel MCP の OAuth で詰まることがある (`Host not in allowlist`)
- session を Web に**常に開いておく**必要がある

VS Code を主軸にしたい / Web に session を開きっぱなしにしたくない、というときに **GitHub Actions + repository_dispatch + ローカルトリガ**で擬似 Auto-fix を組む設計を提示する。

## 設計案 (2 つ)

### 案 1: GitHub Actions + repository_dispatch (推奨)

```
Vercel Toolbar コメント
  ↓
Vercel bot が PR Check を failure に
  ↓
.github/workflows/preview-comments-detect.yml が check_suite (completed) で trigger
  ↓
workflow が PR / branch 情報を JSON で repository_dispatch payload に積む
  ↓
ローカル: repository_dispatch を受ける workflow の run を gh run list で polling
   または: ローカル daemon が GitHub webhook を受信
  ↓
VS Code ステータスバー / 通知センターに "1 件 Toolbar comment unresolved" 表示
  ↓
ユーザがクリック → VS Code 内の Claude 拡張で /toolbar-pull を発話
```

**メリット**:
- GitHub Actions の自然な拡張で、追加サーバ不要
- repository_dispatch の payload で必要情報を全部運べる
- VS Code 拡張側の対応が不要 (ステータスバー追加が公式機能要望として上がるまでは通知センターで代替)

**デメリット**:
- ローカルが「常時 polling」するか、ngrok でローカル webhook を立てるかの選択が必要
- GitHub Actions の最低 1 分の polling 間隔がある

### 案 2: ローカル daemon polling (シンプル)

```
ローカル daemon (Node.js script)
  ↓ 60 秒ごと
gh api repos/<owner>/<repo>/commits/<ref>/check-runs
  ↓
"Vercel Preview Comments" check_run が failure を発見
  ↓
notify-send / osascript で macOS 通知
  ↓
ユーザがクリック → ターミナル開いて claude → 「/toolbar-pull で対応して」
```

**メリット**:
- 実装が直接的、GitHub Actions 触らない
- VS Code 拡張に依存しない

**デメリット**:
- ローカルプロセスを常時動かす必要 (launchd / systemd)
- API rate limit 注意

## 実装手順 (案 1 を採る場合)

1. `.github/workflows/preview-comments-detect.yml` を新規作成 ([workflows-template/](./workflows-template/preview-comments-detect.yml) のサンプルを使用)
2. workflow が `check_suite` (completed) トリガで Vercel Preview Comments check failure を検知
3. `gh api repos/{owner}/{repo}/dispatches` で `event_type: toolbar-comments-unresolved` を発火
4. ローカル側: repository_dispatch は REST の Events API では観測できないため、`on: repository_dispatch: types: [toolbar-comments-unresolved]` で起動する受け側 workflow (例: `toolbar-notify.yml`) を用意し、その run を `gh run list --workflow toolbar-notify.yml --limit 1 --json status,createdAt` で 60 秒間隔 polling する shell script を `~/.local/bin/vercel-watch.sh` に配置
5. 新しい run を見つけたら `osascript -e 'display notification ...'` で通知
6. クリックされたら VS Code 起動 (`code .`) + ターミナル開く

## やらないこと (今回のスキルは設計提示まで)

- 実装本体 (workflow yml と daemon script の試作はサンプルとして同梱、本番組み込みは個別案件で実施)
- VS Code 拡張への機能要望 (公式 issue として記録するのが筋)

## 関連

- [workflows-template/preview-comments-detect.yml](./workflows-template/preview-comments-detect.yml) — GitHub Actions サンプル
- [references/local-daemon-script.md](./references/local-daemon-script.md) — ローカル polling daemon の設計メモ
- [docs/runbooks/auto-fix-conditions.md](../_docs/runbooks/auto-fix-conditions.md) — Web Auto-fix の正規ループ
- [docs/comparison/surfaces.md](../_docs/comparison/surfaces.md) — サーフェス別の loop 設計
