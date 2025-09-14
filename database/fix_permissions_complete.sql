-- 🔧 完整的权限修复方案
-- 解决 "permission denied for schema public" 错误

-- 1. 确保 anon 角色可以访问 public schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. 确保 anon 角色可以访问 tools 表
GRANT SELECT ON public.tools TO anon;
GRANT SELECT ON public.tools TO authenticated;

-- 3. 禁用 RLS（如果还没有禁用）
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;

-- 4. 验证权限设置
SELECT 
  table_schema,
  table_name,
  grantee,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'tools' AND table_schema = 'public';

-- 5. 验证 schema 权限
SELECT 
  nspname as schema_name,
  r.rolname as grantee,
  'USAGE' as privilege_type
FROM pg_namespace n
JOIN pg_roles r ON has_schema_privilege(r.oid, n.oid, 'USAGE')
WHERE nspname = 'public' AND r.rolname IN ('anon', 'authenticated');

-- 6. 验证 RLS 状态
SELECT 
  tablename, 
  rowsecurity as "RLS启用"
FROM pg_tables 
WHERE tablename = 'tools' AND schemaname = 'public';
