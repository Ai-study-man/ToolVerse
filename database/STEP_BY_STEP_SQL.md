# 分步执行SQL指南 - 避免语法错误

如果你遇到SQL语法错误，可以按照以下步骤分别执行：

## 步骤1：创建表（复制到Supabase SQL编辑器）

```sql
-- 步骤1：创建reviews表
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id TEXT NOT NULL,
    user_nickname VARCHAR(50) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    
    experience_rating INTEGER NOT NULL CHECK (experience_rating >= 1 AND experience_rating <= 5),
    functionality_rating INTEGER NOT NULL CHECK (functionality_rating >= 1 AND functionality_rating <= 5),
    value_rating INTEGER NOT NULL CHECK (value_rating >= 1 AND value_rating <= 5),
    
    comment TEXT NOT NULL CHECK (char_length(comment) <= 200),
    use_case TEXT,
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT unique_user_tool_review UNIQUE(tool_id, user_email)
);
```

点击RUN，等待成功提示。

## 步骤2：创建索引

```sql
-- 步骤2：创建索引
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_tool_status ON reviews(tool_id, status);
```

点击RUN，等待成功提示。

## 步骤3：创建统计视图

```sql
-- 步骤3：创建review_stats视图
CREATE OR REPLACE VIEW review_stats AS
SELECT 
    tool_id,
    COUNT(*) as total_reviews,
    ROUND(AVG(experience_rating)::numeric, 2) as avg_experience_rating,
    ROUND(AVG(functionality_rating)::numeric, 2) as avg_functionality_rating, 
    ROUND(AVG(value_rating)::numeric, 2) as avg_value_rating,
    ROUND(AVG((experience_rating + functionality_rating + value_rating)::numeric / 3), 2) as overall_avg_rating
FROM reviews 
WHERE status = 'approved'
GROUP BY tool_id;
```

点击RUN，等待成功提示。

## 步骤4：创建触发器

```sql
-- 步骤4：创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

点击RUN，等待成功提示。

## 步骤5：设置安全策略

```sql
-- 步骤5：启用RLS并创建策略
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT 
    TO anon, authenticated
    USING (status = 'approved');

CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (status = 'pending');
```

点击RUN，等待成功提示。

## 步骤6：插入测试数据

```sql
-- 步骤6：插入示例数据
INSERT INTO reviews (tool_id, user_nickname, user_email, experience_rating, functionality_rating, value_rating, comment, use_case, status, approved_at) 
VALUES
    ('chatgpt', '测试用户1', 'test1@example.com', 5, 5, 4, 'ChatGPT非常好用，回答准确，界面友好。', '用来写代码和文档', 'approved', CURRENT_TIMESTAMP),
    ('claude', '测试用户2', 'test2@example.com', 4, 5, 4, 'Claude长文本理解能力很强。', '复杂问题分析', 'approved', CURRENT_TIMESTAMP),
    ('midjourney', '测试用户3', 'test3@example.com', 5, 4, 3, 'AI绘图质量很高，但价格稍贵。', 'Logo设计', 'approved', CURRENT_TIMESTAMP);
```

点击RUN，等待成功提示。

## 验证是否成功

```sql
-- 验证表是否创建成功
SELECT COUNT(*) FROM reviews;

-- 验证统计视图是否工作
SELECT * FROM review_stats;
```

如果看到数据返回，说明一切正常！
