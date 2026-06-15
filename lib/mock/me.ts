/**
 * マイスポーツ（利用者プロフィール）のモック。
 * スポーツ好きの大人が、アプリ利用を通じて「関わりの階段」を一段ずつ上がるイメージ。
 */

/** 関わりの階段（Wheel A の中核コンセプト） */
export const stairway = [
  { key: 'watch', emoji: '👀', label: '観る', desc: 'イベントを見る・観戦する' },
  { key: 'join', emoji: '🙋', label: '参加する', desc: '体験イベントに参加' },
  { key: 'help', emoji: '🤝', label: 'ちょい手伝い', desc: '球出し・計測などをサポート' },
  { key: 'support', emoji: '🌱', label: '継続サポート', desc: '定期的に練習を手伝う' },
  { key: 'coach', emoji: '⭐', label: '指導者', desc: 'チームの指導者として活動' },
] as const

export type StairKey = (typeof stairway)[number]['key']

export const me = {
  name: 'あなた',
  initial: 'Y',
  /** いまの階段（0始まり: 2 = ちょい手伝い手前/参加者） */
  currentStep: 2,
  /** 次の段への進捗 % */
  progressToNext: 40,
  points: 320,
  /** 登録時＋行動から推定した好き・得意 */
  favoriteSports: ['basketball', 'track', 'brass'],
  sportsHistory: '学生時代にバスケ部（3年）。社会人になってからは観戦＆週末ラン。',
  stats: {
    watched: 12, // 観戦・閲覧したイベント
    joined: 3, // 参加した体験イベント
    helped: 1, // 手伝ったイベント
  },
  /** 直近の行動（データ取得の可視化） */
  recentActivity: [
    { emoji: '🏀', text: '愛媛オレンジバイキングス戦をチェックイン', when: '3日前' },
    { emoji: '🏃', text: '週末ランニングクラブに参加', when: '先週' },
    { emoji: '🎺', text: '吹奏楽の公開リハをお気に入り登録', when: '先週' },
  ],
  /** 使える特典 */
  perks: [
    { emoji: '🎟️', text: '愛媛FC 自由席 20%OFF' },
    { emoji: '🥤', text: '観戦時ドリンク1杯無料' },
  ],
  /** ロイヤリティ（再訪を促す仕掛け） */
  loyalty: {
    tier: 'シルバー',
    nextTier: 'ゴールド',
    /** 次ランクまでの進捗 % */
    tierProgress: 64,
    /** 次ランクまでの残りポイント */
    toNextPoints: 180,
    /** 連続活動週 */
    streakWeeks: 5,
  },
  /** ミッション（達成でポイント） */
  missions: [
    { label: '今月イベントに2回参加', current: 1, goal: 2, reward: 50 },
    { label: 'ちがう種目に1回参加', current: 0, goal: 1, reward: 30 },
    { label: 'ちょい手伝いを1回', current: 0, goal: 1, reward: 80 },
  ],
}
