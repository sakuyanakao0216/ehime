---
name: format-ja
description: 日本語ロケールの日付・数値・通貨・相対時刻のフォーマットを統一するスキル。「日付フォーマット」「日付の表示」「数値フォーマット」「桁区切り」「カンマ区切り」「通貨表示」「円表示」「金額フォーマット」「パーセント表示」「相対時刻」「〜分前」「和暦」「年月日」「format-ja」「Intl で整形」などのキーワードでトリガする。Intl.DateTimeFormat / Intl.NumberFormat / Intl.RelativeTimeFormat をベースに lib/format.ts へ型付きヘルパー (formatJPY / formatDate / formatDateTime / formatNumber / formatPercent / formatRelative) を生成し、表示の揺れ (¥ と 円、桁区切りの有無、YYYY/MM/DD と YYYY年M月D日) を一箇所に集約する。mockdata-ja が生成したデータの表示整形にそのまま使える。
allowed-tools: [Bash, Read, Write, Edit]
---

# format-ja

## このスキルが解決すること

プロトでありがちな「ある画面は `¥1,000`、別の画面は `1000円`、日付は `2026/6/4` と `2026年6月4日` が混在」という**表示の揺れ**を、フォーマットヘルパーを 1 ファイルに集約して止める。手書きの桁区切りや日付組み立てをやめ、`Intl` に寄せる。

1. **日付 / 数値 / 通貨 / 相対時刻**を `Intl` ベースの型付き関数に
2. **`lib/format.ts` に集約**し、画面側はそこだけ import
3. **`mockdata-ja` のデータ**をそのまま整形（型を共有）

## 起動方法

### slash command

`/format-ja [date|number|currency|relative|all]` で起動。

### 自律起動

「日付フォーマットして」「金額を円表示に」「桁区切り入れて」「3分前みたいな表示」などの発話で自動起動。

## 生成するヘルパー（`lib/format.ts`）

| 関数 | 例 | ベース |
|---|---|---|
| `formatJPY(n)` | `¥1,234,567` | `Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })` |
| `formatNumber(n)` | `1,234,567` | `Intl.NumberFormat('ja-JP')` |
| `formatPercent(n)` | `12.3%` | `Intl.NumberFormat('ja-JP', { style: 'percent' })` |
| `formatDate(d)` | `2026年6月4日` | `Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' })` |
| `formatDateTime(d)` | `2026/06/04 13:45` | `Intl.DateTimeFormat('ja-JP', {...})` |
| `formatRelative(d)` | `3分前` / `2日後` | `Intl.RelativeTimeFormat('ja-JP')` |

実装と使用例は [references/patterns.md](./references/patterns.md)。

## やってはいけないこと

- 手書きの桁区切り（`String(n).replace(/.../)`）や自前の日付組み立て（`${y}/${m}/${d}`）→ `Intl` に統一
- 通貨記号のハードコード（`'¥' + n`）→ `formatJPY`
- 画面ごとに別フォーマットを散らす → 必ず `lib/format.ts` 経由
- タイムゾーン未指定で日付がずれる → 日付のみは UTC ずれに注意し、必要なら `timeZone: 'Asia/Tokyo'` を指定

## 周辺

- `mockdata-ja`: 整形対象のデータと型を提供
- `shadcn-ui`: テーブル / カードのセル表示で `lib/format.ts` を使う
- 多言語化が必要になったら `Intl` のロケール引数を可変にして拡張
