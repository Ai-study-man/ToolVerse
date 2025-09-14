/**
 * useTools Hook - 用于获取 AI 工具数据
 * 
 * 核心功能：
 * 1. ✅ 从 Supabase tools 表拉取数据（按 created_at 降序）
 * 2. ✅ 支持分类筛选和搜索功能
 * 3. ✅ 完整的错误处理和加载状态
 * 4. ✅ 数据刷新功能
 * 5. ✅ TypeScript 类型安全
 * 6. ✅ 自动依赖更新，参数变化时重新获取
 * 
 * 使用示例：
 * ```tsx
 * 'use client';
 * 
 * import { useTools } from '@/hooks/useTools';
 * 
 * export default function ToolsPage() {
 *   // 获取所有工具
 *   const { data: allTools, loading, error, refresh } = useTools();
 *   
 *   // 获取特定分类的工具
 *   const { data: aiTools } = useTools({ category: 'Writing & Content' });
 *   
 *   // 搜索工具
 *   const { data: searchResults } = useTools({ q: 'ChatGPT', limit: 10 });
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       <button onClick={refresh}>刷新数据</button>
 *       {allTools?.map(tool => (
 *         <div key={tool.id}>{tool.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Tool, ToolQueryOptions, UseToolsResult } from '@/types/tool';

export function useTools(options: ToolQueryOptions = {}): UseToolsResult {
  const [data, setData] = useState<Tool[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { limit, category, q } = options;

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 构建查询
      let query = supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      // 应用分类筛选
      if (category) {
        query = query.eq('category', category);
      }

      // 应用搜索筛选
      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
      }

      // 应用数量限制
      if (limit) {
        query = query.limit(limit);
      }

      const { data: tools, error: queryError } = await query;

      if (queryError) {
        throw new Error(`数据库查询失败: ${queryError.message}`);
      }

      setData(tools || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      console.error('useTools 错误:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, category, q]);

  const refresh = useCallback(async () => {
    await fetchTools();
  }, [fetchTools]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}

export default useTools;
