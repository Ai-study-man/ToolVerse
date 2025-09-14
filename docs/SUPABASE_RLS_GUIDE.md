# Supabase RLS 策略检查指南

## 问题诊断

如果你的前端获取不到数据，很可能是 Supabase 的 Row Level Security (RLS) 策略问题。

## 检查步骤

### 1. 登录 Supabase Dashboard
访问 [supabase.com](https://supabase.com) 并登录你的项目

### 2. 检查 RLS 状态
1. 进入 **Table Editor**
2. 选择 `tools` 表
3. 点击右上角的 **Settings** 图标
4. 查看 "Row Level Security" 状态

### 3. 如果 RLS 已启用，需要添加策略

#### 方法一：直接在 Dashboard 添加策略
1. 在 `tools` 表页面，点击 **RLS** 标签
2. 点击 **Add Policy**
3. 选择 **Custom Policy**
4. 设置以下参数：
   - **Policy Name**: `Enable read access for all users`
   - **Allowed Operation**: `SELECT`
   - **Target Role**: `anon, authenticated`
   - **USING expression**: `true`

#### 方法二：使用 SQL 添加策略
进入 **SQL Editor** 并运行：

```sql
-- 启用 RLS（如果还没启用）
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取所有工具数据
CREATE POLICY "Enable read access for all users" ON tools
FOR SELECT USING (true);
```

### 4. 如果不需要 RLS，可以完全禁用

```sql
-- 禁用 RLS
ALTER TABLE tools DISABLE ROW LEVEL SECURITY;
```

## 验证策略是否生效

### 方法一：访问调试页面
访问你的网站：`https://你的域名.vercel.app/debug`
查看 "Direct Supabase Query Test" 部分是否显示成功。

### 方法二：检查浏览器控制台
1. 打开你的网站首页
2. 按 F12 打开开发者工具
3. 查看 Console 标签页
4. 寻找以 `[useTools]` 或 `[HomePage]` 开头的日志消息

### 方法三：在 Supabase Dashboard 测试
1. 进入 **API** 页面
2. 找到 **tables** 部分
3. 点击 `tools` 表
4. 点击 **Run** 按钮测试查询

## 常见的 RLS 策略示例

```sql
-- 1. 允许所有人读取（推荐用于公开的工具目录）
CREATE POLICY "Public read access" ON tools
FOR SELECT USING (true);

-- 2. 只允许认证用户读取
CREATE POLICY "Authenticated read access" ON tools
FOR SELECT USING (auth.role() = 'authenticated');

-- 3. 基于状态的访问控制
CREATE POLICY "Published tools only" ON tools
FOR SELECT USING (status = 'published');
```

## 排查清单

- [ ] 确认 Supabase URL 和 Key 在 Vercel 环境变量中正确设置
- [ ] 检查 `tools` 表是否存在且有数据
- [ ] 确认 RLS 策略允许 `anon` 角色执行 `SELECT` 操作
- [ ] 验证网络连接和 API 调用是否成功
- [ ] 查看浏览器控制台的错误信息

## 快速解决方案

如果你想快速解决问题，可以临时禁用 RLS：

```sql
ALTER TABLE tools DISABLE ROW LEVEL SECURITY;
```

但建议在生产环境中使用适当的 RLS 策略来保护数据安全。