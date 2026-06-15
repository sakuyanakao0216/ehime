/**
 * スポーツ情報ハブ（フック）のモックデータ。
 * 今日/今週末/今月のイベントを「観戦・地域・学校」横断で集約し、リスト＆（簡易）地図で見せる。
 * 割引特典で「使わない理由をなくす」。利用＝スポーツ嗜好データの源泉。
 */
import { cityById } from './data'

export type EventCategory = 'プロ観戦' | '地域' | '学校'
export type EventWhen = '今日' | '今週末' | '今月'

export type SportEvent = {
  id: string
  title: string
  category: EventCategory
  /** Activity.id（種目） */
  activityId: string
  cityId: string
  venue: string
  when: EventWhen
  dateLabel: string
  /** 割引・特典（あれば） */
  perk?: string
  /** 参加/観戦のかんたんな価格表記 */
  price: string
}

/** 簡易地図用の市町ざっくり座標（0-100 キャンバス。愛媛を北東→南西に配置）。 */
export const cityCoords: Record<string, { x: number; y: number }> = {
  shikokuchuo: { x: 90, y: 16 },
  niihama: { x: 82, y: 24 },
  saijo: { x: 73, y: 30 },
  kamijima: { x: 68, y: 14 },
  imabari: { x: 60, y: 28 },
  toon: { x: 56, y: 42 },
  matsuyama: { x: 47, y: 46 },
  masaki: { x: 44, y: 51 },
  tobe: { x: 49, y: 55 },
  iyo: { x: 42, y: 57 },
  uchiko: { x: 40, y: 62 },
  ozu: { x: 35, y: 64 },
  yawatahama: { x: 27, y: 67 },
  seiyo: { x: 30, y: 73 },
  ikata: { x: 17, y: 63 },
  uwajima: { x: 22, y: 81 },
  ainan: { x: 15, y: 91 },
}

export const events: SportEvent[] = [
  {
    id: 'e01',
    title: '愛媛FC ホームゲーム vs 徳島',
    category: 'プロ観戦',
    activityId: 'soccer',
    cityId: 'matsuyama',
    venue: 'ニンジニアスタジアム',
    when: '今週末',
    dateLabel: '6/21 14:00',
    perk: 'アプリ提示で自由席20%OFF',
    price: '¥2,000〜',
  },
  {
    id: 'e02',
    title: '愛媛オレンジバイキングス 観戦DAY',
    category: 'プロ観戦',
    activityId: 'basketball',
    cityId: 'matsuyama',
    venue: '松山市総合コミュニティセンター',
    when: '今週末',
    dateLabel: '6/22 16:00',
    perk: '小中学生むけ体験ブースあり',
    price: '¥1,800〜',
  },
  {
    id: 'e03',
    title: '愛媛マンダリンパイレーツ 公式戦',
    category: 'プロ観戦',
    activityId: 'baseball',
    cityId: 'niihama',
    venue: '新居浜市営球場',
    when: '今月',
    dateLabel: '6/28 18:00',
    perk: 'アプリ会員ドリンク1杯無料',
    price: '¥1,500〜',
  },
  {
    id: 'e04',
    title: 'みんなのバスケ体験会（初心者歓迎）',
    category: '地域',
    activityId: 'basketball',
    cityId: 'imabari',
    venue: '今治市体育館',
    when: '今日',
    dateLabel: '本日 19:00',
    perk: '参加無料・道具レンタルあり',
    price: '無料',
  },
  {
    id: 'e05',
    title: '週末ランニングクラブ in 道後',
    category: '地域',
    activityId: 'track',
    cityId: 'matsuyama',
    venue: '道後公園',
    when: '今週末',
    dateLabel: '6/21 8:00',
    perk: '提携カフェ割引',
    price: '¥500',
  },
  {
    id: 'e06',
    title: '南予 卓球オープン大会（観覧自由）',
    category: '地域',
    activityId: 'tabletennis',
    cityId: 'uwajima',
    venue: '宇和島市総合体育館',
    when: '今月',
    dateLabel: '6/29 9:00',
    price: '観覧無料',
  },
  {
    id: 'e07',
    title: '城北中学校 吹奏楽 公開リハーサル',
    category: '学校',
    activityId: 'brass',
    cityId: 'uwajima',
    venue: '宇和島市立 城北中学校',
    when: '今週末',
    dateLabel: '6/22 13:00',
    perk: '地域の方の見学・応援歓迎',
    price: '無料',
  },
  {
    id: 'e08',
    title: '西条北中 バレー部 合同練習＆体験',
    category: '学校',
    activityId: 'volleyball',
    cityId: 'saijo',
    venue: '西条市立 西条北中学校',
    when: '今月',
    dateLabel: '6/27 16:00',
    perk: 'OB・OG・地域経験者の参加歓迎',
    price: '無料',
  },
  {
    id: 'e09',
    title: '愛南 ジュニア野球 体験デー',
    category: '学校',
    activityId: 'baseball',
    cityId: 'ainan',
    venue: '愛南町営グラウンド',
    when: '今月',
    dateLabel: '6/30 9:30',
    perk: '指導サポーター募集中',
    price: '無料',
  },
  {
    id: 'e10',
    title: '剣道 稽古会（見学・体験OK）',
    category: '地域',
    activityId: 'kendo',
    cityId: 'ozu',
    venue: '大洲市武道館',
    when: '今日',
    dateLabel: '本日 18:30',
    price: '無料',
  },
  {
    id: 'e11',
    title: 'スイミング記録会 観覧＆体験',
    category: '地域',
    activityId: 'swim',
    cityId: 'matsuyama',
    venue: '愛媛県総合運動公園プール',
    when: '今週末',
    dateLabel: '6/21 10:00',
    perk: 'アプリ提示で施設利用割引',
    price: '¥300',
  },
  {
    id: 'e12',
    title: '書道パフォーマンス発表会',
    category: '学校',
    activityId: 'calligraphy',
    cityId: 'yawatahama',
    venue: '八幡浜市文化会館',
    when: '今月',
    dateLabel: '6/28 14:00',
    price: '無料',
  },
]

export const eventsWithCoords = () =>
  events.map((e) => ({
    ...e,
    region: cityById(e.cityId)?.region ?? '中予',
    coord: cityCoords[e.cityId] ?? { x: 50, y: 50 },
    cityName: cityById(e.cityId)?.name ?? '',
  }))

export const categoryMeta: Record<EventCategory, { emoji: string; className: string }> = {
  プロ観戦: { emoji: '🏟️', className: 'bg-violet-100 text-violet-700' },
  地域: { emoji: '🤸', className: 'bg-emerald-100 text-emerald-700' },
  学校: { emoji: '🏫', className: 'bg-orange-100 text-orange-700' },
}

// ── つながりイベント（Wheel A: AI が組成する大人×学生×プロ）──────────
export type ConnectEvent = {
  id: string
  title: string
  activityId: string
  cityId: string
  /** 関わりの軽さ */
  level: 'ちょい手伝い' | '体験サポート' | '継続サポート'
  /** だれが集う */
  who: string
  dateLabel: string
  /** AIが提案した理由（嗜好データ×ニーズ） */
  aiReason: string
  /** 募集枠 */
  slots: number
  joined: number
}

export const connectEvents: ConnectEvent[] = [
  {
    id: 'c01',
    title: 'バスケ観戦好き集まれ！中学体験会のサポーター',
    activityId: 'basketball',
    cityId: 'matsuyama',
    level: 'ちょい手伝い',
    who: '社会人サポーター × 中学バスケ部 × オレンジバイキングスOB',
    dateLabel: '6/29(日) 午前',
    aiReason: 'あなたは観戦好き＆学生時代バスケ経験。まずは“球出し”だけのゆる参加でOK。',
    slots: 8,
    joined: 5,
  },
  {
    id: 'c02',
    title: 'ランニング好きと走る！陸上部 フォーム測定会',
    activityId: 'track',
    cityId: 'matsuyama',
    level: '体験サポート',
    who: '市民ランナー × 中学陸上部',
    dateLabel: '6/22(日) 朝',
    aiReason: '週末ランニングクラブの参加履歴から。タイム計測を手伝うだけ。',
    slots: 6,
    joined: 2,
  },
  {
    id: 'c03',
    title: '元吹奏楽部の大人と！南予の合同パート練習（オンライン可）',
    activityId: 'brass',
    cityId: 'uwajima',
    level: 'ちょい手伝い',
    who: '社会人経験者 × 南予の中学吹奏楽部',
    dateLabel: '6/27(金) 夜・オンライン',
    aiReason: '学生時代に吹奏楽の登録あり。画面ごしに音を聴いてアドバイスするだけ。',
    slots: 4,
    joined: 1,
  },
  {
    id: 'c04',
    title: '野球観戦仲間で、ジュニア体験デーの見守りサポート',
    activityId: 'baseball',
    cityId: 'ainan',
    level: 'ちょい手伝い',
    who: 'マンダリンパイレーツ観戦勢 × 愛南ジュニア',
    dateLabel: '6/30(月) 午前',
    aiReason: '観戦チェックインが多い野球ファンへ。安全見守りから関われます。',
    slots: 10,
    joined: 7,
  },
]
