-- 创建 RLS 策略以允许前端读取数据
-- 这是推荐的生产环境配置

-- 1. 启用 RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 2. 创建允许匿名用户读取的策略
CREATE POLICY "Allow anonymous read access" ON tools
  FOR SELECT
  TO anon
  USING (true);

-- 3. 如果需要允许认证用户的所有操作
CREATE POLICY "Allow authenticated full access" ON tools
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 验证策略是否创建成功
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tools';
