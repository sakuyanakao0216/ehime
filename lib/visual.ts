/**
 * 見た目の楽しさ用ヘルパー（絵文字・カラフルなグラデーション）。
 * 種目ごとに絵文字と色を割り当て、味気ない掲示板感を払拭する。
 */

/** 種目 id → 絵文字 */
export const activityEmoji: Record<string, string> = {
  baseball: '⚾',
  soccer: '⚽',
  basketball: '🏀',
  volleyball: '🏐',
  track: '🏃',
  kendo: '🤺',
  tabletennis: '🏓',
  tennis: '🎾',
  swim: '🏊',
  brass: '🎺',
  calligraphy: '🖌️',
  art: '🎨',
  chorus: '🎤',
  science: '🔬',
}

/** 種目 id → tailwind グラデーション（タイル背景用） */
export const activityGradient: Record<string, string> = {
  baseball: 'from-orange-400 to-amber-500',
  soccer: 'from-emerald-400 to-teal-500',
  basketball: 'from-orange-500 to-red-500',
  volleyball: 'from-sky-400 to-blue-500',
  track: 'from-rose-400 to-pink-500',
  kendo: 'from-indigo-400 to-violet-500',
  tabletennis: 'from-cyan-400 to-sky-500',
  tennis: 'from-lime-400 to-green-500',
  swim: 'from-cyan-400 to-blue-500',
  brass: 'from-amber-400 to-orange-500',
  calligraphy: 'from-slate-500 to-zinc-600',
  art: 'from-fuchsia-400 to-purple-500',
  chorus: 'from-pink-400 to-rose-500',
  science: 'from-teal-400 to-cyan-500',
}

export const emojiFor = (id: string) => activityEmoji[id] ?? '🎯'
export const gradientFor = (id: string) => activityGradient[id] ?? 'from-primary to-orange-500'

/** 文字列から決定的にアバターのグラデーションを選ぶ（カラフルに） */
const avatarGradients = [
  'from-orange-400 to-rose-500',
  'from-amber-400 to-orange-600',
  'from-sky-400 to-indigo-500',
  'from-emerald-400 to-teal-600',
  'from-fuchsia-400 to-pink-600',
  'from-violet-400 to-purple-600',
  'from-cyan-400 to-blue-600',
  'from-lime-400 to-emerald-600',
]

export function avatarGradient(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return avatarGradients[h % avatarGradients.length]
}
