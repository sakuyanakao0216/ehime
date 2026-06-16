# コスト チェックリスト

サービス別に 課金源 → 設定手順 → 確認 の順。単価・無料枠・画面 UI は頻繁に変わるので、**金額は必ず公式の料金ページで当日確認**してから docs/ops/cost.md に記録する。

## 1. AI（AI Gateway 経由の LLM 呼び出し）

最も事故りやすい。単価が「モデル × 入出力トークン」で決まり、プロンプト設計1つで桁が変わる。

### 概算テンプレ

```
1 呼び出しコスト = (入力トークン数 × 入力単価) + (出力トークン数 × 出力単価)
月額見込み      = 1 呼び出しコスト × 1 ユーザーあたり呼び出し/月 × 想定ユーザー数
```

例（数値はダミー。単価は公式の料金表で確認）:

| 項目 | 値の出し方 |
|---|---|
| 入力トークン | システムプロンプト + 会話履歴 + ユーザー入力。履歴を全部送ると線形に増える |
| 出力トークン | `maxOutputTokens` で上限を切る（守りそのもの） |
| 呼び出し回数 | チャットなら 1 会話あたりターン数 × 会話数で見積る |

### 実コストの見方（見積りではなく「実際に使った量」）

二段構えで見る。どちらも鍵・追加サービス不要:

1. **AI Gateway → Observability**（コード不要・請求額の正）
   - Vercel ダッシュボード → AI Gateway → **Observability**: リクエストごとの model / 入出力トークン / **cost** / provider と日別推移、クレジット残高
   - 「いくら使ったか」の確認はここが正。BYOK ならどのプロバイダ契約を通ったかも分かる（[ai-gateway-byok-routing.md](../../_docs/runbooks/ai-gateway-byok-routing.md)）
2. **Vercel Logs で `ai_usage` を検索**（機能別の内訳）
   - `ai-feature` が各 route に配線する `logAiUsage`（starter 同梱 `lib/ai-usage.ts`）が `type:'ai_usage'` の構造化 JSON を出す
   - ダッシュボード → プロジェクト → **Logs** で `ai_usage` を検索 → **どの機能（feature）が・どのモデルで・何トークン**使ったかが分かる。「チャットと抽出のどちらが食っているか」は Gateway 側では分からないのでこちらで見る
   - 配線していないプロジェクトはまず ai-feature のパターン（[patterns.md](../../ai-feature/references/patterns.md)）で `onFinish` / `usage` を追加する

### 設定

- [ ] AI Gateway → Observability で使用量とクレジット残高を確認できる状態にする（チームの Billing と合わせて見る。支出上限/通知の設定箇所は公式で確認）
- [ ] AI 呼び出しに `logAiUsage` が配線されているか（機能別内訳が Logs で見えるか）
- [ ] `maxOutputTokens` を用途に対し最小で設定（ai-feature）
- [ ] 会話履歴の送信を直近 N ターンに制限
- [ ] 未ログインで叩ける AI エンドポイントを置かない + レート制限（ai-safety-check）
- [ ] 安いモデルで足りる処理（分類・抽出）に高いモデルを使っていないか

## 2. Vercel

Hobby は個人・非商用向けで上限到達時は停止が基本。Pro は従量分が請求される。

### 設定（Pro チーム）

- [ ] **Spend Management** を有効化: チームの Settings → Billing 配下で金額しきい値を設定（正確な画面位置は公式で確認）
  - 通知のみ / しきい値到達でプロジェクトを自動一時停止、の挙動を選べる。放置プロトは**自動停止**側を推奨
- [ ] Usage ダッシュボードで Function 実行・帯域・画像最適化の内訳を確認
- [ ] 画像最適化の対象（`next/image` のリモート画像）が無駄に多くないか
- [ ] cron / 定期ジョブが放置後も回り続ける設定になっていないか

## 3. Firebase / GCP

Blaze プラン（従量課金）の場合、Firestore 読み書き・Storage 帯域・Functions が課金源。

### 設定

- [ ] **Cloud Billing の予算アラート**: GCP コンソール → お支払い → 予算とアラート で月額予算 + しきい値（50/90/100% 等）の通知を作成
  - **予算アラートは通知のみで、超過してもサービスは止まらない**。この誤解が事故の典型
- [ ] Firestore の読み取り回数を確認: 一覧画面で全件 onSnapshot していないか（ページング / limit）
- [ ] 無限ループの典型: Functions が Firestore 書き込み → 自分のトリガを再発火、になっていないか
- [ ] Security Rules が public read/write のままだと bot に読み書きされて課金される（privacy-check / firebase-backend）
- [ ] 使い終わったプロジェクトは Blaze → Spark に戻す or プロジェクトを停止

## 4. 放置前の最終チェック

- [ ] 3 サービスとも上限 or アラートが設定済み
- [ ] 「止める手順」（Vercel プロジェクト pause / Firebase プラン変更 / AI キー無効化）を docs/ops/cost.md に明記
- [ ] 請求先メールが見るアドレスになっている

## docs/ops/cost.md テンプレ

```markdown
# Cost Guard

## 月額見込み（概算日: YYYY-MM-DD）
| サービス | 内訳 | 見込み |
|---|---|---|
| AI Gateway | <モデル> × N 呼び出し/月 | $X |
| Vercel | Pro 基本 + 従量 | $X |
| Firebase | Firestore N 万読取/月 ほか | $X |

## 設定済みの守り
- AI Gateway: 上限 $X / 週次確認: Observability で実コスト・残高、Logs の `ai_usage` 検索で機能別内訳
- Vercel: Spend Management $X で自動停止
- GCP: 予算 $X、50/90/100% で通知（※止まらない）

## 止める手順（放置・撤収時）
1. Vercel プロジェクトを pause
2. AI Gateway のキーを無効化
3. Firebase を Spark に戻す or プロジェクト停止
```

> 料金・無料枠・ダッシュボードの画面構成はすべて変動が速い。本チェックは観点の網羅が目的で、金額と設定画面の正確な位置は各公式（Vercel Pricing / AI Gateway docs / Firebase Pricing / Cloud Billing docs）で確認すること。
