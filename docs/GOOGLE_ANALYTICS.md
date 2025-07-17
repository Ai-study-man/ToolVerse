# Google Analytics 配置

## 概述
本项目已集成 Google Analytics 4 (GA4) 用于网站访问数据追踪。

## 配置文件
- **组件**: `src/components/GoogleAnalytics.tsx`
- **集成位置**: `src/app/layout.tsx`
- **环境变量**: `.env.local` 中的 `NEXT_PUBLIC_GA_ID`

## 当前配置
- **GA ID**: G-TTK01C8NN5
- **加载策略**: afterInteractive (在页面交互准备好后加载)
- **作用范围**: 全站所有页面

## 使用的技术
- **Next.js Script组件**: 优化的脚本加载
- **客户端组件**: 使用 'use client' 指令
- **环境变量**: 支持不同环境使用不同GA ID

## 功能特性
- ✅ 自动页面访问追踪
- ✅ 优化的脚本加载性能
- ✅ 符合现代网页性能最佳实践
- ✅ 支持服务端渲染 (SSR)
- ✅ 条件加载 (仅在设置GA ID时加载)

## 验证方法
1. 打开浏览器开发者工具
2. 在Network标签中查看是否加载了gtag.js
3. 在Console中输入 `gtag` 查看函数是否可用
4. 在GA4控制台的实时报告中查看数据

## 注意事项
- Google Analytics脚本仅在生产环境和设置了NEXT_PUBLIC_GA_ID时加载
- 使用了Next.js推荐的Script组件以获得最佳性能
- 遵循了Google官方的安装指南
