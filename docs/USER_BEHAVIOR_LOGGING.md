# 用户行为日志系统使用指南

## 📊 系统概述

用户行为日志系统用于记录和分析用户在AI工具导航站上的所有行为，包括搜索、浏览、收藏、评分等操作。这些数据将用于个性化推荐、热门工具统计、用户画像分析等功能。

## 🗄️ 数据库表结构

### user_behavior_logs 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，自动生成 |
| user_id | VARCHAR(255) | 用户ID，关联用户表 |
| tool_id | VARCHAR(255) | 工具ID，可为null（如搜索行为） |
| action_type | VARCHAR(50) | 行为类型 |
| timestamp | TIMESTAMP | 行为发生时间 |
| metadata | JSONB | 行为元数据（JSON格式） |
| created_at | TIMESTAMP | 记录创建时间 |

### 支持的行为类型 (action_type)

- `favorite` - 收藏工具
- `unfavorite` - 取消收藏
- `like` - 点赞工具
- `unlike` - 取消点赞
- `rate` - 评分
- `search` - 搜索
- `view_tool` - 访问工具详情页
- `visit_website` - 点击访问工具官网
- `filter` - 使用筛选功能
- `share` - 分享工具
- `compare` - 对比工具

### metadata 字段说明

```json
{
  "source_page": "homepage",           // 来源页面
  "search_query": "AI writing tools",  // 搜索关键词
  "device_type": "desktop",            // 设备类型
  "user_agent": "Mozilla/5.0...",      // 用户代理
  "referrer": "https://google.com",    // 引荐页面
  "session_id": "abc123",              // 会话ID
  "rating_value": 5,                   // 评分值
  "filter_category": "Writing",        // 筛选类别
  "share_platform": "twitter",         // 分享平台
  "ip_address": "192.168.1.1",        // IP地址
  "country": "US",                     // 国家
  "city": "New York"                   // 城市
}
```

## 🔧 使用方法

### 1. 基础配置

首先确保安装了 Supabase 依赖：

```bash
npm install @supabase/supabase-js
```

在环境变量中配置 Supabase 连接信息：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 导入服务

```typescript
import { 
  logAction, 
  logFavorite, 
  logSearch, 
  logViewTool,
  UserBehaviorService 
} from '@/lib/userBehaviorService';
```

### 3. 记录用户行为

#### 记录收藏行为
```typescript
// 用户收藏工具
await logFavorite('user123', 'tool456', 'tool-detail-page');

// 用户取消收藏
await logUnfavorite('user123', 'tool456', 'favorites-page');
```

#### 记录搜索行为
```typescript
// 记录搜索
await logSearch('user123', 'AI writing tools', 'homepage', 25);
```

#### 记录访问工具详情页
```typescript
// 从搜索结果访问工具详情
await logViewTool('user123', 'tool456', 'search-results', 'AI writing');

// 从分类页面访问工具详情
await logViewTool('user123', 'tool456', 'category-page');
```

#### 记录评分行为
```typescript
// 用户给工具评分
await logRating('user123', 'tool456', 5, 'tool-detail-page');
```

#### 记录筛选行为
```typescript
// 按类别筛选
await logFilter('user123', 'category', 'Writing Tools', 'tools-page');

// 按价格筛选
await logFilter('user123', 'pricing', 'free', 'tools-page');
```

#### 记录分享行为
```typescript
// 分享到社交媒体
await logShare('user123', 'tool456', 'twitter', 'tool-detail-page');
```

#### 自定义行为记录
```typescript
// 记录自定义行为
await logAction('user123', 'tool456', 'custom_action', {
  source_page: 'custom-page',
  custom_field: 'custom_value',
  event_data: { key: 'value' }
});
```

### 4. 查询行为数据

#### 获取用户行为历史
```typescript
// 获取用户所有行为
const allBehaviors = await UserBehaviorService.getUserBehaviorHistory('user123');

// 获取用户收藏行为
const favorites = await UserBehaviorService.getUserBehaviorHistory('user123', 'favorite');

// 限制返回数量
const recentBehaviors = await UserBehaviorService.getUserBehaviorHistory('user123', undefined, 20);
```

#### 获取工具行为统计
```typescript
const stats = await UserBehaviorService.getToolBehaviorStats('tool456');
console.log(stats);
// 输出: { views: 100, favorites: 25, likes: 50, ratings: 30, website_visits: 75 }
```

## 📈 数据分析查询示例

### 1. 热门搜索关键词
```sql
SELECT 
  metadata->>'search_query' as search_term,
  COUNT(*) as search_count
FROM user_behavior_logs 
WHERE action_type = 'search' 
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY metadata->>'search_query'
ORDER BY search_count DESC
LIMIT 10;
```

### 2. 最受欢迎的工具
```sql
SELECT 
  tool_id,
  COUNT(*) as view_count
FROM user_behavior_logs 
WHERE action_type = 'view_tool'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY tool_id
ORDER BY view_count DESC
LIMIT 20;
```

### 3. 用户设备分布
```sql
SELECT 
  metadata->>'device_type' as device,
  COUNT(*) as usage_count
FROM user_behavior_logs 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY metadata->>'device_type';
```

### 4. 转化漏斗分析
```sql
WITH funnel_data AS (
  SELECT 
    user_id,
    COUNT(CASE WHEN action_type = 'search' THEN 1 END) as searches,
    COUNT(CASE WHEN action_type = 'view_tool' THEN 1 END) as tool_views,
    COUNT(CASE WHEN action_type = 'visit_website' THEN 1 END) as website_visits,
    COUNT(CASE WHEN action_type = 'favorite' THEN 1 END) as favorites
  FROM user_behavior_logs 
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN searches > 0 THEN 1 END) as users_searched,
  COUNT(CASE WHEN tool_views > 0 THEN 1 END) as users_viewed_tools,
  COUNT(CASE WHEN website_visits > 0 THEN 1 END) as users_visited_websites,
  COUNT(CASE WHEN favorites > 0 THEN 1 END) as users_favorited
FROM funnel_data;
```

## 🔒 数据安全和隐私

### 行级安全策略 (RLS)
- 用户只能查看和插入自己的行为日志
- 管理员可以查看所有日志（可选配置）

### 数据清理
- 自动清理超过1年的历史日志
- 可配置定时清理任务

### 隐私保护
- IP地址和位置信息为可选字段
- 支持用户请求删除个人行为数据
- 遵循GDPR等隐私法规要求

## 🚀 最佳实践

### 1. 异步记录
```typescript
// 不要阻塞用户交互
const handleFavoriteClick = async (toolId: string) => {
  // 立即更新UI
  setIsFavorited(true);
  
  // 异步记录行为日志
  logFavorite(userId, toolId, 'tool-card').catch(console.error);
};
```

### 2. 错误处理
```typescript
// 日志记录失败不应影响核心功能
try {
  await logViewTool(userId, toolId, 'homepage');
} catch (error) {
  console.error('Failed to log behavior:', error);
  // 继续执行其他逻辑
}
```

### 3. 批量记录
```typescript
// 对于频繁的行为，考虑批量记录
const batchLogs = [];
batchLogs.push({ userId, toolId, action: 'view_tool' });
// ... 收集更多日志
// 定期批量提交
```

### 4. 性能优化
- 使用数据库索引优化查询性能
- 定期清理历史数据
- 考虑使用数据库分区
- 对于实时分析，可考虑使用缓存

## 📊 监控和告警

建议设置以下监控指标：
- 日志记录成功率
- 数据库查询性能
- 存储空间使用情况
- 异常行为检测（如大量重复操作）

通过这个系统，你可以深入了解用户行为模式，优化产品功能，提升用户体验。
