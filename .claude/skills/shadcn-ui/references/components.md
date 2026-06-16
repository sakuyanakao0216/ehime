# shadcn/ui コンポーネント一覧と用途

`pnpm dlx shadcn@latest add <name>` で追加する個別コンポーネントの早見。プロトで使用頻度の高いものを中心に。

## フォーム / 入力
| name | 用途 |
|---|---|
| `button` | あらゆるアクション。`variant` (default/secondary/destructive/outline/ghost/link) |
| `input` | テキスト入力 |
| `textarea` | 複数行入力 |
| `label` | 入力ラベル (form とセット) |
| `form` | react-hook-form + zod の配線。バリデーション表示 |
| `select` | ドロップダウン選択 |
| `checkbox` / `radio-group` / `switch` | 真偽・択一・トグル |
| `slider` | 数値レンジ |
| `calendar` | 日付選択。date picker は `calendar` + `popover` を組み合わせて実装する (公式の Date Picker は組み立て例で、`add date-picker` できる registry 名ではない) |

## レイアウト / コンテナ
| name | 用途 |
|---|---|
| `card` | KPI / 区切り。プロトの主役 |
| `tabs` | 画面内の切替 |
| `separator` | 区切り線 |
| `sheet` | サイドから出るパネル |
| `dialog` / `alert-dialog` | モーダル / 確認モーダル |
| `drawer` | モバイルの下スライド |
| `accordion` / `collapsible` | 折りたたみ |

## ナビゲーション
| name | 用途 |
|---|---|
| `sidebar` | ダッシュボードの左ナビ (公式 block と相性良) |
| `breadcrumb` | パンくず |
| `navigation-menu` / `menubar` | 上部メニュー |
| `dropdown-menu` | 行アクション / ユーザーメニュー |
| `command` | ⌘K パレット |

## データ表示
| name | 用途 |
|---|---|
| `data-table` | TanStack Table ベースの表 (ソート/フィルタ/ページング) |
| `table` | 素の表 |
| `chart` | Recharts ベースのグラフ基盤 (`add chart`)。面/棒/線/円の実装はチャート例 (`chart-area-default` / `chart-bar-default` / `chart-line-default` / `chart-pie-simple` 等) を registry から add するか参考にする |
| `badge` | ステータスタグ |
| `avatar` | ユーザーアイコン |
| `progress` | 進捗バー |
| `skeleton` | ローディングプレースホルダ |

## フィードバック
| name | 用途 |
|---|---|
| `sonner` | トースト通知 (推奨) |
| `tooltip` / `hover-card` | 補助情報 |
| `alert` | インライン警告 |

## 追加の指針

- 既に `components/ui/<name>.tsx` があるものは再追加しない (スキップ)
- 組み合わせパターンは [patterns.md](./patterns.md)、公式ブロックは [blocks.md](./blocks.md)
- `components/ui/*` は直接編集せず、カスタムは `components/<name>.tsx` に派生
- 正確な name と最新コンポーネントは shadcn/ui 公式 (`pnpm dlx shadcn@latest add` の補完) で確認すること
