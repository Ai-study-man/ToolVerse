# AI 工具爬虫使用指南

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
在 `.env.local` 文件中添加：
```env
# 可选：Product Hunt API Key
PRODUCT_HUNT_API_KEY=your_product_hunt_token

# 可选：OpenAI API Key (用于 GPT-4 优化)
OPENAI_API_KEY=your_openai_api_key

# 可选：ScraperAPI Key (提高爬取成功率)
SCRAPER_API_KEY=your_scraper_api_key
```

### 3. 运行爬虫
```bash
# 直接运行
npx ts-node src/scripts/aiToolsCrawler.ts

# 或添加到 package.json scripts
npm run crawl
```

## 📊 功能特性

### ✅ 多数据源支持
- **Futurepedia**: 最新 AI 工具发现平台
- **AI Tools Directory**: 综合 AI 工具目录
- **Product Hunt**: 新产品发布平台

### ✅ 智能数据处理
- **GPT-4 优化**: 自动优化描述和分类
- **标签提取**: 智能识别工具标签
- **用例识别**: 自动分析使用场景
- **定价检测**: 识别免费/付费/订阅模式

### ✅ 多格式输出
- **JSON 格式**: 结构化数据存储
- **CSV 格式**: 直接导入 Supabase
- **统计报告**: 详细的爬取统计信息

## 🔧 配置选项

```typescript
const config: CrawlerConfig = {
  maxTools: 50,              // 每次爬取的工具数量
  sources: [                 // 数据源选择
    'futurepedia',
    'aitoolsdirectory', 
    'producthunt'
  ],
  outputPath: 'data/crawled-tools.json',  // 输出文件路径
  enableGPTSummary: false    // 是否启用 GPT-4 优化
};
```

## 📈 数据格式

### 爬取的工具数据结构：
```typescript
interface CrawledTool {
  name: string;              // 工具名称
  description: string;       // 工具描述
  tags: string[];           // 功能标签
  link: string;             // 官方网址
  use_case: string[];       // 使用场景
  model_used?: string;      // 使用的 AI 模型
  pricing?: 'free' | 'freemium' | 'paid';  // 定价模式
  category?: string;        // 工具分类
  logo?: string;           // Logo URL
  rating?: number;         // 用户评分
  source: string;          // 数据来源
  crawled_at: string;      // 爬取时间
}
```

### 输出文件示例：
```json
{
  "crawled_at": "2024-01-15T10:30:00.000Z",
  "source_count": 3,
  "total_tools": 45,
  "tools": [
    {
      "name": "ChatGPT",
      "description": "Advanced AI chatbot for conversations and problem-solving",
      "tags": ["chatbot", "conversation", "writing"],
      "link": "https://chat.openai.com",
      "use_case": ["customer service", "content creation", "education"],
      "model_used": "GPT-4",
      "pricing": "freemium",
      "category": "Conversational AI",
      "logo": "https://example.com/chatgpt-logo.png",
      "rating": 4.8,
      "source": "futurepedia",
      "crawled_at": "2024-01-15T10:30:15.123Z"
    }
  ]
}
```

## 🔄 定时运行

### 1. 使用 GitHub Actions
创建 `.github/workflows/crawl-tools.yml`:
```yaml
name: Daily AI Tools Crawl
on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点运行
  workflow_dispatch:       # 手动触发

jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run crawl
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          PRODUCT_HUNT_API_KEY: ${{ secrets.PRODUCT_HUNT_API_KEY }}
```

### 2. 使用 Vercel Cron
在 `vercel.json` 中添加：
```json
{
  "crons": [
    {
      "path": "/api/crawl-tools",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### 3. 使用系统 Cron
```bash
# 编辑 crontab
crontab -e

# 添加每日任务
0 2 * * * cd /path/to/project && npm run crawl
```

## 🎯 与 Supabase 集成

### 1. 创建数据表
```sql
CREATE TABLE crawled_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  link TEXT,
  use_case TEXT[],
  model_used TEXT,
  pricing TEXT,
  category TEXT,
  logo TEXT,
  rating NUMERIC,
  source TEXT,
  crawled_at TIMESTAMP WITH TIME ZONE,
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);
```

### 2. 批量导入脚本
```typescript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function importToSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // 读取爬取的数据
  const data = JSON.parse(fs.readFileSync('data/crawled-tools.json', 'utf8'));
  
  // 批量插入
  const { error } = await supabase
    .from('crawled_tools')
    .insert(data.tools);

  if (error) {
    console.error('导入失败:', error);
  } else {
    console.log('✅ 成功导入', data.tools.length, '个工具');
  }
}
```

## 🛠️ 高级功能

### 1. 数据去重
```typescript
// 在 AIToolsCrawler 类中添加
private deduplicateTools(): void {
  const seen = new Set();
  this.tools = this.tools.filter(tool => {
    const key = `${tool.name.toLowerCase()}-${tool.link}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
```

### 2. 数据验证
```typescript
private validateTool(tool: CrawledTool): boolean {
  return !!(
    tool.name &&
    tool.description &&
    tool.link &&
    tool.tags?.length > 0
  );
}
```

### 3. 错误恢复
```typescript
private async retryWithBackoff(fn: Function, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** i));
    }
  }
}
```

## 📋 使用检查清单

- [ ] 配置必要的 API Keys
- [ ] 测试爬虫脚本运行
- [ ] 检查输出数据质量
- [ ] 设置定时运行任务
- [ ] 配置 Supabase 数据表
- [ ] 测试数据导入流程
- [ ] 监控爬取日志和错误
- [ ] 定期检查数据源变化

## 🔍 故障排除

### 常见问题

1. **API 限流**
   - 添加延迟和重试机制
   - 使用多个 API Keys 轮换

2. **网站反爬虫**
   - 使用代理服务（如 ScraperAPI）
   - 随机化请求头和延迟

3. **数据质量问题**
   - 启用 GPT-4 优化功能
   - 添加数据验证规则

4. **内存不足**
   - 分批处理数据
   - 及时清理临时变量

### 调试技巧
```bash
# 开启详细日志
DEBUG=1 npm run crawl

# 只爬取少量数据测试
MAX_TOOLS=5 npm run crawl

# 跳过 GPT 优化以节省时间
SKIP_GPT=1 npm run crawl
```

通过这个爬虫脚本，你将能够：
- 🎯 **自动化获取** 最新 AI 工具信息
- 📊 **标准化数据格式** 便于管理和使用
- 🔄 **定时同步** 保持数据新鲜度
- 🚀 **快速导入** 到你的 AI 工具站数据库
