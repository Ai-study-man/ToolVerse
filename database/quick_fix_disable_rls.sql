-- 🚨 临时快速修复：完全禁用 RLS
-- ⚠️  仅用于开发环境，生产环境请使用适当的策略

-- 禁用 tools 表的 RLS
ALTER TABLE tools DISABLE ROW LEVEL SECURITY;

-- 验证 RLS 状态
SELECT 
  tablename, 
  rowsecurity as "RLS状态",
  CASE 
    WHEN rowsecurity THEN '启用（可能阻止访问）' 
    ELSE '禁用（允许访问）' 
  END as "说明"
FROM pg_tables 
WHERE tablename = 'tools';
