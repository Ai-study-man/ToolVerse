/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 添加对不同格式的支持
    formats: ['image/webp', 'image/avif'],
    // 允许的域名
    domains: [],
    // 图片加载器配置
    loader: 'default',
    // 禁用对Data URL的优化处理
    minimumCacheTTL: 60,
  },
  reactStrictMode: true,
  // 性能优化
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // 构建优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
