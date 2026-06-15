import { redirect } from 'next/navigation'

// 指導者候補のマイページは「マイスポーツ」(/me) に統合した。
export default function InstructorRedirect() {
  redirect('/me')
}
