# Notion API 数据源配置指南

## 📋 概述

本指南将帮你设置 Notion 数据库作为 AI 工具导航站的数据源，实现内容的远程维护和自动更新。

## 🔧 第一步：创建 Notion 集成

### 1. 创建 Notion Integration

1. 访问 [Notion Developers](https://www.notion.so/my-integrations)
2. 点击 "Create new integration"
3. 填写基本信息：
   - Name: `ToolVerse API`
   - Associated workspace: 选择你的工作区
   - Type: Internal integration
4. 点击 "Submit"
5. 复制生成的 **Internal Integration Token**

### 2. 保存 API Token

将 token 添加到环境变量：

```env
NOTION_API_TOKEN=secret_xxxxxxxxxx
```

## 🗄️ 第二步：创建工具数据库

### 1. 创建新的 Notion 数据库

在 Notion 中创建一个新的数据库，命名为 "AI工具库"。

### 2. 配置数据库属性

按照以下结构设置数据库属性：

| 属性名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| **Name** | Title | 工具名称 | ChatGPT |
| **简介** | Text | 简短描述 | AI聊天助手，可以回答问题和协助创作 |
| **详细描述** | Text | 详细说明 | ChatGPT是OpenAI开发的大型语言模型... |
| **网址** | URL | 官方网站 | https://chat.openai.com |
| **标签** | Multi-select | 功能标签 | AI聊天, 文本生成, 助手 |
| **适用场景** | Multi-select | 使用场景 | 内容创作, 客服, 教育 |
| **价格模式** | Select | 价格类型 | free/freemium/paid/subscription |
| **具体价格** | Text | 价格详情 | 免费版有限制，Plus版$20/月 |
| **评分** | Number | 用户评分 | 4.5 |
| **评论数** | Number | 评论数量 | 1250 |
| **分类** | Select | 主要分类 | Writing & Content |
| **子分类** | Select | 子分类 | AI助手 |
| **功能特点** | Text | 功能列表 | - 支持多种语言\n- 上下文理解\n- 代码生成 |
| **官方Logo** | Files | Logo图片 | 上传或链接Logo |
| **状态** | Select | 发布状态 | Published/Draft/Archived |

### 3. 设置选项值

#### 价格模式 (Select)
- `free` - 完全免费
- `freemium` - 免费+付费版
- `paid` - 付费软件
- `subscription` - 订阅制

#### 分类 (Select)
- `Writing & Content` - 写作与内容
- `Design & Art` - 设计与艺术
- `Productivity` - 生产力工具
- `Business` - 商业工具
- `Developer Tools` - 开发工具
- `Data & Analytics` - 数据分析

#### 状态 (Select)
- `Published` - 已发布
- `Draft` - 草稿
- `Under Review` - 审核中
- `Archived` - 已归档

### 4. 示例数据记录

创建几条示例记录来测试：

**记录 1: ChatGPT**
- Name: `ChatGPT`
- 简介: `AI聊天助手，可以回答问题和协助创作`
- 详细描述: `ChatGPT是OpenAI开发的大型语言模型，能够进行自然语言对话，协助写作、编程、分析等多种任务。`
- 网址: `https://chat.openai.com`
- 标签: `AI聊天`, `文本生成`, `助手`
- 适用场景: `内容创作`, `客服`, `教育`
- 价格模式: `freemium`
- 具体价格: `免费版有限制，Plus版$20/月`
- 评分: `4.5`
- 评论数: `1250`
- 分类: `Writing & Content`
- 状态: `Published`

**记录 2: Midjourney**
- Name: `Midjourney`
- 简介: `AI图像生成工具，根据文字描述创建艺术作品`
- 网址: `https://midjourney.com`
- 标签: `AI绘画`, `图像生成`, `艺术创作`
- 价格模式: `subscription`
- 分类: `Design & Art`
- 状态: `Published`

## 🔗 第三步：连接数据库

### 1. 获取数据库ID

1. 打开你创建的 Notion 数据库
2. 复制页面URL中的数据库ID
3. URL格式: `https://notion.so/workspace/数据库ID?v=视图ID`
4. 数据库ID是32位字符串

### 2. 给集成授权访问

1. 在数据库页面点击右上角的 "Share"
2. 点击 "Invite"
3. 搜索并添加你创建的集成（ToolVerse API）
4. 确保权限设为 "Can edit"

### 3. 配置环境变量

```env
NOTION_API_TOKEN=secret_xxxxxxxxxx
NOTION_TOOLS_DATABASE_ID=你的数据库ID
```

## 🚀 第四步：测试连接

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 测试API接口

访问以下接口测试数据同步：

```bash
# 获取所有工具
curl http://localhost:3000/api/tools

# 获取分类
curl http://localhost:3000/api/categories

# 强制刷新数据
curl http://localhost:3000/api/tools?force=true

# 搜索工具
curl "http://localhost:3000/api/tools?search=ChatGPT"
```

## ⏰ 第五步：设置定时同步

### 1. 配置定时任务

已配置每天凌晨2点自动同步：

```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### 2. 设置安全密钥

```env
CRON_SECRET=your_random_secret_key_for_cron
MANUAL_SYNC_SECRET=your_manual_sync_secret
```

### 3. 手动触发同步

```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{"secret": "your_manual_sync_secret"}'
```

## 📊 数据管理最佳实践

### 1. 内容维护流程

1. **新增工具**: 在 Notion 数据库中创建新记录
2. **编辑信息**: 直接在 Notion 中修改工具信息
3. **状态管理**: 使用状态字段控制工具的发布状态
4. **批量操作**: 利用 Notion 的筛选和批量编辑功能

### 2. 内容质量控制

- **必填字段**: Name, 简介, 网址, 分类, 状态
- **图片规范**: Logo建议使用 64x64 像素，PNG或SVG格式
- **描述规范**: 简介控制在50字以内，详细描述200-500字
- **标签规范**: 每个工具3-5个标签，使用统一的标签体系

### 3. SEO优化

- **关键词优化**: 在简介和标签中包含相关关键词
- **内容丰富度**: 提供详细的功能描述和使用场景
- **定期更新**: 保持内容的时效性和准确性

## 🔧 故障排除

### 常见问题

1. **连接失败**
   - 检查 API Token 是否正确
   - 确认集成已被邀请到数据库
   - 验证数据库ID格式

2. **数据同步异常**
   - 检查 Notion 数据库字段名称是否匹配
   - 确认字段类型设置正确
   - 查看服务器日志错误信息

3. **性能问题**
   - Notion API 有请求频率限制
   - 使用本地缓存减少API调用
   - 考虑分页查询大量数据

### 调试技巧

1. **启用详细日志**
```env
NODE_ENV=development
```

2. **测试单个工具**
```bash
curl "http://localhost:3000/api/tools?search=工具名称"
```

3. **检查缓存状态**
```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{"action": "cache-info"}'
```

## 📈 扩展功能

### 1. 增加自定义字段

可以在 Notion 数据库中添加更多字段：

- **更新频率**: 工具更新频率
- **公司信息**: 开发公司
- **集成API**: 是否提供API
- **语言支持**: 支持的语言
- **平台支持**: 支持的操作系统

### 2. 高级筛选

利用 Notion API 的高级查询功能：

```javascript
// 按评分筛选
filter: {
  property: '评分',
  number: {
    greater_than: 4.0
  }
}

// 按更新时间筛选
filter: {
  property: '更新时间',
  last_edited_time: {
    after: '2024-01-01'
  }
}
```

### 3. 数据分析

基于 Notion 数据生成分析报告：

- 工具分类分布
- 价格模式统计
- 评分趋势分析
- 标签热度排行

通过这套系统，你可以完全在 Notion 中管理 AI 工具数据，实现内容的远程维护和自动更新！
