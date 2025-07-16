/** @type {import('next').NextConfig} */
const nextConfig = {
  // 暂时禁用静态导出，先让构建通过
  // output: 'export', 
  trailingSlash: true,
  images: {
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
