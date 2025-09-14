# 数据库清理和导入优化指南

## 📋 概述

本指南介绍了两个新功能：
1. **数据库清理** - 删除状态为 `inactive` 的工具
2. **导入流程优化** - 在导入前检测网站有效性

## 🧹 数据库清理功能

### 命令列表

```bash
# 查看当前数据库统计信息
npm run cleanup-stats

# 预览要删除的工具（不会实际删除）
npm run cleanup-preview

# 执行实际清理（永久删除 inactive 工具）
npm run cleanup-inactive-tools
```

### 清理流程

1. **统计查看**: 首先运行 `npm run cleanup-stats` 查看当前数据库状态
2. **预览模式**: 运行 `npm run cleanup-preview` 预览要删除的工具
3. **执行清理**: 确认无误后运行 `npm run cleanup-inactive-tools` 执行删除

### 安全特性

- ✅ 预览模式确保安全
- ✅ 删除前3秒倒计时
- ✅ 详细的删除日志
- ✅ 完整的结果统计

### 输出示例

```
📊 当前数据库状态:
   总工具数: 162
   ✅ Active: 10
   ❌ Inactive: 152
   ⚪ 无状态: 0
   📊 活跃率: 6.2%
   📊 失效率: 93.8%

🎯 找到 152 个 inactive 工具:
   1. ChatGPT (chatgpt)
      网站: https://chat.openai.com
      状态: inactive
   ...

📊 清理结果:
✅ 成功删除: 150 个工具
❌ 删除失败: 2 个工具
📈 清理率: 98.7%
```

## 🌐 导入流程优化

### 新的导入命令

```bash
# 安全导入（带网站检测）- 推荐
npm run import-ai-collection-safe /path/to/ai-collection-repo

# 快速导入（跳过网站检测）
npm run import-ai-collection-fast /path/to/ai-collection-repo
```

### 导入流程

#### 安全导入模式（推荐）

1. **解析YAML文件** - 从AI Collection仓库解析工具数据
2. **网站有效性检测** - 逐一检测每个工具的网站
3. **数据库保存** - 只保存通过检测的工具

#### 快速导入模式

1. **解析YAML文件** - 从AI Collection仓库解析工具数据
2. **直接保存** - 跳过网站检测，直接保存到数据库

### 网站检测规则

#### ✅ 认为有效的情况
- HTTP 200-299（正常响应）
- HTTP 300-399（重定向）
- HTTP 403（被反爬虫保护，但网站存在）

#### ❌ 认为无效的情况
- HTTP 404（页面不存在）
- HTTP 500+（服务器错误）
- 网络超时（8秒）
- 连接失败
- 域名不存在

### 检测配置

```typescript
const CHECK_CONFIG = {
  TIMEOUT: 8000,        // 8秒超时
  MAX_RETRIES: 1,       // 重试1次
  USER_AGENT: '...'     // 真实浏览器UA
}
```

### 输出示例

```
🚀 开始AI工具导入流程（带死链检测）...

📁 找到 150 个YAML文件

✅ 解析完成，找到 500 个工具

🌐 第二阶段：检测网站有效性...
⏱️  预计需要时间: 7 分钟

🔍 [1/500] 检测: ChatGPT
   网站: https://chat.openai.com
   ❌ 无效: 连接被重置

🔍 [2/500] 检测: GitHub Copilot
   网站: https://github.com/features/copilot
   ✅ 有效 (200)

📊 网站检测结果:
   ✅ 有效: 320 个
   ❌ 无效: 180 个
   📈 有效率: 64.0%

💾 第三阶段：保存到数据库...
   ✅ 成功保存: 315 个工具
   ❌ 保存失败: 5 个工具
   📈 保存率: 98.4%

📄 导入报告已生成: import-report.json
🎉 AI工具导入流程完成！
```

## 📄 报告文件

### 导入报告 (import-report.json)

```json
{
  "generatedAt": "2025-01-10T10:30:00.000Z",
  "totalParsed": 500,
  "validTools": 320,
  "invalidTools": 180,
  "validityRate": "64.00%",
  "websiteCheckEnabled": true,
  "invalidToolsDetails": [
    {
      "name": "ChatGPT",
      "website": "https://chat.openai.com",
      "reason": "连接被重置"
    }
  ],
  "errors": []
}
```

### 死链报告 (dead_links.json)

由 `npm run check-dead-links` 生成，包含所有失效工具的详细信息。

## 🔄 完整工作流程

### 建议的数据维护流程

1. **定期死链检测**
   ```bash
   npm run check-dead-links
   ```

2. **查看数据库状态**
   ```bash
   npm run cleanup-stats
   ```

3. **清理失效工具**
   ```bash
   npm run cleanup-preview  # 预览
   npm run cleanup-inactive-tools  # 执行
   ```

4. **导入新工具**
   ```bash
   npm run import-ai-collection-safe /path/to/repo
   ```

### 最佳实践

1. **定期维护**: 建议每周运行一次死链检测
2. **谨慎清理**: 清理前先运行预览模式
3. **安全导入**: 新数据导入时使用安全模式
4. **备份数据**: 清理前建议备份数据库

## 🛠️ 故障排除

### 常见问题

1. **权限错误**: 确保Supabase数据库已添加status字段
2. **网络超时**: 可以调整CHECK_CONFIG.TIMEOUT
3. **导入失败**: 检查AI Collection仓库路径是否正确

### 环境要求

- Node.js 18+
- 已配置的 `.env.local` 文件
- Supabase数据库已运行 `add_status_column.sql`

## 📊 性能说明

- **死链检测**: 每个网站约8秒，162个工具约22分钟
- **导入检测**: 每个网站约8秒，500个工具约67分钟
- **数据库清理**: 每个工具约0.1秒，瞬间完成

建议在低峰期运行长时间任务。
