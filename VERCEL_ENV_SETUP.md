# Vercel 环境变量配置指南

## 🚀 设置步骤

### 1. 登录 Vercel Dashboard
- 访问 https://vercel.com/dashboard
- 选择你的项目 "ToolVerse"

### 2. 进入项目设置
- 点击项目名称进入项目详情
- 点击 "Settings" 标签页
- 在左侧菜单选择 "Environment Variables"

### 3. 添加必需的环境变量

添加以下环境变量（复制你的 .env.local 文件中的值）：

```bash
# Notion 配置 (必需)
NOTION_API_TOKEN=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
NOTION_TOOLS_DATABASE_ID=22ddcb13a9b980aca89ad8e2138a73f3

# 同步配置
CRON_SECRET=default-cron-secret
MANUAL_SYNC_SECRET=default-sync-secret

# Supabase 配置 (可选)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key
SUPABASE_SERVICE_KEY=placeholder-service-key
```

### 4. 环境范围设置
对于每个环境变量，选择适用范围：
- ✅ Production
- ✅ Preview  
- ✅ Development

### 5. 保存并重新部署
- 保存所有环境变量
- 点击 "Deployments" 标签页
- 点击最新部署右侧的三个点菜单
- 选择 "Redeploy"

## 🔍 验证方法

部署完成后，访问你的网站：
- 检查首页是否显示所有工具
- 点击任意工具查看详情页
- 确认数据来源为 Notion 而非 Mock 数据

## ⚠️ 重要提示

1. **不要提交 .env.local 到 Git**
   - 该文件包含敏感信息
   - 已在 .gitignore 中忽略

2. **生产环境 vs 开发环境**
   - 开发环境：读取 .env.local 文件
   - 生产环境：读取 Vercel 环境变量

3. **数据同步**
   - 生产环境会每天凌晨2点自动同步
   - 可通过 /api/sync 手动触发同步
