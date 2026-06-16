/**
 * 関連 SNS 投稿（X / Instagram）のモック。
 * 実在アカウント・実在ドメインは使わない（架空ハンドル／プラットフォームのトップへのリンク）。
 */
export type SocialPost = {
  id: string
  platform: 'x' | 'instagram'
  author: string
  handle: string
  text: string
  when: string
  url: string
}

export const socialPosts: SocialPost[] = [
  {
    id: 's1',
    platform: 'x',
    author: 'みかん観戦部',
    handle: '@mikan_kansen',
    text: '今週末の3×3バスケ、あと数人で開催決定らしい！松山勢いこ〜 #スポえひめ',
    when: '2時間前',
    url: 'https://x.com',
  },
  {
    id: 's2',
    platform: 'instagram',
    author: 'ehime_run_club',
    handle: '@ehime_run_club',
    text: '週末ランニングクラブ、海沿いコース最高でした🏃‍♀️ 次回は南予遠征！',
    when: '5時間前',
    url: 'https://www.instagram.com',
  },
  {
    id: 's3',
    platform: 'x',
    author: '吹奏楽サポーターズ',
    handle: '@brass_ehime',
    text: 'オンライン指導でパート練がぐっと良くなった。距離は言い訳にならないね🎺',
    when: '昨日',
    url: 'https://x.com',
  },
  {
    id: 's4',
    platform: 'instagram',
    author: 'orange_supporters',
    handle: '@orange_supporters',
    text: 'みんなで観戦からの、ちょい手伝いデビュー。気軽に関われるの良き👏',
    when: '2日前',
    url: 'https://www.instagram.com',
  },
]
