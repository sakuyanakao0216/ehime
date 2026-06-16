import { RoleBanner } from '@/components/blocks/role-banner'
import { ShareBoard } from '@/components/blocks/share-board'

export default function SharePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <RoleBanner
        roleLabel="情報共有 ・ 学校・クラブ・生徒・保護者"
        description="お知らせ・予定・出欠・連絡をひとつのボードで共有します。"
      />
      <ShareBoard />
    </main>
  )
}
