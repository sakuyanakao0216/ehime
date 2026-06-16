/**
 * スポーツハイライト（直近の出来事・ニュース）のモック。
 * トップで「いま愛媛のスポーツで何が起きているか」を一望する。
 */
export type Highlight = {
  id: string
  kind: '結果' | '成立' | 'マッチ' | 'ニュース'
  emoji: string
  text: string
  when: string
}

export const highlights: Highlight[] = [
  {
    id: 'h1',
    kind: '結果',
    emoji: '⚽',
    text: '愛媛FC、ホームで快勝。観戦からの“ちょい手伝い”参加が過去最多に',
    when: '1日前',
  },
  {
    id: 'h2',
    kind: '成立',
    emoji: '🏀',
    text: '松山の3×3交流イベントが開催ライン到達。学生×社会人×プロで成立',
    when: '2日前',
  },
  {
    id: 'h3',
    kind: 'マッチ',
    emoji: '🎺',
    text: '宇和島の吹奏楽部に、オンライン指導者がマッチ',
    when: '3日前',
  },
  {
    id: 'h4',
    kind: 'ニュース',
    emoji: '🏃',
    text: '南予 合同陸上記録会、3校合同で実施へ前進',
    when: '4日前',
  },
  {
    id: 'h5',
    kind: 'ニュース',
    emoji: '📣',
    text: '部活動改革「実行期」入り。地域×学校の連携事例が県内で拡大',
    when: '今週',
  },
]
