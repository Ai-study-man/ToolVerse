/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态导出 - Cloudflare Pages需要
  trailingSlash: true,
  images: {
    unoptimized: true, // 静态导出必须设置
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
