# 死链检测脚本使用指南

## 概述

这个脚本用于检测 ToolVerse 项目中所有 AI 工具的网站可访问性，并将结果保存到数据库和本地文件。

## 功能特性

- ✅ 遍历 Supabase 数据库中的所有工具网站链接
- ✅ 并发检测网站可访问性（默认5个并发）
- ✅ 自动重试机制（最多重试2次）
- ✅ 智能URL规范化（自动添加https协议）
- ✅ 将结果写回数据库 status 字段
- ✅ 生成详细的死链报告文件
- ✅ 友好的进度显示和日志输出

## 使用方法

### 1. 首次使用 - 添加数据库字段

在第一次运行脚本之前，需要在 Supabase 中添加 `status` 字段：

```sql
-- 在 Supabase SQL Editor 中运行以下 SQL
-- 或者直接运行项目中的 database/add_status_column.sql 文件

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tools' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE tools ADD COLUMN status VARCHAR(20) DEFAULT 'active';
        ALTER TABLE tools ADD CONSTRAINT tools_status_check 
        CHECK (status IN ('active', 'inactive'));
        CREATE INDEX idx_tools_status ON tools(status);
    END IF;
END $$;
```

### 2. 运行死链检测

```bash
# 运行死链检测脚本
npm run check-dead-links
```

### 3. 查看结果

检测完成后，你将得到：

1. **数据库更新**：tools 表中的 status 字段会被更新为 'active' 或 'inactive'
2. **死链报告**：项目根目录下生成 `dead_links.json` 文件

## 配置选项

可以修改脚本中的配置参数：

```typescript
const CONFIG = {
  TIMEOUT: 10000,           // 请求超时时间（毫秒）
  CONCURRENT_REQUESTS: 5,   // 并发请求数
  RETRY_COUNT: 2,           // 重试次数
  USER_AGENT: '...',        // 用户代理字符串
};
```

## 检测逻辑

- **Active（正常）**：HTTP 状态码 200-399
- **Inactive（失效）**：
  - HTTP 状态码 404、502 等错误状态
  - 连接超时
  - 域名解析失败
  - 其他网络错误

## 报告文件格式

`dead_links.json` 文件包含以下信息：

```json
{
  "checkedAt": "2025-09-10T10:30:00.000Z",
  "totalChecked": 162,
  "activeCount": 145,
  "inactiveCount": 17,
  "deadLinks": [
    {
      "id": "tool-id-123",
      "name": "工具名称",
      "website": "https://example.com",
      "error": "HTTP 404",
      "statusCode": 404,
      "checkedAt": "2025-09-10T10:30:00.000Z"
    }
  ]
}
```

## 注意事项

1. **网络环境**：确保你的网络环境可以访问外部网站
2. **API限制**：脚本使用了并发控制，避免对目标网站造成压力
3. **超时设置**：默认10秒超时，可根据网络情况调整
4. **环境变量**：确保 `.env.local` 文件中有正确的 Supabase 配置

## 故障排除

### 环境变量错误
```
❌ 缺少 Supabase 环境变量
```
**解决方案**：检查 `.env.local` 文件中的 Supabase 配置

### 数据库连接失败
```
❌ 获取数据失败: ...
```
**解决方案**：检查 Supabase 连接和权限设置

### 大量检测失败
如果大部分网站都检测失败，可能的原因：
- 网络连接问题
- 防火墙阻止
- 目标网站有反爬虫机制

**解决方案**：
1. 调整 `CONCURRENT_REQUESTS` 为更小的值（如 2-3）
2. 增加 `TIMEOUT` 时间
3. 修改 `USER_AGENT` 字符串

## 示例输出

```
🚀 开始死链检测...

📥 从数据库获取工具列表...
📋 找到 162 个工具需要检查

🔍 开始检查网站可访问性...

📦 处理批次 1/33 (5 个网站)
🔍 检查: https://openai.com
✅ 成功: https://openai.com (200)
🔍 检查: https://anthropic.com
✅ 成功: https://anthropic.com (200)
...

💾 更新数据库...
✅ 数据库更新完成: 145 成功, 0 失败

📄 死链报告已生成: /path/to/dead_links.json
📊 统计: 145 个正常, 17 个失效

🎉 死链检测完成!
```

## 高级用法

### 只检测特定工具

如果你想只检测特定的工具，可以修改脚本中的查询：

```typescript
// 例如：只检测特定分类的工具
const { data: tools, error } = await supabase
  .from('tools')
  .select('id, name, website')
  .not('website', 'is', null)
  .eq('category', 'Writing & Content');  // 添加过滤条件
```

### 定时任务

可以将此脚本配置为定时任务：

```bash
# Linux/Mac - 添加到 crontab
# 每天凌晨2点运行
0 2 * * * cd /path/to/ToolVerse && npm run check-dead-links

# Windows - 使用任务计划程序
```

### CI/CD 集成

可以将死链检测集成到 CI/CD 流水线中，定期检查网站状态并发送通知。
