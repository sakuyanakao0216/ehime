/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  // プロト前提の割り切り（本番リリース時に見直す。AGENTS.md 参照）
  typescript: {
    ignoreBuildErrors: true,
  },
  // 外部画像 URL を使う場合は image-gen 利用時に remotePatterns を追記する
  images: {
    unoptimized: true,
  },
  // セキュリティヘッダの最小セット。CSP はプロト段階では見送り
  // (外部リソースの足し引きが激しい時期は管理コストが見合わない。本番リリース時に検討)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
