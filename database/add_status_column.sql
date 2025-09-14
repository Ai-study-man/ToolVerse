-- 添加 status 字段到 tools 表（如果不存在）
-- 在 Supabase SQL Editor 中运行此脚本

-- 首先检查字段是否存在，如果不存在则添加
DO $$
BEGIN
    -- 检查 status 字段是否存在
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tools' 
        AND column_name = 'status'
    ) THEN
        -- 添加 status 字段
        ALTER TABLE tools ADD COLUMN status VARCHAR(20) DEFAULT 'active';
        
        -- 添加检查约束
        ALTER TABLE tools ADD CONSTRAINT tools_status_check 
        CHECK (status IN ('active', 'inactive'));
        
        -- 创建索引以提高查询性能
        CREATE INDEX idx_tools_status ON tools(status);
        
        RAISE NOTICE 'Status 字段已添加到 tools 表';
    ELSE
        RAISE NOTICE 'Status 字段已存在于 tools 表中';
    END IF;
END $$;

-- 创建一个函数来添加字段（用于脚本调用）
CREATE OR REPLACE FUNCTION add_status_column_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- 检查 status 字段是否存在
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tools' 
        AND column_name = 'status'
    ) THEN
        -- 添加 status 字段
        ALTER TABLE tools ADD COLUMN status VARCHAR(20) DEFAULT 'active';
        
        -- 添加检查约束
        ALTER TABLE tools ADD CONSTRAINT tools_status_check 
        CHECK (status IN ('active', 'inactive'));
        
        -- 创建索引以提高查询性能
        CREATE INDEX idx_tools_status ON tools(status);
    END IF;
END $$;
