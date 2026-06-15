# `.steering/_template/` — ステアリング雛形

これは**見本(テンプレ)**です。日付付きの機能ディレクトリではありません。

## 使い方

修正・機能追加に着手するとき:

1. 機能名と日付 (`YYYYMMDD`) を決める
2. このフォルダを `.steering/[日付]-[機能名]/` にコピーする
   （例: `cp -r .steering/_template .steering/20260610-login`）
3. 各 md を埋めながら**確定事項を積み上げる**。不要な md は消し、必要なら増やす
4. 実装後は README など関連ドキュメントも更新する

> `.steering/` は git にコミットする（確定事項としてチーム共有・履歴に残す）。
> 運用ルールの正本は [`AGENTS.md`](../../AGENTS.md)「修正時のステアリング運用」。

## 含まれる雛形

- `requirements.md` — 要求事項
- `design.md` — 設計内容
- `tasklist.md` — 実装内容詳細
- `infla.md` — GCP など インフラ設定詳細
