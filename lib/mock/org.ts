/**
 * ログイン中の募集側組織（自分の組織）のモック。
 * デモの主役 r01（宇和島市立 城北中学校 吹奏楽部）の学校に揃える。
 */
import type { Region } from './types'

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
}

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
}
