# プロンプト版管理（旧 prompt-manager）

プロンプトを「コードと履歴で管理」し、変更を評価結果と紐づける。

## 置き場所

```
lib/ai/prompts/
  classify.ts        ← プロンプト本体（バージョン定数 + 文字列）
docs/ai/prompts.md   ← 履歴・入出力例・評価結果
```

## プロンプト本体（コードで管理）

```ts
// lib/ai/prompts/classify.ts
export const CLASSIFY_PROMPT_VERSION = '2026-06-04.2'
export const CLASSIFY_PROMPT = `
あなたは問い合わせ分類器です。…
（プロンプトインジェクションガード文を末尾に: ai-feature 参照）
`
```

## 履歴ドキュメント（docs/ai/prompts.md）

```markdown
## classify プロンプト

### v2026-06-04.2（現行）
- 変更: 「billing」の定義を明確化
- 入出力例: 「請求書が届かない」→ billing
- 評価: cases 12/12 pass（前版は 10/12）

### v2026-06-04.1
- 初版
- 評価: 10/12（空文字と多言語で誤分類）
```

## 運用ルール

- プロンプト変更は**バージョンを上げ**、`docs/ai/prompts.md` に「変更点 / 入出力例 / 評価結果」を残す
- 変更時は `ai-eval` の回帰（[eval-template.md](./eval-template.md)）を回し、劣化がないか確認してからマージ
- バージョン文字列は `Date.now()` ではなく、コミット時に手で日付を振る（再現性）

> モデル/SDK の更新でプロンプトの効き方は変わる。モデル更新時も回帰を回すこと。
