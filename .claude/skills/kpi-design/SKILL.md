---
name: kpi-design
description: 成功をどう測るかを設計するスキル。「KPI設計」「North Star」「KPIツリー」「指標設計」「成功指標を決めたい」「ガードレール指標」「OKR」「kpi」などのキーワードでトリガする。プロダクトの価値を表す North Star Metric を 1 つ選び、入力/行動/結果の KPI ツリーに分解し、悪化を見張るガードレール指標を置く。プロト段階の割り切り(厳密さより方向性)を前提に docs/discovery/kpi-design.md に出力する。ここで決めた指標が analytics-events(計測イベント)と experiment-plan(実験の成功指標)の入力になる上流の指標設計を担う。
allowed-tools: [Bash, Read, Write, Edit]
---

# kpi-design

## このスキルが解決すること

「あとで効果測定したいが、何を成功とするか決めていなかった」を防ぐ。**作る前に、何が良くなれば成功かを 1 指標に決める**。計測の前段(analytics-events / experiment-plan は KPI が決まっている前提)。

1. **North Star Metric**: プロダクトの価値を最もよく表す 1 指標を選ぶ
2. **KPIツリー**: NSM を 入力 → 行動 → 結果 に分解し、動かせるレバーを見つける
3. **ガードレール**: NSM を追う裏で悪化させてはいけない指標を置く

## 起動方法

### slash command
`/kpi [nsm|tree|guardrail]` で起動。

### 自律起動
「KPI 決めたい」「North Star は?」「成功指標を設計」「何を測れば成功?」などで自動起動。

## 進め方

### 1. North Star Metric (docs/discovery/kpi-design.md)

`target-definition` のペルソナが**価値を得た瞬間**を表す 1 指標を選ぶ。選び方・指標パターンは [metric-patterns.md](./references/metric-patterns.md)。

- 「ユーザーが得る価値」と相関する(売上の代理ではなく価値の代理)
- 短期で動かせる / 偽装できない(登録数だけ等の虚栄指標を避ける)

### 2. KPIツリー分解

NSM を **入力指標(自分で動かせる)→ 行動 → 結果** に分解。雛形・Mermaid 例は [kpi-tree.md](./references/kpi-tree.md)。

```
NSM: 週次アクティブ作成者数
 ├ 結果: 継続率
 ├ 行動: 初回作成完了率(アクティベーション)
 └ 入力: 登録率 / オンボ完了率
```

### 3. ガードレール指標

NSM を押し上げる裏で犠牲にしてはいけない指標(直帰率 / 解約率 / コスト / エラー率)を置く。`experiment-plan` のガードレールに直結。

### 4. 目標値(プロト段階の割り切り)

厳密な統計より「方向が見えるか」。**基準線(今)→ 目標(いつまでに)** をざっくり置く。「分からない」は仮値+検証で前進する。

## やってはいけないこと

- **虚栄指標を NSM にする**(累計登録数 / PV)→ 価値・継続と相関する指標に
- KPI を増やしすぎる → NSM 1 + ツリーの主要数個に絞る
- ガードレールを置かない → 片方を上げて全体が悪化する事故を防ぐ
- 計測できない指標を置く → analytics-events で測れる粒度に落とす

## 周辺

- `target-definition`: 「誰の何の価値か」が NSM 選定の前提
- `analytics-events`: ここの KPI を計測イベントに落とす(下流)
- `experiment-plan`: 成功指標 / ガードレールにこのツリーを使う(下流)
- `pitch-review`: 「KPI / コンバージョンが想像できるか」の裏付け
