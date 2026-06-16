# レスポンシブ設計（スマホ / タブレット / PC）

shadcn/ui は Tailwind ベースなので、レスポンシブは **Tailwind の breakpoint ユーティリティ**で組む。原則 **モバイルファースト**（無印 = スマホ、`md:` 以上で広げる）。

## Tailwind breakpoint

| prefix | 最小幅 | 主な対象 |
|---|---|---|
| (無印) | 0px〜 | スマホ縦 (375 / 390 / 412) |
| `sm:` | 640px | スマホ横 / 小タブレット |
| `md:` | 768px | タブレット縦 (768 / 834) |
| `lg:` | 1024px | タブレット横 / 小型 PC |
| `xl:` | 1280px | PC (1280 / 1440) |
| `2xl:` | 1536px | 大画面 |

## モバイルファーストの基本形

```tsx
// 1 カラム (スマホ) → 2 カラム (タブレット) → 3 カラム (PC)
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  {items.map(i => <Card key={i.id} />)}
</div>

// スマホは縦積み、md 以上で横並び
<div className="flex flex-col md:flex-row gap-4" />

// 余白もデバイスで変える
<main className="px-4 md:px-6 lg:px-8 py-6" />
```

## デバイス別パターン

### ナビゲーション: sidebar ⇄ drawer
- **PC (`lg:` 以上)**: `sidebar` を常時表示
- **スマホ / タブレット**: `sheet` または `drawer` でハンバーガー起動
- shadcn の `sidebar` は `<SidebarTrigger>` でモバイル時に自動でオフキャンバス化する。collapsible 構成 (`sidebar-07` 等) を使うと breakpoint 対応が楽

```tsx
<SidebarProvider>
  <AppSidebar />            {/* lg 以上は固定、未満は sheet として開く */}
  <SidebarInset>
    <SidebarTrigger className="lg:hidden" />  {/* モバイルだけトリガ表示 */}
    {children}
  </SidebarInset>
</SidebarProvider>
```

### テーブル: data-table → カード
- 横スクロールが許容できない狭幅では、`md:` 未満でカード表示に切替える（列が多い `data-table` はスマホで破綻しやすい）
```tsx
<div className="hidden md:block"><DataTable /></div>
<div className="md:hidden space-y-2">{rows.map(r => <Card />)}</div>
```

### ダイアログ: dialog → drawer
- PC は `dialog`（中央モーダル）、スマホは `drawer`（下からスライド）が指で操作しやすい

### フォント / タップ領域
- 本文は最小 16px（スマホで iOS の自動ズームを防ぐ）
- タップ要素は最低 44×44px を確保（`min-h-11` 目安）

## チェックの目安（design-review と連携）

実機/ビューポートで確認すべき幅:
- スマホ: 375 / 390 / 412
- タブレット: 768 / 834
- PC: 1280 / 1440

`smoke-test` の Playwright マルチビューポートと、`design-review` の軸2「レスポンシブ」で二重に担保する。

## 注意

- `container` クラスや固定 `w-[...]` の多用は崩れの原因。`max-w-*` + `mx-auto` を基本に
- 画像は `next/image` の `sizes` を指定して各 breakpoint で適切な解像度を出す
- Tailwind v4 の breakpoint カスタムは `@theme` で行う。最新ドキュメントで確認すること
