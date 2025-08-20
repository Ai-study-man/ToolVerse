-- 博客分析数据表创建脚本
-- 用于跟踪博客的真实浏览量和分享量

-- 1. 创建博客分析表
CREATE TABLE blog_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id VARCHAR(255) NOT NULL,
  action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('view', 'share')),
  user_id VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建索引以提高查询性能
CREATE INDEX idx_blog_analytics_blog_id ON blog_analytics(blog_id);
CREATE INDEX idx_blog_analytics_action_type ON blog_analytics(action_type);
CREATE INDEX idx_blog_analytics_timestamp ON blog_analytics(timestamp);
CREATE INDEX idx_blog_analytics_user_id ON blog_analytics(user_id);
CREATE INDEX idx_blog_analytics_created_at ON blog_analytics(created_at);

-- 3. 创建复合索引
CREATE INDEX idx_blog_analytics_blog_action ON blog_analytics(blog_id, action_type);
CREATE INDEX idx_blog_analytics_blog_timestamp ON blog_analytics(blog_id, timestamp);

-- 4. 创建GIN索引用于JSONB查询
CREATE INDEX idx_blog_analytics_metadata ON blog_analytics USING GIN (metadata);

-- 5. 添加表注释
COMMENT ON TABLE blog_analytics IS '博客分析数据表，记录博客的浏览和分享行为';
COMMENT ON COLUMN blog_analytics.id IS '主键ID';
COMMENT ON COLUMN blog_analytics.blog_id IS '博客文章ID';
COMMENT ON COLUMN blog_analytics.action_type IS '行为类型：view(浏览) 或 share(分享)';
COMMENT ON COLUMN blog_analytics.user_id IS '用户ID，可以是注册用户ID或匿名用户标识';
COMMENT ON COLUMN blog_analytics.timestamp IS '行为发生时间';
COMMENT ON COLUMN blog_analytics.metadata IS 'JSON格式的元数据，包含来源、平台、引荐等信息';
COMMENT ON COLUMN blog_analytics.created_at IS '记录创建时间';

-- 6. 创建博客统计视图
CREATE OR REPLACE VIEW blog_stats AS
SELECT 
  blog_id,
  COUNT(CASE WHEN action_type = 'view' THEN 1 END) as view_count,
  COUNT(CASE WHEN action_type = 'share' THEN 1 END) as share_count,
  MAX(timestamp) as last_activity,
  DATE_TRUNC('day', created_at) as activity_date
FROM blog_analytics
GROUP BY blog_id, DATE_TRUNC('day', created_at);

-- 7. 创建热门博客视图
CREATE OR REPLACE VIEW popular_blogs AS
SELECT 
  blog_id,
  COUNT(CASE WHEN action_type = 'view' THEN 1 END) as total_views,
  COUNT(CASE WHEN action_type = 'share' THEN 1 END) as total_shares,
  COUNT(CASE WHEN action_type = 'view' AND timestamp >= NOW() - INTERVAL '7 days' THEN 1 END) as views_7d,
  COUNT(CASE WHEN action_type = 'view' AND timestamp >= NOW() - INTERVAL '30 days' THEN 1 END) as views_30d,
  MAX(timestamp) as last_activity
FROM blog_analytics
GROUP BY blog_id
ORDER BY total_views DESC;

-- 8. 创建博客分享平台统计视图
CREATE OR REPLACE VIEW blog_share_platforms AS
SELECT 
  metadata->>'platform' as platform,
  COUNT(*) as share_count,
  COUNT(DISTINCT blog_id) as unique_blogs,
  DATE_TRUNC('day', created_at) as share_date
FROM blog_analytics
WHERE action_type = 'share' 
  AND metadata->>'platform' IS NOT NULL
  AND metadata->>'platform' != ''
GROUP BY metadata->>'platform', DATE_TRUNC('day', created_at)
ORDER BY share_count DESC;

-- 9. 创建博客引荐来源统计视图
CREATE OR REPLACE VIEW blog_referrers AS
SELECT 
  metadata->>'referrer' as referrer,
  COUNT(*) as referral_count,
  COUNT(DISTINCT blog_id) as unique_blogs,
  DATE_TRUNC('day', created_at) as referral_date
FROM blog_analytics
WHERE action_type = 'view' 
  AND metadata->>'referrer' IS NOT NULL
  AND metadata->>'referrer' != ''
GROUP BY metadata->>'referrer', DATE_TRUNC('day', created_at)
ORDER BY referral_count DESC;

-- 10. 设置行级安全策略 (RLS)
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- 允许所有用户查看统计数据（只读）
CREATE POLICY "Allow read access to blog analytics" ON blog_analytics
FOR SELECT USING (true);

-- 允许插入新的分析记录
CREATE POLICY "Allow insert blog analytics" ON blog_analytics
FOR INSERT WITH CHECK (true);

-- 11. 创建数据清理函数（清理超过1年的数据）
CREATE OR REPLACE FUNCTION cleanup_old_blog_analytics()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM blog_analytics 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 12. 创建获取博客统计的函数
CREATE OR REPLACE FUNCTION get_blog_stats(target_blog_id VARCHAR)
RETURNS TABLE(
  view_count BIGINT,
  share_count BIGINT,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN action_type = 'view' THEN 1 END) as view_count,
    COUNT(CASE WHEN action_type = 'share' THEN 1 END) as share_count,
    MAX(timestamp) as last_activity
  FROM blog_analytics
  WHERE blog_id = target_blog_id;
END;
$$ LANGUAGE plpgsql;
