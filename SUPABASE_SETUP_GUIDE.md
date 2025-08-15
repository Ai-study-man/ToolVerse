# Supabase 数据库部署完整指南 - 新手版

## 🌟 什么是 Supabase？

Supabase 是一个开源的 Firebase 替代品，提供：
- PostgreSQL 数据库
- 实时订阅功能
- 用户认证系统
- 自动生成的 API
- 文件存储

对于我们的评论系统，我们主要使用它的 PostgreSQL 数据库功能。

## 🚀 第一步：注册 Supabase 账户

1. **访问官网**
   - 打开浏览器，访问：https://supabase.com
   - 点击右上角 "Start your project" 按钮

2. **注册账户**
   - 可以使用 GitHub、Google 或邮箱注册
   - 推荐使用 GitHub，因为你的项目在 GitHub 上

3. **创建新项目**
   - 登录后点击 "New Project"
   - 选择或创建一个 Organization（组织）
   - 填写项目信息：
     ```
     项目名称: toolverse-reviews (或你喜欢的名字)
     数据库密码: 创建一个强密码并保存好！
     地区: 选择离你最近的地区 (例如: Singapore)
     定价计划: 选择 "Free" (免费版够用)
     ```
   - 点击 "Create new project"

4. **等待项目初始化**
   - 大约需要 1-2 分钟
   - 看到绿色的 "Active" 状态就完成了

## 💾 第二步：执行数据库迁移

### 方法一：使用 SQL Editor（推荐新手）

1. **进入 SQL Editor**
   - 在项目控制台左侧找到 "SQL Editor"
   - 点击进入

2. **创建新查询**
   - 点击 "New Query" 按钮
   - 会打开一个空的 SQL 编辑器

3. **复制粘贴 SQL 代码**
   - 打开我们项目中的文件：`database/create_reviews_table.sql`
   - 将整个文件内容复制
   - 粘贴到 Supabase 的 SQL 编辑器中

4. **执行 SQL**
   - 点击右下角的 "Run" 按钮（或按 Ctrl+Enter）
   - 如果一切正常，会看到 "Success. No rows returned" 消息

### 如果你看不到 create_reviews_table.sql 文件内容，这里是完整的 SQL：

```sql
-- 创建评论表
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id TEXT NOT NULL,
  user_nickname VARCHAR(50) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  experience_rating INTEGER NOT NULL CHECK (experience_rating >= 1 AND experience_rating <= 5),
  functionality_rating INTEGER NOT NULL CHECK (functionality_rating >= 1 AND functionality_rating <= 5),
  value_rating INTEGER NOT NULL CHECK (value_rating >= 1 AND value_rating <= 5),
  comment TEXT NOT NULL CHECK (LENGTH(comment) <= 500),
  use_case TEXT CHECK (LENGTH(use_case) <= 200),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  overall_rating DECIMAL(3,2) GENERATED ALWAYS AS (
    ROUND(((experience_rating + functionality_rating + value_rating)::DECIMAL / 3), 2)
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- 防止重复评论
  UNIQUE(tool_id, user_email)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_overall_rating ON reviews(overall_rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_use_case ON reviews(use_case) WHERE use_case IS NOT NULL;

-- 创建统计视图
CREATE OR REPLACE VIEW review_stats AS
SELECT 
  tool_id,
  COUNT(*) as total_reviews,
  ROUND(AVG(experience_rating)::DECIMAL, 2) as avg_experience_rating,
  ROUND(AVG(functionality_rating)::DECIMAL, 2) as avg_functionality_rating,
  ROUND(AVG(value_rating)::DECIMAL, 2) as avg_value_rating,
  ROUND(AVG(overall_rating)::DECIMAL, 2) as overall_avg_rating
FROM reviews 
WHERE status = 'approved'
GROUP BY tool_id;

-- 启用行级安全 (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 允许匿名用户插入待审核的评论
CREATE POLICY "Allow anonymous insert" ON reviews
FOR INSERT
TO anon
WITH CHECK (status = 'pending');

-- 允许所有人查看已审核的评论
CREATE POLICY "Allow public read approved" ON reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE OR REPLACE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 插入一些示例数据（可选）
INSERT INTO reviews (tool_id, user_nickname, user_email, experience_rating, functionality_rating, value_rating, comment, use_case, status, approved_at)
VALUES 
  ('chatgpt', '张三', 'zhang@example.com', 5, 5, 4, '非常好用的AI工具，界面简洁，响应速度快。在日常工作中帮助很大，特别是文档写作和代码生成方面表现优异。', '文档写作和代码生成', 'approved', CURRENT_TIMESTAMP),
  ('claude', '李四', 'li@example.com', 4, 5, 4, 'Claude的长文本理解能力很强，在处理复杂问题时表现出色。虽然有时候响应稍慢，但准确性很高。', '复杂问题分析', 'approved', CURRENT_TIMESTAMP),
  ('midjourney', '王五', 'wang@example.com', 5, 4, 3, 'AI绘图质量非常高，创意丰富。不过价格稍贵，需要一定的学习成本才能掌握好提示词技巧。', 'UI设计和创意图片生成', 'approved', CURRENT_TIMESTAMP);
```

## 🔑 第三步：获取数据库连接信息

1. **获取项目 URL 和 API 密钥**
   - 在 Supabase 项目控制台，点击左侧的 "Settings"
   - 选择 "API" 选项卡
   - 你会看到：
     ```
     Project URL: https://your-project-id.supabase.co
     anon public key: eyJ... (很长的字符串)
     service_role key: eyJ... (另一个很长的字符串)
     ```
   - **重要**: 复制并保存这些信息！

## 🌐 第四步：配置环境变量

1. **创建环境变量文件**
   - 在你的项目根目录（与 package.json 同级）
   - 创建或编辑 `.env.local` 文件

2. **添加 Supabase 配置**
   ```bash
   # Supabase 配置
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_public_key
   SUPABASE_SERVICE_ROLE_KEY=你的service_role_key
   ```
   
   **注意**:
   - 将 `your-project-id` 替换为你的真实项目ID
   - 将密钥替换为你从 Supabase 复制的实际密钥
   - 不要在这些密钥周围添加引号

3. **保存文件**
   - 确保文件名是 `.env.local` (注意前面的点)
   - 这个文件会被 .gitignore 忽略，不会提交到 GitHub

## ✅ 第五步：验证数据库连接

让我们创建一个简单的测试页面来验证一切是否正常工作：

1. **重新构建项目**
   ```bash
   npm run build
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **访问测试页面**
   - 在浏览器中访问：http://localhost:3000/database-test
   - 这个页面会自动测试所有数据库功能
   - 如果看到"🎉 所有测试通过！数据库配置正确"，说明一切正常

## 🎯 第六步：测试评论功能

1. **访问任意工具详情页**
   - 例如：http://localhost:3000/tools
   - 点击任意工具进入详情页

2. **测试评论功能**
   - 滚动到页面底部，找到"分享您的使用体验"
   - 点击"写评论"按钮
   - 填写表单并提交

3. **审核评论**
   - 在 Supabase 控制台，进入 "Table Editor"
   - 选择 "reviews" 表
   - 找到你刚提交的评论（status为"pending"）
   - 双击status字段，改为"approved"
   - 保存更改

4. **查看已审核的评论**
   - 刷新工具详情页
   - 你的评论应该出现在评论列表中

## 🔧 常见问题排查

### 问题1：找不到表或视图
**错误信息**: relation "reviews" does not exist
**解决方案**:
1. 确认SQL已在Supabase中成功执行
2. 检查是否有语法错误
3. 尝试逐句执行SQL而不是一次性执行全部

### 问题2：权限错误
**错误信息**: permission denied
**解决方案**:
1. 检查RLS策略是否正确启用
2. 确认使用的是正确的API密钥
3. 在Supabase控制台检查Authentication设置

### 问题3：环境变量问题
**错误信息**: supabase客户端为null
**解决方案**:
1. 检查.env.local文件是否在正确位置
2. 确认环境变量名称拼写正确
3. 重启开发服务器（npm run dev）

## 📱 第七步：管理评论

### 审核流程
1. **查看待审核评论**
   - 在Supabase控制台 → Table Editor → reviews表
   - 筛选status = 'pending'

2. **批量操作**
   ```sql
   -- 批量审核通过
   UPDATE reviews SET status = 'approved', approved_at = CURRENT_TIMESTAMP WHERE status = 'pending';
   
   -- 删除垃圾评论
   DELETE FROM reviews WHERE status = 'rejected' AND created_at < NOW() - INTERVAL '30 days';
   ```

3. **统计查询**
   ```sql
   -- 查看评论统计
   SELECT tool_id, COUNT(*) as total, AVG((experience_rating + functionality_rating + value_rating)/3.0) as avg_rating 
   FROM reviews WHERE status = 'approved' GROUP BY tool_id ORDER BY total DESC;
   ```

## 🚀 完成！

恭喜！你的评论系统现在已经完全部署并可以使用了！

### 功能总结：
- ✅ 用户可以提交三维度评分和评论
- ✅ 管理员可以审核评论
- ✅ 自动计算评分统计
- ✅ 响应式设计，支持移动端
- ✅ 安全的数据存储和访问控制

### 下一步可以做的：
- 📊 创建管理员仪表板
- 📧 添加邮件通知功能
- 🔍 实现评论搜索和筛选
- 📈 添加评论趋势分析

---

## 🆘 需要帮助？

如果遇到问题，可以：
1. 访问测试页面查看详细错误信息
2. 查看浏览器控制台的错误日志
3. 检查Supabase项目的日志
4. 参考本指南的常见问题部分

**记住**: 数据库部署只需要做一次，之后就可以一直使用评论功能了！
