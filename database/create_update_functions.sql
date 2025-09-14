-- 创建更新工具状态的数据库函数
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 创建更新工具状态的函数
CREATE OR REPLACE FUNCTION update_tool_status(tool_id text, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- 使用函数所有者的权限运行
AS $$
BEGIN
  UPDATE tools 
  SET status = new_status, 
      last_updated = now()
  WHERE id = tool_id;
  
  -- 如果没有找到记录，抛出异常
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tool with id % not found', tool_id;
  END IF;
END;
$$;

-- 2. 为 anon 角色授权执行此函数
GRANT EXECUTE ON FUNCTION update_tool_status(text, text) TO anon;
GRANT EXECUTE ON FUNCTION update_tool_status(text, text) TO authenticated;

-- 3. 创建批量更新函数
CREATE OR REPLACE FUNCTION batch_update_tool_status(updates jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  update_count integer := 0;
  update_item jsonb;
BEGIN
  -- 遍历 JSON 数组中的每个更新项
  FOR update_item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    UPDATE tools 
    SET status = (update_item->>'status')::text,
        last_updated = now()
    WHERE id = (update_item->>'id')::text;
    
    IF FOUND THEN
      update_count := update_count + 1;
    END IF;
  END LOOP;
  
  RETURN update_count;
END;
$$;

-- 4. 为批量更新函数授权
GRANT EXECUTE ON FUNCTION batch_update_tool_status(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION batch_update_tool_status(jsonb) TO authenticated;

-- 5. 测试函数（可选）
-- SELECT update_tool_status('test-id', 'active');

-- 6. 显示创建的函数
SELECT 
  proname as function_name,
  proacl as permissions
FROM pg_proc 
WHERE proname IN ('update_tool_status', 'batch_update_tool_status');

COMMENT ON FUNCTION update_tool_status(text, text) IS '安全更新单个工具状态，可被anon用户调用';
COMMENT ON FUNCTION batch_update_tool_status(jsonb) IS '批量更新工具状态，接受JSON数组格式的更新数据';
