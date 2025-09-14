-- 紧急修复：暂时禁用RLS进行测试
-- 仅用于开发测试，生产环境请启用RLS

-- 方案1: 暂时禁用所有表的RLS
ALTER TABLE tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- 如果需要重新启用RLS，请执行：
-- ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
