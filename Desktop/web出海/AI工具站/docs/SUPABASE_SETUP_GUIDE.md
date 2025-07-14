# Supabase 用户行为日志系统 - 安装指南

## 📦 安装依赖

首先安装 Supabase 客户端：

```bash
npm install @supabase/supabase-js
```

## 🗄️ 数据库设置

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 获取项目URL和匿名密钥
3. 在项目的SQL编辑器中执行 `database/create_behavior_logs_table.sql` 文件

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🚀 基础使用

### 1. 直接使用服务函数

```typescript
import { logViewTool, logSearch, logFavorite } from '@/lib/userBehaviorService';

// 记录用户搜索
await logSearch('user123', 'AI writing tools', 'homepage', 25);

// 记录访问工具详情
await logViewTool('user123', 'tool456', 'search-results', 'AI writing');

// 记录收藏工具
await logFavorite('user123', 'tool456', 'tool-detail-page');
```

### 2. 使用 Hook (推荐)

```typescript
import { useUserBehavior } from '@/hooks/useUserBehavior';

function ToolCard({ tool, userId }) {
  const { trackFavorite, trackViewTool, trackVisitWebsite } = useUserBehavior(userId);

  const handleFavorite = async () => {
    await trackFavorite(tool.id);
    // 更新UI状态
  };

  const handleVisitWebsite = async () => {
    await trackVisitWebsite(tool.id);
    window.open(tool.website, '_blank');
  };

  // ...
}
```

## 📊 支持的行为类型

| 行为类型 | 描述 | 使用场景 |
|---------|------|----------|
| `favorite` | 收藏工具 | 用户点击收藏按钮 |
| `unfavorite` | 取消收藏 | 用户取消收藏 |
| `like` | 点赞工具 | 用户点赞 |
| `unlike` | 取消点赞 | 用户取消点赞 |
| `rate` | 评分 | 用户给工具评分 |
| `search` | 搜索 | 用户搜索工具 |
| `view_tool` | 访问工具详情 | 点击工具卡片 |
| `visit_website` | 访问官网 | 点击访问官网按钮 |
| `filter` | 筛选 | 使用分类或价格筛选 |
| `share` | 分享 | 分享工具到社交媒体 |
| `compare` | 对比 | 对比多个工具 |

## 🔧 高级配置

### 自定义元数据

```typescript
await trackFavorite('tool123', {
  source_page: 'homepage',
  campaign_id: 'summer_2024',
  ab_test_variant: 'variant_b',
  user_segment: 'premium'
});
```

### 批量记录（未来功能）

```typescript
import { useBatchBehavior } from '@/hooks/useUserBehavior';

const { addToBatch, flush } = useBatchBehavior('user123');

// 添加到批量队列
addToBatch('tool123', 'view_tool', { source: 'scroll' });

// 手动提交
await flush();
```

## 📈 数据查询示例

### 获取用户行为历史

```typescript
import { UserBehaviorService } from '@/lib/userBehaviorService';

// 获取用户所有行为
const behaviors = await UserBehaviorService.getUserBehaviorHistory('user123');

// 获取用户收藏行为
const favorites = await UserBehaviorService.getUserBehaviorHistory('user123', 'favorite');
```

### 获取工具统计

```typescript
const stats = await UserBehaviorService.getToolBehaviorStats('tool123');
console.log(stats); 
// { views: 100, favorites: 25, likes: 50, ratings: 30, website_visits: 75 }
```

## 🔒 隐私和安全

### 行级安全策略

数据库表已启用行级安全策略，确保：
- 用户只能查看自己的行为日志
- 用户只能插入自己的行为日志
- 管理员可以查看所有日志（可选）

### 数据清理

系统包含自动数据清理功能：
- 自动清理超过1年的历史日志
- 可配置定时清理任务

## 🚨 故障排除

### 常见问题

1. **无法连接 Supabase**
   - 检查环境变量是否正确
   - 确认 Supabase 项目状态正常

2. **权限错误**
   - 检查行级安全策略设置
   - 确认用户ID格式正确

3. **日志记录失败**
   - 查看浏览器控制台错误信息
   - 检查网络连接状态

### 调试模式

```typescript
// 启用详细日志
const success = await logViewTool('user123', 'tool456', 'homepage');
if (!success) {
  console.error('Failed to log user behavior');
}
```

## 📊 监控和分析

建议监控的关键指标：
- 日志记录成功率
- 数据库查询性能
- 存储空间使用情况
- 用户行为趋势

使用 Supabase Dashboard 可以方便地查看这些指标。

## 🔄 迁移和升级

当需要添加新的行为类型或字段时：

1. 更新 `ActionType` 类型定义
2. 在 `ActionMetadata` 接口中添加新字段
3. 更新数据库约束（如果需要）
4. 在服务中添加对应的方法

## 🤝 贡献指南

如果需要扩展功能，请：
1. 在 `src/lib/supabase.ts` 中添加类型定义
2. 在 `src/lib/userBehaviorService.ts` 中添加服务方法
3. 在 `src/hooks/useUserBehavior.ts` 中添加 Hook 方法
4. 更新文档和测试

通过这个系统，你可以全面跟踪用户行为，为产品优化和个性化推荐提供数据支持！
