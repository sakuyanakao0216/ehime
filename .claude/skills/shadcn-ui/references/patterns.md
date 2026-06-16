# shadcn パターン早見表

エンタープライズプロトで頻出する UI を、shadcn コンポーネントの組み合わせで実現する早見表。

## ダッシュボード

```
sidebar + breadcrumb + chart + data-table + card
```

`pnpm dlx shadcn@latest add sidebar breadcrumb chart data-table card`

(面/棒などの実装例はチャート例 `chart-area-default` / `chart-bar-default` 等を参考にする。詳細は [components.md](./components.md))

ファイル構成:
- `app/(dashboard)/layout.tsx` → `<SidebarProvider>` + `<AppSidebar>`
- `app/(dashboard)/page.tsx` → `<Card>` で KPI、`<ChartArea>` で時系列
- `components/app-sidebar.tsx` → navigation を絞ったカスタム sidebar

## ログイン画面

```
card + form + input + label + button + separator
```

react-hook-form + zod の組み合わせを推奨。

## 設定画面

```
card + tabs + form + switch + slider + select + radio-group
```

## CRUD 管理画面

```
data-table + dialog + form + alert-dialog (削除確認) + dropdown-menu (行アクション)
```

## ファイルアップロード

shadcn 公式には dropzone 未収録。`pnpm dlx shadcn@latest add input button progress` + コミュニティ block。

## 通知 / トースト

```
sonner (推奨) or toast (legacy)
```

`pnpm dlx shadcn@latest add sonner`

## モーダル

```
dialog + alert-dialog (確認系) + sheet (サイドパネル) + drawer (モバイル)
```

## 注意

- `components/ui/*` は **直接編集しない** (再生成想定)。カスタムが要れば `components/<name>.tsx` に派生
- `style: new-york` / `baseColor: neutral` / `cssVariables: true` を基本構成とする
- Tailwind v4 (`@import "tailwindcss"`) と shadcn の互換性を最新版で確認すること
