/**
 * 情報共有（学校・クラブ・生徒・保護者）のモックデータ。
 * お知らせ／予定／出欠／連絡 をひとつのボードで共有する想定。
 */

export type Audience = '保護者' | '生徒' | '指導者' | '全員'

export type Announcement = {
  id: string
  title: string
  body: string
  from: string
  audience: Audience
  when: string
  readRate: number
  urgent?: boolean
}

export type ScheduleItem = {
  id: string
  date: string
  title: string
  place: string
  kind: '練習' | '大会' | '送迎' | 'イベント'
  note?: string
}

export type AttendanceEvent = {
  id: string
  title: string
  date: string
  going: number
  notGoing: number
  pending: number
}

export type ShareMessage = {
  id: string
  from: string
  role: Audience
  text: string
  when: string
}

export const announcements: Announcement[] = [
  {
    id: 'an1',
    title: '【重要】明日の練習は雨天中止',
    body: '天候悪化のため、明日の朝練は中止します。各自ストレッチのみお願いします。',
    from: '城北中 吹奏楽部 顧問',
    audience: '全員',
    when: '1時間前',
    readRate: 62,
    urgent: true,
  },
  {
    id: 'an2',
    title: '定期演奏会のご案内（保護者向け）',
    body: '7/28(日) 14:00 市民会館。座席整理券は来週配布します。送迎の調整にご協力ください。',
    from: '城北中 吹奏楽部',
    audience: '保護者',
    when: '昨日',
    readRate: 81,
  },
  {
    id: 'an3',
    title: 'オンライン指導の体験日程',
    body: 'マッチした指導者によるパート練（オンライン）を今週木曜に実施します。',
    from: 'コーディネーター',
    audience: '生徒',
    when: '2日前',
    readRate: 74,
  },
]

export const schedule: ScheduleItem[] = [
  { id: 'sc1', date: '6/20(金) 16:30', title: 'パート練習', place: '音楽室', kind: '練習' },
  {
    id: 'sc2',
    date: '6/22(日) 9:00',
    title: '合同練習（近隣中×地域楽団）',
    place: '大洲市民会館',
    kind: 'イベント',
    note: '送迎当番: A班',
  },
  { id: 'sc3', date: '6/28(土) 13:00', title: '県大会 予選', place: '県民文化会館', kind: '大会' },
]

export const attendance: AttendanceEvent = {
  id: 'at1',
  title: '6/22 合同練習の出欠',
  date: '6/22(日) 9:00',
  going: 18,
  notGoing: 3,
  pending: 7,
}

export const shareMessages: ShareMessage[] = [
  {
    id: 'm1',
    from: '保護者(田中)',
    role: '保護者',
    text: '送迎は何時に集合でしょうか？',
    when: '30分前',
  },
  {
    id: 'm2',
    from: '顧問',
    role: '指導者',
    text: '8:30に学校集合でお願いします。',
    when: '25分前',
  },
  {
    id: 'm3',
    from: '生徒(さき)',
    role: '生徒',
    text: '楽譜を忘れたら共有できますか？',
    when: '10分前',
  },
]
