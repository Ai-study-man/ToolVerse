# Cloudflare Pages 404 错误修复指南

## 🔍 问题诊断

您遇到的 404 错误可能由以下原因造成：

### 1. 域名DNS配置问题
- DNS记录未正确指向Cloudflare Pages
- DNS传播未完成（需要24-48小时）

### 2. Cloudflare Pages构建失败
- Next.js构建配置不正确
- 环境变量缺失导致构建失败

### 3. 自定义域名配置问题
- 域名未正确绑定到Cloudflare Pages项目
- SSL证书未正确生成

## 🛠️ 修复步骤

### 步骤一：检查Cloudflare Pages构建状态

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** > 选择您的项目
3. 查看 **部署历史**，确认最新部署是否成功
4. 如果构建失败，查看构建日志

### 步骤二：修复构建配置

如果构建失败，请确保以下配置正确：

**Framework preset**: Next.js (Static HTML Export)
**Build command**: `npm run build`
**Build output directory**: `out`
**Root directory**: `/`
**Node.js version**: 18.x

### 步骤三：检查域名配置

1. 在Cloudflare Pages项目中：
   - 进入 **自定义域名** 标签
   - 确认 `toolsverse.tools` 已添加并显示 "Active"
   - 确认 SSL 证书状态为 "Active"

2. 在Cloudflare DNS管理中：
   - 确认有正确的 CNAME 记录指向您的 Pages 项目
   - 格式应为：`toolsverse.tools` CNAME `your-project.pages.dev`

### 步骤四：更新Next.js配置支持静态导出

由于Cloudflare Pages最好支持静态站点，我们需要更新配置：

## 🔧 必需的配置更改

### 1. 更新 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态导出
  trailingSlash: true, // 添加尾部斜杠
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true, // 静态导出需要
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
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

### 2. 更新 package.json 构建脚本

```json
{
  "scripts": {
    "build": "next build",
    "build:static": "next build && next export",
    "export": "next export"
  }
}
```

### 3. 创建 .nojekyll 文件

在 public 目录下创建 `.nojekyll` 文件（空文件）以避免GitHub Pages相关问题。

## 🚀 重新部署步骤

1. **更新代码配置**（执行上述配置更改）
2. **提交到GitHub**：
   ```bash
   git add .
   git commit -m "fix: update config for cloudflare pages deployment"
   git push origin main
   ```
3. **触发重新部署**：在Cloudflare Pages中点击 "重试部署"
4. **等待构建完成**：监控构建日志确保成功

## 🔍 验证清单

### DNS检查
- [ ] 使用 [DNS Checker](https://dnschecker.org) 验证 `toolsverse.tools` 解析
- [ ] 确认解析到正确的Cloudflare IP

### Cloudflare Pages检查
- [ ] 构建状态显示 "Success"
- [ ] 自定义域名状态显示 "Active"
- [ ] SSL证书状态显示 "Active"

### 网站功能检查
- [ ] 首页正常加载
- [ ] 搜索功能正常
- [ ] 工具卡片正常显示
- [ ] 分类筛选正常

## 🆘 紧急备用方案

如果上述方法仍然无效，可以：

1. **使用 Vercel 部署**（备用托管平台）
2. **暂时使用 Cloudflare Pages 的默认域名**：`your-project.pages.dev`
3. **检查 Spaceship 域名配置**：确认DNS服务器正确设置为Cloudflare

## 📞 进一步支持

如果问题持续存在，请提供：
1. Cloudflare Pages 构建日志
2. DNS解析结果截图
3. Cloudflare Pages项目配置截图

我会帮您进一步诊断具体问题。
