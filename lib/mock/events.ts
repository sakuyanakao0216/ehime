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
  /** AI のおすすめ（嗜好に合致）。UI に「おすすめ」マークを出す */
  recommended?: boolean
}

/** 愛媛県シルエット(viewBox 0 0 100 75)上の市町座標。x:0-100 / y:0-75。 */
export const cityCoords: Record<string, { x: number; y: number }> = {
  shikokuchuo: { x: 87, y: 22 },
  niihama: { x: 79, y: 23 },
  saijo: { x: 70, y: 26 },
  kamijima: { x: 64, y: 13 },
  imabari: { x: 59, y: 24 },
  toon: { x: 54, y: 30 },
  matsuyama: { x: 48, y: 32 },
  masaki: { x: 45, y: 35 },
  tobe: { x: 49, y: 37 },
  iyo: { x: 44, y: 38 },
  uchiko: { x: 41, y: 43 },
  ozu: { x: 36, y: 46 },
  yawatahama: { x: 27, y: 48 },
  ikata: { x: 15, y: 51 },
  seiyo: { x: 33, y: 53 },
  uwajima: { x: 28, y: 61 },
  ainan: { x: 23, y: 69 },
}

/** 愛媛県のスタイライズした輪郭（佐田岬半島を含む）。viewBox 0 0 100 75。 */
export const EHIME_PATH =
  'M96,22 L90,16 L83,19 L76,15 L69,19 L62,16 L57,20 L52,25 L48,29 L45,34 L43,39 L41,43 L33,45 L24,47 L15,49 L7,53 L4,55 L9,56 L18,53 L28,51 L37,49 L39,53 L36,58 L31,63 L26,68 L21,72 L27,65 L36,56 L46,47 L56,39 L66,33 L76,27 L86,22 Z'

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
    recommended: true,
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
    recommended: true,
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

// ── 交流イベント（トップバナー: AI が提案する 学生×社会人×プロ の混成イベント）──
export type ParticipantRole = '学生' | '社会人' | 'プロ'

export type CrossEvent = {
  id: string
  title: string
  activityId: string
  cityId: string
  dateLabel: string
  roles: ParticipantRole[]
  /** AI が提案した理由（嗜好・行動データ × 地域ニーズ） */
  aiReason: string
  /** 一言の見どころ */
  blurb: string
  capacity: number
  joined: number
  /** 開催が決まる人数ライン（これに達したら「開催決定」＝成立型） */
  minToOpen: number
}

export const crossEvents: CrossEvent[] = [
  {
    id: 'cx01',
    title: '3×3 バスケ交流会 — 中学生 × 社会人 × プロ選手',
    activityId: 'basketball',
    cityId: 'matsuyama',
    dateLabel: '6/29(日) 13:00',
    roles: ['学生', '社会人', 'プロ'],
    aiReason:
      'この地域は観戦データと「バスケ好き」の登録が多め。世代を超えて楽しめる場を AI が企画しました。',
    blurb: 'オレンジバイキングスの選手も参加。経験者も初心者も、混ざって楽しむ半日。',
    capacity: 40,
    joined: 29,
    minToOpen: 30,
  },
  {
    id: 'cx02',
    title: 'リレーマラソン＆ランニング教室 — みんなで走る',
    activityId: 'track',
    cityId: 'matsuyama',
    dateLabel: '6/22(日) 8:00',
    roles: ['学生', '社会人'],
    aiReason: '週末ランの参加履歴が多いエリア。市民ランナーと中高生がチームを組みます。',
    blurb: 'タイム計測のサポートに回るだけの参加もOK。走らなくても楽しめる。',
    capacity: 60,
    joined: 41,
    minToOpen: 30,
  },
  {
    id: 'cx03',
    title: '吹奏楽セッション — 学生 × 社会人OB × プロ奏者',
    activityId: 'brass',
    cityId: 'uwajima',
    dateLabel: '6/27(金) 18:30・オンライン可',
    roles: ['学生', '社会人', 'プロ'],
    aiReason: '南予は専門指導者が手薄。元吹奏楽部の社会人とプロ奏者を AI がオンラインで橋渡し。',
    blurb: '画面ごしの参加もOK。久しぶりに楽器を触る大人も歓迎。',
    capacity: 30,
    joined: 12,
    minToOpen: 20,
  },
]

// ── コラボイベント（募集側: 近くの学校・ジム・プロと AI が統合イベントを企画。成立型）──
export type CollabPartner = '学校' | 'ジム' | 'プロ'

export type CollabEvent = {
  id: string
  title: string
  activityId: string
  cityId: string
  dateLabel: string
  /** 時期フィルター用 */
  when?: EventWhen
  partners: CollabPartner[]
  /** 匿名のコラボ相手（実名は伏せる） */
  partnerLabel: string
  aiReason: string
  /** 賛同（参加表明）した団体・人数 */
  joined: number
  /** 実施が決まるライン */
  minToOpen: number
  /** AI のおすすめ。UI に「おすすめ」マークを出す */
  recommended?: boolean
}

export const collabEvents: CollabEvent[] = [
  {
    id: 'co01',
    title: '合同バスケ教室 — 近隣中学 × 地域ジム × プロコーチ',
    activityId: 'basketball',
    cityId: 'matsuyama',
    dateLabel: '7/6(日) 午前',
    when: '今週末',
    partners: ['学校', 'ジム', 'プロ'],
    partnerLabel: '近隣中学 B / 市内ジム C / プロクラブ D',
    aiReason:
      '半径10km に同種目の部活とジムが集中。単独では人数が足りないため AI が合同案を作成しました。',
    joined: 4,
    minToOpen: 6,
    recommended: true,
  },
  {
    id: 'co02',
    title: '南予 合同陸上記録会 — 3校合同 × 実業団ランナー',
    activityId: 'track',
    cityId: 'uwajima',
    dateLabel: '7/13(日) 午前',
    when: '今月',
    partners: ['学校', 'プロ'],
    partnerLabel: '南予の中学 3校 / 実業団 E',
    aiReason: '南予は1校ごとの部員が少なく大会が組みにくい。合同なら記録会が成立します。',
    joined: 2,
    minToOpen: 3,
  },
  {
    id: 'co03',
    title: '吹奏楽 合同パート練習 — 学校 × 地域楽団',
    activityId: 'brass',
    cityId: 'ozu',
    dateLabel: '7/5(土) 午後・オンライン併用',
    when: '今週末',
    partners: ['学校', 'プロ'],
    partnerLabel: '大洲の中学 / 地域楽団 F',
    aiReason: '専門パートの指導者が不足。地域楽団とのコラボで補い合えます。',
    joined: 3,
    minToOpen: 3,
  },
]

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
