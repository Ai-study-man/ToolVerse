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
    
    -- 元数据
    user_ip INET,
    user_agent TEXT,
    device_type VARCHAR(20),
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID, -- 管理员ID
    
    -- 索引优化
    CONSTRAINT unique_user_tool_review UNIQUE(tool_id, user_email)
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_tool_status ON reviews(tool_id, status);

-- 创建用于显示的视图（只显示已审核的评论）
CREATE VIEW IF NOT EXISTS approved_reviews AS
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
    -- 计算平均分
    ROUND((experience_rating + functionality_rating + value_rating)::numeric / 3, 1) as overall_rating
FROM reviews 
WHERE status = 'approved'
ORDER BY 
    CASE WHEN use_case IS NOT NULL AND use_case != '' THEN 0 ELSE 1 END, -- 优先显示有使用场景的评论
    created_at DESC;

-- 创建工具评分统计视图
CREATE VIEW IF NOT EXISTS tool_rating_stats AS
SELECT 
    tool_id,
    COUNT(*) as total_reviews,
    ROUND(AVG(experience_rating)::numeric, 1) as avg_experience_rating,
    ROUND(AVG(functionality_rating)::numeric, 1) as avg_functionality_rating, 
    ROUND(AVG(value_rating)::numeric, 1) as avg_value_rating,
    ROUND(AVG((experience_rating + functionality_rating + value_rating)::numeric / 3), 1) as overall_avg_rating
FROM reviews 
WHERE status = 'approved'
GROUP BY tool_id;

-- 创建触发器以自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 政策
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 允许所有人查看已审核的评论
CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT USING (status = 'approved');

-- 允许任何人提交评论（但状态为pending）
CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT WITH CHECK (status = 'pending');

-- 只有管理员可以更新审核状态
CREATE POLICY "Only admins can update review status" ON reviews
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 插入一些示例数据（可选，用于测试）
INSERT INTO reviews (tool_id, user_nickname, user_email, experience_rating, functionality_rating, value_rating, comment, use_case, status) VALUES
('chatgpt', '小明', 'xiaoming@example.com', 5, 5, 4, 'ChatGPT真的很强大，回答问题很准确，界面也很友好。', '用ChatGPT写代码和文档，效率提升了50%', 'approved'),
('chatgpt', '张三', 'zhangsan@example.com', 4, 5, 3, '功能很全面，但是付费版有点贵。不过确实值得投资。', '主要用来写营销文案，节省了大量时间', 'approved'),
('midjourney', 'AI爱好者', 'ai@example.com', 5, 4, 3, 'Midjourney生成的图片质量非常高，艺术感很强。', '用Midjourney为公司设计Logo和海报，客户很满意', 'approved');

COMMENT ON TABLE reviews IS '用户评论和评分表';
COMMENT ON COLUMN reviews.tool_id IS '工具ID，对应工具的唯一标识';
COMMENT ON COLUMN reviews.experience_rating IS '使用体验评分 (1-5星)';
COMMENT ON COLUMN reviews.functionality_rating IS '功能匹配度评分 (1-5星)';
COMMENT ON COLUMN reviews.value_rating IS '性价比评分 (1-5星)';
COMMENT ON COLUMN reviews.use_case IS '使用场景描述，优先展示此类评论';