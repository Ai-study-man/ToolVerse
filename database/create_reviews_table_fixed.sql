-- 修复后的完整SQL脚本 - 适用于Supabase
-- 创建用户评论和评分表
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id TEXT NOT NULL,
    user_nickname VARCHAR(50) NOT NULL,
    user_email VARCHAR(255) NOT NULL, -- 用于防止重复评论
    
    -- 三个评分维度 (1-5星)
    experience_rating INTEGER NOT NULL CHECK (experience_rating >= 1 AND experience_rating <= 5),
    functionality_rating INTEGER NOT NULL CHECK (functionality_rating >= 1 AND functionality_rating <= 5),
    value_rating INTEGER NOT NULL CHECK (value_rating >= 1 AND value_rating <= 5),
    
    -- 评论内容
    comment TEXT NOT NULL CHECK (char_length(comment) <= 200),
    use_case TEXT, -- 使用场景描述（可选）
    
    -- 审核状态
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- 防止重复评论的唯一约束
    CONSTRAINT unique_user_tool_review UNIQUE(tool_id, user_email)
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_tool_status ON reviews(tool_id, status);

-- 删除已存在的视图（如果有）
DROP VIEW IF EXISTS review_stats;
DROP VIEW IF EXISTS approved_reviews;

-- 创建用于显示的视图（只显示已审核的评论）
CREATE VIEW approved_reviews AS
SELECT 
    id,
    tool_id,
    user_nickname,
    experience_rating,
    functionality_rating,
    value_rating,
    comment,
    use_case,
    created_at,
    approved_at,
    -- 计算综合评分
    ROUND((experience_rating + functionality_rating + value_rating)::numeric / 3, 1) as overall_rating
FROM reviews 
WHERE status = 'approved'
ORDER BY 
    CASE WHEN use_case IS NOT NULL AND use_case != '' THEN 0 ELSE 1 END, -- 优先显示有使用场景的评论
    created_at DESC;

-- 创建工具评分统计视图（兼容我们的API）
CREATE VIEW review_stats AS
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

-- 创建触发器函数以自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全 (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Only admins can update review status" ON reviews;
DROP POLICY IF EXISTS "Allow anonymous insert" ON reviews;
DROP POLICY IF EXISTS "Allow public read approved" ON reviews;

-- 创建新的RLS策略
-- 允许所有人查看已审核的评论
CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT 
    TO anon, authenticated
    USING (status = 'approved');

-- 允许匿名用户提交评论（但状态为pending）
CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (status = 'pending');

-- 插入一些示例数据（用于测试）
INSERT INTO reviews (tool_id, user_nickname, user_email, experience_rating, functionality_rating, value_rating, comment, use_case, status, approved_at) 
VALUES
    ('chatgpt', '测试用户1', 'test1@example.com', 5, 5, 4, 'ChatGPT非常好用，回答准确，界面友好。强烈推荐给大家使用！', '日常工作中用来写代码和文档，效率提升很大', 'approved', CURRENT_TIMESTAMP),
    ('claude', '测试用户2', 'test2@example.com', 4, 5, 4, 'Claude在长文本理解方面表现出色，分析能力很强。', '用于复杂问题分析和学术论文写作', 'approved', CURRENT_TIMESTAMP),
    ('midjourney', '测试用户3', 'test3@example.com', 5, 4, 3, 'AI绘图质量很高，创意丰富，但价格稍贵。', '为公司设计Logo和营销海报', 'approved', CURRENT_TIMESTAMP)
ON CONFLICT (tool_id, user_email) DO NOTHING; -- 避免重复插入

-- 添加表和列的注释
COMMENT ON TABLE reviews IS '用户评论和评分表';
COMMENT ON COLUMN reviews.tool_id IS '工具ID，对应工具的唯一标识';
COMMENT ON COLUMN reviews.experience_rating IS '使用体验评分 (1-5星)';
COMMENT ON COLUMN reviews.functionality_rating IS '功能匹配度评分 (1-5星)';
COMMENT ON COLUMN reviews.value_rating IS '性价比评分 (1-5星)';
COMMENT ON COLUMN reviews.use_case IS '使用场景描述，优先展示此类评论';
COMMENT ON COLUMN reviews.status IS '审核状态：pending(待审核)、approved(已通过)、rejected(已拒绝)';
