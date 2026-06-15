/**
 * 広域連携システムのドメイン型（モック）。
 * 社会実装フェーズでは firebase-backend 等の実スキーマに置き換える前提。
 */

/** 愛媛の地域区分 */
export type Region = '東予' | '中予' | '南予'

/** 種目の分類 */
export type ActivityKind = '運動部' | '文化部'

export type Activity = {
  id: string
  name: string
  kind: ActivityKind
  /** lucide アイコン名（components 側で解決） */
  icon: string
}

export type City = {
  id: string
  name: string
  region: Region
}

/** 曜日 */
export type Weekday = '月' | '火' | '水' | '木' | '金' | '土' | '日'

/** 指導者の貢献バッジ */
export type Badge = {
  label: string
  /** badge variant に対応 */
  tone: 'primary' | 'success' | 'info' | 'warning' | 'accent'
}

/** 感謝の声（信頼レイヤー・活性化の核） */
export type ThanksVoice = {
  from: string
  body: string
}

export type Instructor = {
  id: string
  name: string
  /** 居住市町 */
  cityId: string
  region: Region
  /** 専門種目（Activity.id） */
  specialties: string[]
  /** 保有資格 */
  qualifications: string[]
  /** 県の研修を修了しているか（信頼レイヤー） */
  trainingCompleted: boolean
  /** 指導歴（年） */
  yearsExperience: number
  /** オンライン指導に対応できるか */
  onlineAvailable: boolean
  /** 活動できる曜日 */
  availableDays: Weekday[]
  /** 感謝された回数 */
  thanksCount: number
  /** これまで関わった学校・クラブ数 */
  schoolsSupported: number
  /** 5段階評価 */
  rating: number
  thanksVoices: ThanksVoice[]
  badges: Badge[]
  /** 肩書き・一言 */
  headline: string
  bio: string
}

export type Recruitment = {
  id: string
  /** 学校・クラブ名 */
  org: string
  cityId: string
  region: Region
  /** 募集種目（Activity.id） */
  activityId: string
  /** 必要な曜日 */
  requiredDays: Weekday[]
  /** オンライン指導でも可か */
  onlineOk: boolean
  /** 求めるレベル */
  level: '初心者歓迎' | '基礎指導' | '競技志向'
  /** 緊急度 */
  urgency: '通常' | '急募'
  /** 背景・困りごと */
  background: string
  status: '募集中' | 'マッチ成立'
}

export type FeedKind = 'match' | 'thanks' | 'training' | 'join'

export type FeedItem = {
  id: string
  kind: FeedKind
  region: Region
  body: string
  /** 何分前か（相対表記） */
  minutesAgo: number
}

/** 地域別の盛り上がり統計（メーター用） */
export type RegionStat = {
  region: Region
  recruitments: number
  instructors: number
  /** 充足率 0-100 */
  fillRate: number
  /** 直近30日のマッチ成立数 */
  recentMatches: number
}
