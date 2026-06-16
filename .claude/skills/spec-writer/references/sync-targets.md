# 外部ツールへの展開（Notion / GitHub Issue / Linear / Jira）

`docs/specs` を正とし、外部ツールへは派生させる。**MCP 接続があれば自動起票、無ければ貼り付け用テンプレ**を出す。一方向（docs → ツール）を基本とし、双方向同期はしない（二重管理を避ける）。

## 共通方針

- 1 ストーリー = 1 Issue/タスク。タイトルは `story-map.md` の文、本文に受入条件を入れる
- ラベル/優先度は story-map の `[MVP]/[R2]` をマッピング
- 既存起票との重複を避けるため、起票済みは docs 側に ID を控える

## GitHub Issue（`gh` CLI）

```bash
gh issue create \
  --title "ユーザーとして、メールで登録できる" \
  --label "MVP" \
  --body-file - <<'EOF'
## 受入条件
- Given 未登録ユーザー
- When 有効なメール/パスワードを入力
- Then アカウントが作成されダッシュボードに遷移する

(spec: docs/specs/story-map.md / acceptance.md)
EOF
```

## Notion（MCP 接続時）

- Notion MCP の `create-pages` でデータベースに 1 ストーリー 1 ページ
- プロパティ: ステータス / 優先度(MVP/R2) / 関連PRD
- 未接続時: Markdown テーブルを貼り付け用に出力

## Linear / Jira

- Linear: MCP or CSV インポート用テンプレ（Title / Description / Priority / Label）
- Jira: 同様に CSV / 起票テンプレ。エピック=活動、ストーリー=各行

## テンプレ（汎用・貼り付け用）

```
[優先度] タイトル
説明: <1-2行>
受入条件:
- Given …
- When …
- Then …
参照: docs/specs/
```

> 各ツールの MCP ツール名・API は更新される。起票時に最新のツール一覧/ドキュメントで確認すること。
