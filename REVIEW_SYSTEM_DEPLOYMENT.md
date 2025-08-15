# 用户评论和评分系统部署指南

## 📋 系统概述

用户评论和评分系统已完成开发，包含以下功能：
- ✅ 三维评分系统（使用体验、功能匹配度、性价比）
- ✅ 用户评论提交和管理
- ✅ 评论审核工作流
- ✅ 评分统计和展示
- ✅ 响应式UI设计

## 🗄️ 数据库部署

### 步骤1：登录Supabase控制台

1. 访问 [Supabase控制台](https://app.supabase.com)
2. 选择您的项目
3. 进入 "SQL Editor" 页面

### 步骤2：执行数据库迁移

将以下SQL脚本复制粘贴到SQL编辑器中并执行：

```sql
-- 复制 database/create_reviews_table.sql 中的完整内容
```

或者使用Supabase CLI（如果已安装）：

```bash
supabase db push
```

### 步骤3：配置Row Level Security (RLS)

确保在SQL脚本执行后，RLS策略已正确应用：

- reviews表的RLS策略已启用
- 匿名用户可以插入待审核的评论
- 只有已审核的评论对公众可见

## 🔧 环境变量配置

确保以下环境变量在 `.env.local` 中正确配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📦 已创建的组件

### 1. 评分组件 (`src/components/StarRating.tsx`)
- 交互式星级评分
- 支持不同尺寸（sm, md, lg）
- 只读和可编辑模式

### 2. 评论表单 (`src/components/ReviewForm.tsx`)
- 三维度评分输入
- 用户信息收集
- 表单验证和错误处理
- 提交状态管理

### 3. 评论展示 (`src/components/ReviewDisplay.tsx`)
- 评论列表展示
- 评分统计显示
- 多种排序选项
- 分页加载支持

### 4. 评论区组件 (`src/components/ReviewSection.tsx`)
- 集成评论表单和展示
- 统一的用户界面

## 🛣️ API 路由

### 1. 提交评论 (`/api/reviews`)
- POST: 用户提交新评论
- 数据验证和清理
- 防重复提交检查

### 2. 获取评论 (`/api/reviews/[toolId]`)
- GET: 获取特定工具的评论和统计
- 支持排序和分页
- 只返回已审核的评论

## 📊 数据库表结构

### reviews 表
- id: 主键
- tool_id: 工具ID（外键）
- user_nickname: 用户昵称
- user_email: 用户邮箱（不公开）
- experience_rating: 使用体验评分（1-5）
- functionality_rating: 功能匹配度评分（1-5）
- value_rating: 性价比评分（1-5）
- comment: 评论内容
- use_case: 使用场景（可选）
- status: 审核状态（pending/approved/rejected）
- overall_rating: 综合评分（计算字段）

### review_stats 视图
- 工具评分统计
- 平均分计算
- 评论数量统计

## 🎯 集成到工具详情页

评论系统已集成到工具详情页面 (`src/app/tools/[id]/page.tsx`)：

```tsx
import ReviewSection from '../../../components/ReviewSection';

// 在工具详情页面中添加
<ReviewSection 
  toolId={tool.id} 
  toolName={tool.name}
  className="mt-8"
/>
```

## 📱 响应式设计

- 移动端友好的界面
- 自适应布局
- 触摸优化的交互

## 🔒 安全特性

- 防止重复评论
- 内容长度限制
- 输入验证和清理
- Row Level Security保护

## 🚀 部署检查清单

- [ ] 执行数据库迁移SQL
- [ ] 验证Supabase环境变量
- [ ] 测试评论提交功能
- [ ] 测试评论显示功能
- [ ] 检查RLS策略
- [ ] 验证响应式布局
- [ ] 测试排序和筛选

## 📈 后续扩展功能

可以考虑添加的功能：
- 管理员评论审核界面
- 评论举报功能
- 用户评论历史
- 邮件通知系统
- 评论点赞功能

## 🛠️ 故障排除

### 常见问题：

1. **评论无法提交**
   - 检查Supabase连接
   - 验证环境变量
   - 查看浏览器控制台错误

2. **评论不显示**
   - 确认reviews表已创建
   - 检查RLS策略
   - 验证数据是否已审核通过

3. **评分统计不准确**
   - 确认review_stats视图已创建
   - 检查触发器是否正常工作

---

**部署完成后，用户评论和评分系统将完全集成到AI工具站点中，提供丰富的用户互动功能！** 🎉
