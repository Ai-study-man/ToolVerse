-- Supabase 数据库表创建脚本
-- 用户行为日志表

-- 1. 创建用户行为日志表
CREATE TABLE user_behavior_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  tool_id VARCHAR(255),
  action_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建索引以提高查询性能
CREATE INDEX idx_user_behavior_logs_user_id ON user_behavior_logs(user_id);
CREATE INDEX idx_user_behavior_logs_tool_id ON user_behavior_logs(tool_id);
CREATE INDEX idx_user_behavior_logs_action_type ON user_behavior_logs(action_type);
CREATE INDEX idx_user_behavior_logs_timestamp ON user_behavior_logs(timestamp);
CREATE INDEX idx_user_behavior_logs_created_at ON user_behavior_logs(created_at);

-- 3. 创建复合索引
CREATE INDEX idx_user_behavior_logs_user_action ON user_behavior_logs(user_id, action_type);
CREATE INDEX idx_user_behavior_logs_tool_action ON user_behavior_logs(tool_id, action_type);

-- 4. 创建 JSONB 字段索引 (用于元数据查询)
CREATE INDEX idx_user_behavior_logs_metadata_source ON user_behavior_logs USING GIN ((metadata->>'source_page'));
CREATE INDEX idx_user_behavior_logs_metadata_search ON user_behavior_logs USING GIN ((metadata->>'search_query'));
CREATE INDEX idx_user_behavior_logs_metadata_device ON user_behavior_logs USING GIN ((metadata->>'device_type'));

-- 5. 添加表注释
COMMENT ON TABLE user_behavior_logs IS '用户行为日志表，记录用户在平台上的所有操作行为';
COMMENT ON COLUMN user_behavior_logs.id IS '主键，UUID格式';
COMMENT ON COLUMN user_behavior_logs.user_id IS '用户ID，关联用户表';
COMMENT ON COLUMN user_behavior_logs.tool_id IS '工具ID，关联工具表，搜索等行为可为空';
COMMENT ON COLUMN user_behavior_logs.action_type IS '行为类型：favorite, like, rate, search, view_tool, visit_website等';
COMMENT ON COLUMN user_behavior_logs.timestamp IS '行为发生时间';
COMMENT ON COLUMN user_behavior_logs.metadata IS 'JSON格式的元数据，包含来源页面、搜索关键词、设备类型等';
COMMENT ON COLUMN user_behavior_logs.created_at IS '记录创建时间';

-- 6. 创建行为类型约束 (可选，用于数据一致性)
ALTER TABLE user_behavior_logs ADD CONSTRAINT check_action_type 
CHECK (action_type IN (
  'favorite', 
  'unfavorite', 
  'like', 
  'unlike', 
  'rate', 
  'search', 
  'view_tool', 
  'visit_website', 
  'filter', 
  'share', 
  'compare'
));

-- 7. 创建用户行为统计视图 (方便查询统计数据)
CREATE OR REPLACE VIEW user_behavior_stats AS
SELECT 
  user_id,
  action_type,
  COUNT(*) as action_count,
  DATE_TRUNC('day', created_at) as action_date
FROM user_behavior_logs
GROUP BY user_id, action_type, DATE_TRUNC('day', created_at);

-- 8. 创建工具行为统计视图
CREATE OR REPLACE VIEW tool_behavior_stats AS
SELECT 
  tool_id,
  action_type,
  COUNT(*) as action_count,
  DATE_TRUNC('day', created_at) as action_date
FROM user_behavior_logs
WHERE tool_id IS NOT NULL
GROUP BY tool_id, action_type, DATE_TRUNC('day', created_at);

-- 9. 创建热门搜索关键词视图
CREATE OR REPLACE VIEW popular_search_terms AS
SELECT 
  metadata->>'search_query' as search_term,
  COUNT(*) as search_count,
  DATE_TRUNC('day', created_at) as search_date
FROM user_behavior_logs
WHERE action_type = 'search' 
  AND metadata->>'search_query' IS NOT NULL
  AND metadata->>'search_query' != ''
GROUP BY metadata->>'search_query', DATE_TRUNC('day', created_at)
ORDER BY search_count DESC;

-- 10. 创建设备类型统计视图
CREATE OR REPLACE VIEW device_type_stats AS
SELECT 
  metadata->>'device_type' as device_type,
  COUNT(*) as usage_count,
  DATE_TRUNC('day', created_at) as usage_date
FROM user_behavior_logs
WHERE metadata->>'device_type' IS NOT NULL
GROUP BY metadata->>'device_type', DATE_TRUNC('day', created_at);

-- 11. 创建数据清理函数 (清理超过1年的日志数据)
CREATE OR REPLACE FUNCTION clean_old_behavior_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_behavior_logs 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 12. 创建定时清理任务 (可选，需要 pg_cron 扩展)
-- SELECT cron.schedule('clean-behavior-logs', '0 2 * * 0', 'SELECT clean_old_behavior_logs();');

-- 13. 启用行级安全策略 (RLS)
ALTER TABLE user_behavior_logs ENABLE ROW LEVEL SECURITY;

-- 14. 创建安全策略 - 用户只能查看自己的行为日志
CREATE POLICY "Users can view own behavior logs" ON user_behavior_logs
  FOR SELECT USING (auth.uid()::text = user_id);

-- 15. 创建安全策略 - 用户只能插入自己的行为日志
CREATE POLICY "Users can insert own behavior logs" ON user_behavior_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- 16. 创建管理员查看所有日志的策略 (可选)
-- CREATE POLICY "Admins can view all logs" ON user_behavior_logs
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM auth.users 
--       WHERE auth.users.id = auth.uid() 
--       AND auth.users.raw_user_meta_data->>'role' = 'admin'
--     )
--   );
