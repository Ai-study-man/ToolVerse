-- 检查 tools 表的 RLS 状态和策略
-- 请在 Supabase SQL 编辑器中运行此查询

-- 1. 检查表的 RLS 状态
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as "RLS启用",
  CASE 
    WHEN rowsecurity THEN '✅ RLS已启用' 
    ELSE '❌ RLS已禁用' 
  END as "状态"
FROM pg_tables 
WHERE tablename = 'tools';

-- 2. 检查现有的策略
SELECT 
  schemaname as "架构",
  tablename as "表名", 
  policyname as "策略名",
  roles as "角色",
  cmd as "命令类型",
  qual as "条件"
FROM pg_policies 
WHERE tablename = 'tools';

-- 3. 如果需要重新创建策略，运行以下命令：
/*
-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Allow anonymous read access" ON tools;

-- 确保 RLS 已启用
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 创建新策略
CREATE POLICY "Allow anonymous read access" ON tools
  FOR SELECT
  TO anon
  USING (true);

-- 验证策略创建成功
SELECT policyname, roles FROM pg_policies WHERE tablename = 'tools';
*/
