-- 修复 tools 表的权限问题
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 检查当前RLS状态
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tools';

-- 2. 临时禁用RLS以允许更新操作（如果需要）
-- ALTER TABLE tools DISABLE ROW LEVEL SECURITY;

-- 3. 为anon角色添加UPDATE权限
GRANT UPDATE ON tools TO anon;

-- 4. 为authenticated角色添加完整权限
GRANT ALL ON tools TO authenticated;

-- 5. 创建允许更新的RLS策略
CREATE POLICY "Allow anon updates on tools" ON tools
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- 6. 创建允许插入的RLS策略  
CREATE POLICY "Allow anon inserts on tools" ON tools
FOR INSERT TO anon
WITH CHECK (true);

-- 7. 创建允许删除的RLS策略
CREATE POLICY "Allow anon deletes on tools" ON tools
FOR DELETE TO anon
USING (true);

-- 8. 查看当前策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tools';

-- 9. 测试权限（可选）
-- UPDATE tools SET status = 'active' WHERE id = 'test-id-that-does-not-exist';

COMMENT ON TABLE tools IS 'AI Tools table with anon update permissions for dead link checking';
