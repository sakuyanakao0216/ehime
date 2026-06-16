import { HomeBoard } from '@/components/blocks/home-board'
import { SocialFeed } from '@/components/blocks/social-feed'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24">
      <HomeBoard />

      {/* 関連 SNS */}
      <section className="reveal mt-20">
        <SocialFeed />
      </section>
    </main>
  )
}
