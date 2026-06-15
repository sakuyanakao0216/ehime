<!-- Draft PR で作成し、CI モニタリングを ON にする (Auto-fix 運用の前提。AGENTS.md 参照) -->

## 概要

(何を・なぜ。1〜3 行)

## プレビュー URL

<!-- Vercel の GitHub 連携が自動でコメントする URL。READY になったらここにも貼る -->

- プレビュー:

## チェックリスト

- [ ] `pnpm check` / `pnpm typecheck` が通る (CI グリーン)
- [ ] `console.log` をプロダクションコードに残していない
- [ ] 秘密値 (API キー等) をコード・`.env.example` に書いていない
- [ ] `.steering/[日付]-[機能名]/` に確定事項を残した (機能追加・修正の場合)
- [ ] README / docs の更新が必要な変更なら反映した
