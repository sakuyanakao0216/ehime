/**
 * 魅力向上用の画像を Vertex AI (Imagen) で直接生成し public/images/generated/ に保存する。
 * Vercel AI Gateway を経由しない（ゲートウェイはカード必須のため）。認証は gcloud のアクセストークン。
 *
 * 前提: gcloud にログイン済み（`gcloud auth print-access-token` が通る）／対象プロジェクトで
 *       aiplatform.googleapis.com が有効。
 * 実行:
 *   node scripts/gen-images.mjs
 *   （project/location/model は GOOGLE_VERTEX_PROJECT / GOOGLE_VERTEX_LOCATION / AI_IMAGE_MODEL で上書き可）
 *
 * 商標・ロゴ・実在人物の顔は出さない（シルエット/後ろ姿・テキストなし・成人）プロンプトにしている。
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const OUT = 'public/images/generated'
const PROJECT = process.env.GOOGLE_VERTEX_PROJECT ?? 'hoikuenai'
const LOCATION = process.env.GOOGLE_VERTEX_LOCATION ?? 'us-central1'
const MODEL = process.env.AI_IMAGE_MODEL ?? 'imagen-3.0-generate-002'

const token = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim()
const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`

const NO_TEXT =
  'No text, no letters, no logos, no brand marks, no recognizable faces. Editorial, premium, hopeful mood, warm mikan-orange golden-hour light. Adults only, silhouettes and back views.'

const SPECS = [
  {
    key: 'map',
    aspectRatio: '4:3',
    prompt: `Stylized illustrated top-down map of a long horizontal Japanese coastal prefecture with soft warm mikan-orange and cream tones, gentle hills, coastline and small islands, subtle sport motifs (a tiny stadium, a running path, a music note, a ball) dotted across regions, flat modern editorial illustration, soft paper texture. No text, no labels, no logos.`,
  },
  {
    key: 'hero',
    aspectRatio: '16:9',
    prompt: `Wide cinematic photo collage evoking community sports across a Japanese seaside prefecture. Diverse adults: a cheering stadium crowd, a runner on a coastal path, a brass band practicing, people playing basketball in a gym. ${NO_TEXT}`,
  },
  {
    key: 'kansen',
    aspectRatio: '1:1',
    prompt: `Atmospheric photo of a lively local sports stadium crowd of adults cheering, shot from behind the crowd, motion and energy, warm orange tones. ${NO_TEXT}`,
  },
  {
    key: 'chiiki',
    aspectRatio: '1:1',
    prompt: `Warm editorial photo of adults jogging together along a Japanese coastal park path at sunrise, candid back view, soft orange morning light. ${NO_TEXT}`,
  },
  {
    key: 'gakko',
    aspectRatio: '1:1',
    prompt: `Soft natural-light photo of a brass band of adults practicing in a gymnasium with instruments and music stands, candid back view, warm tones. ${NO_TEXT}`,
  },
  {
    key: 'collab',
    aspectRatio: '1:1',
    prompt: `Editorial photo of an adult basketball practice in a gym, candid, motion, warm light. ${NO_TEXT}`,
  },
  {
    key: 'school',
    aspectRatio: '16:9',
    prompt: `Stylized exterior of a modest Japanese public junior-high school building with a sports ground and trees, warm afternoon light, calm editorial photo. No people. ${NO_TEXT}`,
  },
  {
    key: 'mypage',
    aspectRatio: '16:9',
    prompt: `Warm sports lifestyle flat-lay on a wooden table: running shoes, a water bottle, a stopwatch and an event ticket stub, soft mikan-orange morning light, editorial. No people. ${NO_TEXT}`,
  },
  {
    key: 'coach',
    aspectRatio: '1:1',
    prompt: `An adult sports coach guiding a practice, seen from behind, warm gym light, candid, motion. ${NO_TEXT}`,
  },
  {
    key: 'soccer',
    aspectRatio: '1:1',
    prompt: `Adults playing soccer on a community pitch at golden hour, back views and silhouettes, warm tones. ${NO_TEXT}`,
  },
  {
    key: 'baseball',
    aspectRatio: '1:1',
    prompt: `Amateur baseball practice on a local ground at golden hour, back view, warm tones. ${NO_TEXT}`,
  },
  {
    key: 'volleyball',
    aspectRatio: '1:1',
    prompt: `Indoor volleyball practice in a gym, adults, motion, warm light, back view. ${NO_TEXT}`,
  },
]

await mkdir(OUT, { recursive: true })
console.log(`vertex: ${PROJECT}/${LOCATION} model=${MODEL}`)

const FORCE = process.argv.includes('--force')
let ok = 0
let generated = 0
for (const s of SPECS) {
  const dest = `${OUT}/${s.key}.png`
  if (!FORCE && existsSync(dest)) {
    ok++
    console.log(`• ${s.key}.png (既存・スキップ)`)
    continue
  }
  // 1分あたりのクォータ回避: 2件目以降は間隔を空ける
  if (generated > 0) await sleep(35000)
  generated++
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: s.prompt }],
        parameters: { sampleCount: 1, aspectRatio: s.aspectRatio, personGeneration: 'allow_adult' },
      }),
    })
    if (!res.ok) {
      console.error(`✗ ${s.key}: HTTP ${res.status} ${(await res.text()).slice(0, 180)}`)
      continue
    }
    const json = await res.json()
    const b64 = json?.predictions?.[0]?.bytesBase64Encoded
    if (!b64) {
      console.error(`✗ ${s.key}: no image ${JSON.stringify(json).slice(0, 180)}`)
      continue
    }
    await writeFile(`${OUT}/${s.key}.png`, Buffer.from(b64, 'base64'))
    ok++
    console.log(`✓ ${s.key}.png`)
  } catch (e) {
    console.error(`✗ ${s.key}: ${e?.message ?? e}`)
  }
}
console.log(`done: ${ok}/${SPECS.length}`)
