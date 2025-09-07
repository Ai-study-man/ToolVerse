-- 修复RLS策略的SQL脚本 (修复版)
-- 请在Supabase SQL编辑器中执行

-- 1. 首先查看现有的策略
SELECT policyname, cmd, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'reviews';

-- 2. 删除所有可能存在的策略名称
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
DROP POLICY IF EXISTS "view_approved_reviews" ON reviews;
DROP POLICY IF EXISTS "insert_pending_reviews" ON reviews;
DROP POLICY IF EXISTS "Allow anonymous insert" ON reviews;
DROP POLICY IF EXISTS "Allow public read approved" ON reviews;

-- 3. 重新创建策略（使用唯一名称）
-- 允许所有人查看已审核的评论
CREATE POLICY "reviews_select_approved" ON reviews
    FOR SELECT 
    TO anon, authenticated
    USING (status = 'approved');

-- 允许匿名用户插入待审核的评论
CREATE POLICY "reviews_insert_pending" ON reviews
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (status = 'pending');

-- 4. 验证新策略是否生效
SELECT policyname, cmd, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'reviews';
