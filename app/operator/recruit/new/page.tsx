import { redirect } from 'next/navigation'

// 募集作成は募集ダッシュボード(/operator)の「AI検索」に統合した。
export default function RecruitNewRedirect() {
  redirect('/operator')
}
