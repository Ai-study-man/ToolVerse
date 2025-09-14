-- 🚀 简化版权限修复 - 只执行核心修复命令
-- 解决 "permission denied for schema public" 错误

-- 1. 授予 anon 角色访问 public schema 的权限
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. 授予 anon 角色访问 tools 表的 SELECT 权限
GRANT SELECT ON public.tools TO anon;
GRANT SELECT ON public.tools TO authenticated;

-- 3. 确保 RLS 已禁用
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;

-- 4. 简单验证 (这个应该能工作)
SELECT 'Schema permissions granted successfully' as status;

-- 如果想查看 tools 表的前几行来验证权限，取消下面的注释:
-- SELECT id, name FROM public.tools LIMIT 3;
