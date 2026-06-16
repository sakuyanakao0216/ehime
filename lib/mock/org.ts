/**
 * ログイン中の募集側組織（自分の組織）のモック。
 * デモの主役 r01（宇和島市立 城北中学校 吹奏楽部）の学校に揃える。
 */
import type { Region } from './types'

export type CertStatus = '未申請' | '申請中' | '認定済'

export type MyOrg = {
  name: string
  shortName: string
  type: string
  cityId: string
  region: Region
  /** 主な部活（activity id） */
  activities: string[]
  /** 募集中の件数 */
  activeRecruitments: number
  /** マッチ成立の件数 */
  matched: number
  contact: string
  note: string
  /** 地域クラブ認定の状態 */
  certStatus: CertStatus
}

/** 活動的な組織（よく関わり・成立させている学校/クラブ）のピックアップ。 */
export type ActiveOrg = {
  id: string
  name: string
  region: Region
  activityId: string
  note: string
  recentMatches: number
}

export const activeOrgs: ActiveOrg[] = [
  {
    id: 'ao1',
    name: '松山市立 道後中学校 卓球部',
    region: '中予',
    activityId: 'tabletennis',
    note: '相談から成立までが早い',
    recentMatches: 5,
  },
  {
    id: 'ao2',
    name: '今治市立 北郷中学校 サッカー部',
    region: '東予',
    activityId: 'soccer',
    note: 'コラボ常連',
    recentMatches: 3,
  },
  {
    id: 'ao3',
    name: '宇和島市立 城北中学校 吹奏楽部',
    region: '南予',
    activityId: 'brass',
    note: 'オンライン指導を活用',
    recentMatches: 2,
  },
]

export const myOrg: MyOrg = {
  name: '宇和島市立 城北中学校',
  shortName: '城北中',
  type: '公立中学校',
  cityId: 'uwajima',
  region: '南予',
  activities: ['brass', 'baseball', 'track'],
  activeRecruitments: 2,
  matched: 1,
  contact: '担当: 教頭・部活動指導員 窓口',
  note: '吹奏楽の専門指導者を急募中（オンライン可）。',
  certStatus: '未申請',
}
